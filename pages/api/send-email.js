import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nomClient, emailClient, commandeDetails, totalArticles } = req.body;

  try {
    await resend.emails.send({
      from: 'Atelier OLDA <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'contact@atelier-olda.com',
      subject: `Nouvelle commande - ${nomClient}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827;">Nouvelle Commande Atelier OLDA</h1>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h2 style="color: #6b7280; font-size: 14px; text-transform: uppercase;">Client</h2>
            <p><strong>Nom :</strong> ${nomClient}</p>
            <p><strong>Email :</strong> ${emailClient}</p>
            <p style="color: #6b7280;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          
          <h2 style="color: #6b7280; font-size: 14px; text-transform: uppercase;">Détails de la commande</h2>
          <pre style="background: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-family: monospace;">${commandeDetails}</pre>
          
          <div style="background: #111827; color: white; padding: 20px; border-radius: 12px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; color: #9ca3af; font-size: 14px;">Total</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: 600;">${totalArticles} article${totalArticles > 1 ? 's' : ''}</p>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px;">Atelier OLDA - Collection Mugs</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Email envoyé' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ success: false, message: 'Erreur envoi email' });
  }
}
