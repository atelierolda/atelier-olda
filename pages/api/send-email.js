export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nomClient, emailClient, commentaire, panier } = req.body;

  const htmlCommande = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          line-height: 1.6;
          color: #1d1d1f;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
          background-color: #fbfbfd;
        }
        .container {
          background: white;
          margin: 40px 20px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #1d1d1f 0%, #3a3a3c 100%);
          color: white;
          padding: 48px 40px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 36px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .header p {
          margin: 12px 0 0 0;
          font-size: 17px;
          opacity: 0.8;
        }
        .content {
          padding: 40px;
        }
        .section {
          margin-bottom: 32px;
        }
        .section-title {
          font-size: 19px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1d1d1f;
        }
        .info-row {
          padding: 12px 0;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f5f5f7;
          border-radius: 12px;
          margin-bottom: 8px;
        }
        .product-name {
          font-weight: 600;
          color: #1d1d1f;
          font-size: 17px;
        }
        .product-ref {
          font-size: 14px;
          color: #86868b;
          margin-top: 4px;
        }
        .product-qty {
          font-weight: 700;
          color: #0071e3;
          font-size: 24px;
        }
        .total {
          margin-top: 24px;
          padding: 20px;
          background: #0071e3;
          color: white;
          border-radius: 12px;
          text-align: center;
          font-size: 21px;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          color: #86868b;
          font-size: 14px;
          padding: 32px 40px;
          border-top: 1px solid rgba(0,0,0,0.04);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle Commande</h1>
          <p>Atelier Olda — Tasses Céramique</p>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">Informations Client</div>
            <div class="info-row">
              <strong>Nom :</strong> ${nomClient}
            </div>
            ${emailClient ? `<div class="info-row"><strong>Email :</strong> ${emailClient}</div>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Articles Commandés</div>
            ${panier.map(item => `
              <div class="product-item">
                <div>
                  <div class="product-name">${item.couleur}</div>
                  <div class="product-ref">${item.reference}</div>
                </div>
                <div class="product-qty">×${item.quantite}</div>
              </div>
            `).join('')}
            
            <div class="total">
              Total : ${panier.reduce((sum, item) => sum + item.quantite, 0)} article${panier.reduce((sum, item) => sum + item.quantite, 0) > 1 ? 's' : ''}
            </div>
          </div>

          ${commentaire ? `
            <div class="section">
              <div class="section-title">Commentaire</div>
              <div style="padding: 16px; background: #f5f5f7; border-radius: 12px; white-space: pre-wrap;">${commentaire}</div>
            </div>
          ` : ''}
        </div>

        <div class="footer">
          Commande reçue le ${new Date().toLocaleString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Utilisation de Resend (plus fiable que Gmail pour Vercel)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Atelier Olda <onboarding@resend.dev>',
        to: 'charlie.jallon@gmail.com',
        subject: `Nouvelle commande — ${nomClient}`,
        html: htmlCommande
      })
    });

    if (!response.ok) {
      throw new Error('Erreur envoi email');
    }

    res.status(200).json({ message: 'Commande envoyée' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
}
