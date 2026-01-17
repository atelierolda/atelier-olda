import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nomClient, emailClient, commentaireGeneral, panier } = req.body;

  // Remplacez ces valeurs par vos variables d'environnement Vercel
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailContent = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f; border: 1px solid #eee; border-radius: 20px; overflow: hidden;">
      <div style="background-color: #f5f5f7; padding: 30px; text-align: center; border-bottom: 1px solid #ddd;">
        <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Bon de Préparation</h1>
        <p style="color: #86868b; margin-top: 10px;">Client : <strong>${nomClient}</strong></p>
      </div>

      <div style="padding: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #1d1d1f;">
              <th style="text-align: left; padding: 12px;">RÉF</th>
              <th style="text-align: left; padding: 12px;">PRODUIT</th>
              <th style="text-align: center; padding: 12px;">QTÉ</th>
            </tr>
          </thead>
          <tbody>
            ${panier.map(item => `
              <tr style="border-bottom: 1px solid #f5f5f7;">
                <td style="padding: 15px 12px; font-weight: bold; font-family: monospace;">${item.reference}</td>
                <td style="padding: 15px 12px;">
                  <span style="font-size: 16px;">${item.couleur}</span>
                  ${item.commentaire ? `<br/><span style="color: #ff3b30; font-size: 12px; font-style: italic;">Note: ${item.commentaire}</span>` : ''}
                </td>
                <td style="padding: 15px 12px; text-align: center;">
                  <span style="background: #f5f5f7; padding: 8px 15px; border-radius: 8px; font-size: 18px; font-weight: bold;">× ${item.quantite}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; padding: 20px; background-color: #fff9c4; border-radius: 12px; border: 1px solid #f1e05a;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px;">Commentaire Client :</h3>
          <p style="margin: 0; font-size: 15px;">${commentaireGeneral || "Aucun commentaire particulier."}</p>
        </div>
      </div>

      <div style="background-color: #f5f5f7; padding: 20px; text-align: center; font-size: 12px; color: #86868b;">
        Contact : ${emailClient || 'Non fourni'} | Atelier OLDA - Commande via Site Web
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Atelier OLDA" <votre-email@gmail.com>',
      to: 'votre-email-de-reception@gmail.com', // Votre adresse qui reçoit les bons
      subject: `NOUVELLE COMMANDE - ${nomClient}`,
      html: emailContent,
    });
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du mail", error });
  }
}
