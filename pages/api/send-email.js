import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nomClient, emailClient, panier, totalArticles } = req.body;
  const dateCommande = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  try {
    // Email pour vous (l'entreprise)
    const htmlVous = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #fafafa; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 60px 20px;">
          <tr>
            <td align="center">
              <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                
                <!-- En-tête -->
                <tr>
                  <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 50px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;">
                      Commande de ${nomClient}
                    </h1>
                    <p style="margin: 16px 0 0 0; color: #d1d5db; font-size: 16px; font-weight: 400; letter-spacing: 0.01em;">
                      ${dateCommande}
                    </p>
                  </td>
                </tr>

                <!-- Informations client -->
                <tr>
                  <td style="padding: 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; padding: 28px; border: 1px solid #e5e7eb;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600;">
                            INFORMATIONS CLIENT
                          </p>
                          <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.8; font-weight: 400;">
                            <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 80px;">Nom</span>
                            <strong style="font-weight: 600;">${nomClient}</strong>
                          </p>
                          <p style="margin: 0; color: #111827; font-size: 16px; line-height: 1.8; font-weight: 400;">
                            <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 80px;">Email</span>
                            <strong style="font-weight: 600;">${emailClient}</strong>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Produits commandés -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h2 style="margin: 0 0 28px 0; color: #111827; font-size: 20px; font-weight: 600; letter-spacing: -0.01em;">
                      Produits commandés
                    </h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0 16px;">
                      ${panier.map((item, index) => `
                        <tr>
                          <td style="background-color: #f9fafb; border-radius: 12px; padding: 0; border: 1px solid #e5e7eb; overflow: hidden;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 28px 32px;">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 75%; vertical-align: middle;">
                                        <p style="margin: 0 0 12px 0; color: #111827; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.4;">
                                          Tasse Céramique
                                        </p>
                                        ${item.couleur ? `
                                          <p style="margin: 0 0 10px 0; color: #374151; font-size: 15px; font-weight: 500; line-height: 1.6;">
                                            <span style="color: #6b7280; font-weight: 400;">Couleur :</span> ${item.couleur}
                                          </p>
                                        ` : ''}
                                        <p style="margin: 0; color: #9ca3af; font-size: 14px; font-weight: 400; letter-spacing: 0.02em;">
                                          ${item.reference}
                                        </p>
                                      </td>
                                      <td style="width: 25%; text-align: right; vertical-align: middle;">
                                        <p style="margin: 0; color: #111827; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1;">
                                          ×${item.quantite}
                                        </p>
                                        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px; font-weight: 500; letter-spacing: 0.01em;">
                                          ${item.quantite > 1 ? 'pièces' : 'pièce'}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>

                <!-- Total -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); border-radius: 12px; padding: 36px;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                            TOTAL DE LA COMMANDE
                          </p>
                          <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 700; letter-spacing: -0.03em; line-height: 1;">
                            ${totalArticles}
                          </p>
                          <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 16px; font-weight: 500; letter-spacing: 0.01em;">
                            article${totalArticles > 1 ? 's' : ''}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Pied de page -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #9ca3af; font-size: 13px; font-weight: 500; letter-spacing: 0.02em;">
                      Atelier OLDA — Collection Mugs
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Email de confirmation pour le client (même style)
    const htmlClient = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #fafafa; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 60px 20px;">
          <tr>
            <td align="center">
              <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                
                <!-- En-tête -->
                <tr>
                  <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 50px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;">
                      Merci pour votre commande
                    </h1>
                    <p style="margin: 16px 0 0 0; color: #d1d5db; font-size: 16px; font-weight: 400; letter-spacing: 0.01em;">
                      Atelier OLDA
                    </p>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 18px 0; color: #111827; font-size: 18px; line-height: 1.7; font-weight: 400;">
                      Bonjour <strong style="font-weight: 600;">${nomClient}</strong>,
                    </p>
                    <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 16px; line-height: 1.8; font-weight: 400;">
                      Nous avons bien reçu votre commande passée le <strong style="font-weight: 600; color: #111827;">${dateCommande}</strong>. Voici le récapitulatif :
                    </p>
                  </td>
                </tr>

                <!-- Produits -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h2 style="margin: 0 0 28px 0; color: #111827; font-size: 20px; font-weight: 600; letter-spacing: -0.01em;">
                      Vos produits
                    </h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0 16px;">
                      ${panier.map((item, index) => `
                        <tr>
                          <td style="background-color: #f9fafb; border-radius: 12px; padding: 0; border: 1px solid #e5e7eb; overflow: hidden;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 28px 32px;">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 75%; vertical-align: middle;">
                                        <p style="margin: 0 0 12px 0; color: #111827; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.4;">
                                          Tasse Céramique
                                        </p>
                                        ${item.couleur ? `
                                          <p style="margin: 0 0 10px 0; color: #374151; font-size: 15px; font-weight: 500; line-height: 1.6;">
                                            ${item.couleur}
                                          </p>
                                        ` : ''}
                                        <p style="margin: 0; color: #9ca3af; font-size: 14px; font-weight: 400; letter-spacing: 0.02em;">
                                          ${item.reference}
                                        </p>
                                      </td>
                                      <td style="width: 25%; text-align: right; vertical-align: middle;">
                                        <p style="margin: 0; color: #111827; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1;">
                                          ×${item.quantite}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>

                <!-- Total -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); border-radius: 12px; padding: 36px;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                            TOTAL
                          </p>
                          <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 700; letter-spacing: -0.03em; line-height: 1;">
                            ${totalArticles}
                          </p>
                          <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 16px; font-weight: 500; letter-spacing: 0.01em;">
                            article${totalArticles > 1 ? 's' : ''}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Message de fin -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 16px; line-height: 1.8; font-weight: 400;">
                      Nous vous contacterons très prochainement pour confirmer votre commande et organiser la livraison.
                    </p>
                    <p style="margin: 0; color: #111827; font-size: 16px; line-height: 1.8; font-weight: 600;">
                      Merci de votre confiance !
                    </p>
                  </td>
                </tr>

                <!-- Pied de page -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #9ca3af; font-size: 13px; font-weight: 500; letter-spacing: 0.02em;">
                      Atelier OLDA — Collection Mugs
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Envoyer les emails
    await resend.emails.send({
      from: 'Atelier OLDA <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'contact@atelier-olda.com',
      subject: `Commande de ${nomClient} — ${dateCommande}`,
      html: htmlVous,
    });

    await resend.emails.send({
      from: 'Atelier OLDA <onboarding@resend.dev>',
      to: emailClient,
      subject: 'Confirmation de votre commande — Atelier OLDA',
      html: htmlClient,
    });

    res.status(200).json({ success: true, message: 'Emails envoyés' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ success: false, message: 'Erreur envoi email', error: error.message });
  }
}
