import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nomClient, emailClient, commentaire, panier } = req.body;

  // Créer le HTML du récapitulatif
  const htmlCommande = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1d1d1f;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 600;
        }
        .section {
          background: #f5f5f7;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1d1d1f;
        }
        .product-item {
          background: white;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-name {
          font-weight: 500;
          color: #1d1d1f;
        }
        .product-ref {
          font-size: 14px;
          color: #6e6e73;
        }
        .product-qty {
          font-weight: 600;
          color: #0071e3;
          font-size: 18px;
        }
        .footer {
          text-align: center;
          color: #6e6e73;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #d2d2d7;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✓ Nouvelle Commande</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">Atelier Olda</p>
      </div>

      <div class="section">
        <div class="section-title">Client</div>
        <p style="margin: 4px 0;"><strong>Nom:</strong> ${nomClient}</p>
        ${emailClient ? `<p style="margin: 4px 0;"><strong>Email:</strong> ${emailClient}</p>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Commande</div>
        ${panier.map(item => `
          <div class="product-item">
            <div>
              <div class="product-name">${item.couleur}</div>
              <div class="product-ref">${item.reference}</div>
            </div>
            <div class="product-qty">×${item.quantite}</div>
          </div>
        `).join('')}
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #d2d2d7; text-align: right;">
          <strong>Total: ${panier.reduce((sum, item) => sum + item.quantite, 0)} article${panier.reduce((sum, item) => sum + item.quantite, 0) > 1 ? 's' : ''}</strong>
        </div>
      </div>

      ${commentaire ? `
        <div class="section">
          <div class="section-title">Commentaire</div>
          <p style="margin: 0; white-space: pre-wrap;">${commentaire}</p>
        </div>
      ` : ''}

      <div class="footer">
        <p>Atelier Olda — Tasses Céramique</p>
        <p style="margin: 8px 0 0 0;">Commande reçue le ${new Date().toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Configuration Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'charlie.jallon@gmail.com',
        pass: process.env.EMAIL_PASSWORD // Vous devrez configurer ceci dans Vercel
      }
    });

    await transporter.sendMail({
      from: '"Atelier Olda" <charlie.jallon@gmail.com>',
      to: 'charlie.jallon@gmail.com',
      subject: `Nouvelle commande — ${nomClient}`,
      html: htmlCommande
    });

    res.status(200).json({ message: 'Commande envoyée avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi' });
  }
}
