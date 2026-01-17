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
    // Construction de la liste des produits pour le mail
    const itemsHtml = panier.map(item => `
      <div style="padding: 12px 0; border-bottom: 0.5px solid #e5e5e7;">
        <p style="margin: 0; font-weight: 600;">${item.reference}</p>
        <p style="margin: 0; color: #86868b; font-size: 13px;">Couleur: ${item.couleur || 'Standard'}</p>
        <p style="margin: 4px 0 0 0;">Quantité: ${item.quantite}</p>
      </div>
    `).join('');

    // Email pour vous (l'entreprise)
    const htmlVous = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 40px; font-family: -apple-system, sans-serif; background-color: #ffffff; color: #1d1d1f;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.02em;">Nouvelle commande</h1>
          <p style="color: #86868b;">Reçue le ${dateCommande}</p>
          
          <div style="margin: 32px 0; padding: 24px; background-color: #f5f5f7; border-radius: 12px;">
            <p style="margin: 0 0 8px 0;"><strong>Client:</strong> ${nomClient}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${emailClient}</p>
            <p style="margin: 0;"><strong>Commentaire:</strong> ${commentaire || 'Aucun'}</p>
          </div>

          <div style="margin-bottom: 32px;">
            <h2 style="font-size: 17px; font-weight: 600; margin-bottom: 16px;">Détail du panier</h2>
            ${itemsHtml}
          </div>

          <div style="text-align: right; font-size: 19px; font-weight: 600;">
            Total: ${totalArticles} articles
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoi de l'email via Resend
    await resend.emails.send({
      from: 'Atelier Olda <onboarding@resend.dev>', // Ou votre domaine vérifié
      to: 'votre-email@exemple.com', // REMPLACEZ PAR VOTRE EMAIL
      subject: `Commande de ${nomClient} - ${totalArticles} articles`,
      html: htmlVous,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
