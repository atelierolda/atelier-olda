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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #1d1d1f;
          background-color: #f5f5f7;
          padding: 40px 20px;
        }
        .container {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .header {
          background: linear-gradient(135deg, #1d1d1f 0%, #424245 100%);
          color: white;
          padding: 50px 40px;
          text-align: center;
        }
        .header h1 {
          font-size: 36px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .header p {
          font-size: 18px;
          opacity: 0.85;
          font-weight: 400;
        }
        .order-info {
          padding: 40px;
          background: #fbfbfd;
          border-bottom: 1px solid #e5e5e7;
        }
        .order-info h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1d1d1f;
        }
        .info-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #e5e5e7;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #86868b;
          min-width: 120px;
          font-size: 15px;
        }
        .info-value {
          color: #1d1d1f;
          font-size: 15px;
          flex: 1;
        }
        .products-section {
          padding: 40px;
        }
        .products-section h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 30px;
          color: #1d1d1f;
        }
        .product-card {
          background: #fbfbfd;
          border: 1px solid #e5e5e7;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .product-info {
          flex: 1;
        }
        .product-name {
          font-size: 19px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .product-ref {
          font-size: 14px;
          color: #86868b;
          margin-bottom: 4px;
        }
        .product-qty {
          font-size: 28px;
          font-weight: 700;
          color: #0071e3;
          line-height: 1;
          min-width: 60px;
          text-align: right;
        }
        .product-comment {
          background: white;
          border-left: 3px solid #0071e3;
          padding: 14px 16px;
          margin-top: 16px;
          border-radius: 8px;
        }
        .comment-label {
          font-size: 12px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .comment-text {
          font-size: 15px;
          color: #1d1d1f;
          line-height: 1.5;
          font-style: italic;
        }
        .total-section {
          background: #0071e3;
          color: white;
          padding: 28px 40px;
          text-align: center;
        }
        .total-section .total-label {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .total-section .total-value {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .general-comment-section {
          padding: 40px;
          background: #fbfbfd;
          border-top: 1px solid #e5e5e7;
        }
        .general-comment-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1d1d1f;
        }
        .general-comment-box {
          background: white;
          border: 1px solid #e5e5e7;
          border-radius: 10px;
          padding: 20px;
          font-size: 15px;
          color: #1d1d1f;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .footer {
          padding: 32px 40px;
          text-align: center;
          background: #fbfbfd;
          border-top: 1px solid #e5e5e7;
        }
        .footer p {
          color: #86868b;
          font-size: 14px;
          line-height: 1.6;
        }
        .footer .date {
          font-weight: 600;
          color: #1d1d1f;
          margin-top: 8px;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .container {
            box-shadow: none;
            border: 1px solid #e5e5e7;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>📋 BON DE COMMANDE</h1>
          <p>Atelier Olda — Tasses Céramique</p>
        </div>

        <!-- Informations Client -->
        <div class="order-info">
          <h2>Informations Client</h2>
          <div class="info-row">
            <div class="info-label">Client :</div>
            <div class="info-value">${nomClient}</div>
          </div>
          ${emailClient ? `
          <div class="info-row">
            <div class="info-label">Email :</div>
            <div class="info-value">${emailClient}</div>
          </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">Date :</div>
            <div class="info-value">${new Date().toLocaleString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
        </div>

        <!-- Articles Commandés -->
        <div class="products-section">
          <h2>Articles à Préparer</h2>
          ${panier.map((item, index) => `
            <div class="product-card">
              <div class="product-header">
                <div class="product-info">
                  <div class="product-name">${item.couleur}</div>
                  <div class="product-ref">Référence : ${item.reference}</div>
                </div>
                <div class="product-qty">×${item.quantite}</div>
              </div>
              ${item.commentaire ? `
                <div class="product-comment">
                  <div class="comment-label">Note du client</div>
                  <div class="comment-text">${item.commentaire}</div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Total -->
        <div class="total-section">
          <div class="total-label">Total Articles</div>
          <div class="total-value">${panier.reduce((sum, item) => sum + item.quantite, 0)}</div>
        </div>

        <!-- Commentaire Général -->
        ${commentaire ? `
        <div class="general-comment-section">
          <h3>💬 Commentaire Général</h3>
          <div class="general-comment-box">${commentaire}</div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
          <p>Ce bon de commande est à préparer pour le client.</p>
          <p class="date">Commande reçue le ${new Date().toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
          })} à ${new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
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
        subject: `📋 Nouvelle commande — ${nomClient} — ${panier.reduce((sum, item) => sum + item.quantite, 0)} articles`,
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
