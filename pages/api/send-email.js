import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Non autorisé');

  const { nomClient, panier } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #1d1d1f; padding: 40px;">
      
      <div style="text-align: center; margin-bottom: 60px;">
        <h1 style="font-size: 14px; letter-spacing: 4px; text-transform: uppercase; color: #86868b; margin-bottom: 10px;">Bon de Préparation</h1>
        <h2 style="font-size: 32px; font-weight: 700; margin: 0;">${nomClient}</h2>
      </div>

      <div style="border-top: 1px solid #e5e5e5; padding-top: 30px;">
        ${panier.map(item => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 30px 0; border-bottom: 1px solid #f5f5f7;">
            <div style="flex: 1;">
              <div style="font-size: 12px; color: #0071e3; font-weight: 700; margin-bottom: 5px; text-transform: uppercase;">${item.reference}</div>
              <div style="font-size: 20px; font-weight: 500;">${item.couleur}</div>
              ${item.commentaire ? `<div style="margin-top: 10px; padding: 10px; background: #fff9c4; border-radius: 8px; font-size: 14px; color: #000;">Note : ${item.commentaire}</div>` : ''}
            </div>
            <div style="margin-left: 40px; text-align: right;">
              <div style="font-size: 14px; color: #86868b;">Quantité</div>
              <div style="font-size: 48px; font-weight: 700; line-height: 1;">${item.quantite}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 60px; text-align: center; border-top: 1px solid #1d1d1f; padding-top: 30px;">
        <p style="font-size: 12px; color: #86868b;">Généré le ${new Date().toLocaleDateString('fr-FR')} • Atelier OLDA</p>
      </div>

    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Atelier OLDA" <votre-email@gmail.com>',
      to: 'votre-email-de-reception@gmail.com',
      subject: `PREPA : ${nomClient}`,
      html: emailHtml,
    });
    return res.status(200).send('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
