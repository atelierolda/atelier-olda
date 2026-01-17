export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nomClient, emailClient, commentaire, panier } = req.body;

  // Vérification de la clé API
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY manquante dans les variables d\'environnement');
    return res.status(500).json({ message: 'Configuration email manquante - vérifiez RESEND_API_KEY dans Vercel' });
  }

  const htmlCommande = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          margin: 20px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #1d1d1f 0%, #3a3a3c 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .header p {
          margin: 12px 0 0 0;
          font-size: 17px;
          opacity: 0.8;
        }
        .content {
          padding: 32px;
        }
        .section {
          margin-bottom: 28px;
        }
        .section-title {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1d1d1f;
        }
        .info-row {
          padding: 10px 0;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          background: #f5f5f7;
          border-radius: 10px;
          margin-bottom: 8px;
        }
        .product-name {
          font-weight: 600;
          color: #1d1d1f;
          font-size: 16px;
        }
        .product-ref {
          font-size: 13px;
          color: #86868b;
          margin-top: 4px;
        }
        .product-qty {
          font-weight: 700;
          color: #0071e3;
          font-size: 22px;
        }
        .total {
          margin-top: 20px;
          padding: 18px;
          background: #0071e3;
          color: white;
          border-radius: 10px;
          text-align: center;
          font-size: 19px;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          color: #86868b;
          font-size: 13px;
          padding: 24px 32px;
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
            <div class="section-title">Client</div>
            <div class="info-row">
              <strong>Nom :</strong> ${nomClient}
            </div>
            ${emailClient ? `<div class="info-row"><strong>Email :</strong> ${emailClient}</div>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Articles</div>
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
              <div style="padding: 14px; background: #f5f5f7; border-radius: 10px; white-space: pre-wrap;">${commentaire}</div>
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
    console.log('Tentative d\'envoi email via Resend...');
    
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

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur Resend:', data);
      return res.status(500).json({ 
        message: 'Erreur envoi email', 
        details: data 
      });
    }

    console.log('Email envoyé avec succès:', data);
    res.status(200).json({ message: 'Commande envoyée avec succès' });
    
  } catch (error) {
    console.error('Erreur catch:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
}
