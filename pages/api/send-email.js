import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nomClient, emailClient, panier, totalArticles, commentaire } = req.body;
  const dateCommande = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  try {
    const itemsHtml = panier.map(item => `
      <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
        <p><strong>${item.reference}</strong> - ${item.couleur || 'Standard'}</p>
        <p>Quantité: ${item.quantite}</p>
      </div>
    `).join('');

    const htmlVous = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Nouvelle commande de ${nomClient}</h2>
          <p>Date : ${dateCommande}</p>
          <p>Email client : ${emailClient}</p>
          <p>Commentaire : ${commentaire || 'Aucun'}</p>
          <hr />
          ${itemsHtml}
          <h3>Total : ${totalArticles} articles</h3>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'VOTRE_EMAIL_ICI@GMAIL.COM', // <--- METTEZ VOTRE EMAIL ICI
      subject: `Commande de ${nomClient}`,
      html: htmlVous,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}
