import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nomClient, emailClient, panier, totalArticles } = req.body;

  try {
    // Email pour vous (avec images)
    const htmlVous = `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: #111827; margin: 0; font-size: 28px; font-weight: 600;">Nouvelle Commande</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Atelier OLDA</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #6366f1;">
            <h2 style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 15px 0;">Informations client</h2>
            <p style="margin: 5px 0; color: #111827;"><strong>Nom :</strong> ${nomClient}</p>
            <p style="margin: 5px 0; color: #111827;"><strong>Email :</strong> ${emailClient}</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Date : ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          
          <h2 style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0;">Produits commandés</h2>
          
          ${panier.map((item, index) => `
            <div style="display: flex; gap: 16px; padding: 16px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 12px;">
              ${item.image ? `
                <img src="${item.image}" alt="Tasse" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
              ` : `
                <div style="width: 80px; height: 80px; background: #f3f4f6; border-radius: 8px; flex-shrink: 0;"></div>
              `}
              <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 16px; font-weight: 600;">Tasse Céramique</h3>
                ${item.couleur ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">Couleur : ${item.couleur}</p>` : ''}
                <p style="margin: 4px 0; color: #9ca3af; font-size: 12px;">${item.reference}</p>
                <p style="margin: 8px 0 0 0; color: #111827; font-weight: 600;">Quantité : ${item.quantite}</p>
              </div>
            </div>
          `).join('')}
          
          <div style="background: linear-gradient(135deg, #111827 0%, #374151 100%); color: white; padding: 24px; border-radius: 12px; text-align: center; margin-top: 30px;">
            <p style="margin: 0; font-size: 14px; color: #9ca3af;">Total de la commande</p>
            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 700;">${totalArticles} article${totalArticles > 1 ? 's' : ''}</p>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 16px 16px;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">Atelier OLDA - Collection Mugs</p>
        </div>
      </div>
    `;

    // Email pour le client (confirmation)
    const htmlClient = `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: #111827; margin: 0; font-size: 28px; font-weight: 600;">Merci pour votre commande !</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Atelier OLDA</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Bonjour <strong>${nomClient}</strong>,</p>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">Nous avons bien reçu votre commande. Voici le récapitulatif :</p>
          
          <h2 style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 30px 0 20px 0;">Vos produits</h2>
          
          ${panier.map((item) => `
            <div style="display: flex; gap: 16px; padding: 16px; background: #f9fafb; border-radius: 12px; margin-bottom: 12px;">
              ${item.image ? `
                <img src="${item.image}" alt="Tasse" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
              ` : `
                <div style="width: 80px; height: 80px; background: #e5e7eb; border-radius: 8px; flex-shrink: 0;"></div>
              `}
              <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 16px; font-weight: 600;">Tasse Céramique</h3>
                ${item.couleur ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${item.couleur}</p>` : ''}
                <p style="margin: 4px 0; color: #9ca3af; font-size: 12px;">${item.reference}</p>
                <p style="margin: 8px 0 0 0; color: #111827; font-weight: 600;">× ${item.quantite}</p>
              </div>
            </div>
          `).join('')}
          
          <div style="background: linear-gradient(135deg, #111827 0%, #374151 100%); color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; color: #9ca3af;">Total</p>
            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 700;">${totalArticles} article${totalArticles > 1 ? 's' : ''}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">Nous vous contacterons très prochainement pour confirmer votre commande.</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">Merci de votre confiance !</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 16px 16px;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">Atelier OLDA - Collection Mugs</p>
        </div>
      </div>
    `;

    // Envoyer l'email à vous
    await resend.emails.send({
      from: 'Atelier OLDA <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'contact@atelier-olda.com',
      subject: `Nouvelle commande - ${nomClient}`,
      html: htmlVous,
    });

    // Envoyer la confirmation au client
    await resend.emails.send({
      from: 'Atelier OLDA <onboarding@resend.dev>',
      to: emailClient,
      subject: 'Confirmation de votre commande - Atelier OLDA',
      html: htmlClient,
    });

    res.status(200).json({ success: true, message: 'Emails envoyés' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ success: false, message: 'Erreur envoi email' });
  }
}
