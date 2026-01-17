import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Non autorisé');

  const { nomClient, panier } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const emailHtml = `
    <div style="font-family: -apple-system, sans-serif; padding: 40px; color: #000; background-color: #ffffff; max-width: 600px; margin: 0 auto;">
      <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 11px; color: #86868b; margin-bottom: 5px;">Atelier OLDA</p>
      <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 40px 0; border-bottom: 2px solid #000; padding-bottom: 20px;">
        ${nomClient}
      </h1>

      ${panier.map(item => `
        <div style="padding: 30px 0; border-bottom: 1px solid #e5e5e5; display: flex;">
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 13px; color: #0071e3; font-weight: 600; text-transform: uppercase;">${item.reference}</p>
            <h2 style="margin: 5px 0; font-size: 20px; font-weight: 500;">${item.couleur}</h2>
            ${item.commentaire ? `<p style="margin-top: 10px; color: #86868b; font-style: italic; font-size: 14px;">Note : ${item.commentaire}</p>` : ''}
          </div>
          <div style="margin-left: 40px; text-align: right;">
            <p style="margin: 0; font-size: 12px; color: #86868b; text-transform: uppercase;">Quantité</p>
            <p style="margin: 0; font-size: 48px; font-weight: 700;">${item.quantite}</p>
          </div>
        </div>
      `).join('')}

      <div style="margin-top: 50px; text-align: center; color: #86868b; font-size: 11px; letter-spacing: 1px;">
        BON DE PRÉPARATION GÉNÉRÉ LE ${new Date().toLocaleDateString('fr-FR')}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Atelier OLDA" <votre-email@gmail.com>',
      to: 'votre-email-de-reception@gmail.com',
      subject: `NOUVELLE COMMANDE : ${nomClient}`,
      html: emailHtml,
    });
    return res.status(200).send('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
