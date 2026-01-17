import React, { useState } from 'react';

export default function CatalogueCommande() {
  const [produits] = useState([
    { id: 1, reference: 'TC 01', image: '/images/mugs/roseblanc.jpg', couleur: 'Rose & Blanc', quantite: 0 },
    { id: 2, reference: 'TC 02', image: '/images/mugs/rougeblanc.jpg', couleur: 'Rouge & Blanc', quantite: 0 },
    { id: 3, reference: 'TC 03', image: '/images/mugs/orangeblanc.jpg', couleur: 'Orange & Blanc', quantite: 0 },
    { id: 4, reference: 'TC 04', image: '/images/mugs/vertblanc.jpg', couleur: 'Vert & Blanc', quantite: 0 },
    { id: 5, reference: 'TC 05', image: '/images/mugs/noirblanc.jpg', couleur: 'Noir & Blanc', quantite: 0 },
    { id: 6, reference: 'TC 06', image: '/images/mugs/noirrose.JPG', couleur: 'Noir & Rose', quantite: 0 },
    { id: 7, reference: 'TC 07', image: '/images/mugs/noirrouge.JPG', couleur: 'Noir & Rouge', quantite: 0 },
    { id: 8, reference: 'TC 08', image: '/images/mugs/noirorange.JPG', couleur: 'Noir & Orange', quantite: 0 },
    { id: 9, reference: 'TC 09', image: '/images/mugs/noirjaune.JPG', couleur: 'Noir & Jaune', quantite: 0 },
    { id: 10, reference: 'TC 10', image: '/images/mugs/noirvert.JPG', couleur: 'Noir & Vert', quantite: 0 }
  ]);

  const [panier, setPanier] = useState([]);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [emailClient, setEmailClient] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);

  const ajouterAuPanier = (produit) => {
    const existe = panier.find(p => p.id === produit.id);
    if (existe) {
      setPanier(panier.map(p => 
        p.id === produit.id ? { ...p, quantite: p.quantite + 1 } : p
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
  };

  const updateQuantite = (id, quantite) => {
    if (quantite <= 0) {
      setPanier(panier.filter(p => p.id !== id));
    } else {
      setPanier(panier.map(p =>
        p.id === id ? { ...p, quantite: parseInt(quantite) } : p
      ));
    }
  };

  const totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

  const envoyerCommande = async () => {
    if (!nomClient || panier.length === 0) {
      alert('Veuillez renseigner votre nom et ajouter au moins un produit');
      return;
    }

    setEnvoiEnCours(true);
    
    try {
      const response = await fetch('/api/envoyer-commande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomClient,
          emailClient,
          commentaire,
          panier
        })
      });

      if (response.ok) {
        setMontrerMerci(true);
        setTimeout(() => {
          setPanier([]);
          setNomClient('');
          setEmailClient('');
          setCommentaire('');
          setMontrerMerci(false);
          setPanierOuvert(false);
        }, 3000);
      } else {
        alert('Erreur lors de l\'envoi');
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f7'
    }}>
      {/* Header */}
      <nav style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #d2d2d7',
        padding: '16px 0',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '21px', 
            fontWeight: '600',
            color: '#1d1d1f'
          }}>
            Atelier Olda
          </h1>
          
          <button
            onClick={() => setPanierOuvert(true)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#1d1d1f',
              position: 'relative',
              padding: '8px 16px'
            }}
          >
            🛒 Panier
            {totalArticles > 0 && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                backgroundColor: '#0071e3',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {totalArticles}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '60px 24px',
        backgroundColor: 'white'
      }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: '#1d1d1f',
          letterSpacing: '-0.02em'
        }}>
          Tasses Céramique
        </h2>
        <p style={{
          fontSize: '21px',
          color: '#6e6e73',
          margin: 0,
          fontWeight: '400'
        }}>
          Collection artisanale. Design élégant.
        </p>
      </div>

      {/* Produits */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '32px'
        }}>
          {produits.map(produit => (
            <div key={produit.id} style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ padding: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  {produit.image && (
                    <img 
                      src={produit.image} 
                      alt={produit.couleur}
                      style={{ 
                        height: '2.5cm', 
                        width: 'auto', 
                        objectFit: 'contain'
                      }}
                    />
                  )}
                  <div>
                    <p style={{ 
                      margin: '0 0 4px 0', 
                      fontSize: '17px', 
                      fontWeight: '600',
                      color: '#1d1d1f'
                    }}>
                      Tasse Céramique
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      color: '#6e6e73'
                    }}>
                      {produit.couleur}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => ajouterAuPanier(produit)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#0071e3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '980px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0077ED'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0071e3'}
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Panier */}
      {panierOuvert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '18px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
          }}>
            {montrerMerci ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 40px'
              }}>
                <div style={{ 
                  fontSize: '64px', 
                  marginBottom: '16px' 
                }}>
                  ✓
                </div>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: '600', 
                  color: '#1d1d1f',
                  margin: '0 0 12px 0'
                }}>
                  Commande envoyée
                </h2>
                <p style={{ 
                  fontSize: '17px', 
                  color: '#6e6e73',
                  margin: 0
                }}>
                  Merci pour votre commande
                </p>
              </div>
            ) : (
              <>
                <div style={{ 
                  padding: '32px',
                  borderBottom: '1px solid #d2d2d7'
                }}>
                  <h2 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '28px', 
                    fontWeight: '600',
                    color: '#1d1d1f'
                  }}>
                    Votre panier
                  </h2>
                  <p style={{ 
                    margin: 0, 
                    color: '#6e6e73',
                    fontSize: '15px'
                  }}>
                    {totalArticles} article{totalArticles > 1 ? 's' : ''}
                  </p>
                </div>

                <div style={{ padding: '32px' }}>
                  {panier.length === 0 ? (
                    <p style={{ 
                      textAlign: 'center', 
                      color: '#6e6e73',
                      fontSize: '17px'
                    }}>
                      Votre panier est vide
                    </p>
                  ) : (
                    <>
                      {panier.map(item => (
                        <div key={item.id} style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px 0',
                          borderBottom: '1px solid #f5f5f7'
                        }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ 
                              margin: '0 0 4px 0',
                              fontSize: '17px',
                              fontWeight: '500',
                              color: '#1d1d1f'
                            }}>
                              {item.couleur}
                            </p>
                            <p style={{ 
                              margin: 0,
                              fontSize: '14px',
                              color: '#6e6e73'
                            }}>
                              {item.reference}
                            </p>
                          </div>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <input 
                              type="number"
                              min="0"
                              value={item.quantite}
                              onChange={(e) => updateQuantite(item.id, e.target.value)}
                              style={{ 
                                width: '60px',
                                padding: '8px',
                                border: '1px solid #d2d2d7',
                                borderRadius: '8px',
                                fontSize: '15px',
                                textAlign: 'center'
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <div style={{ marginTop: '32px' }}>
                        <input 
                          type="text"
                          placeholder="Nom *"
                          value={nomClient}
                          onChange={(e) => setNomClient(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '14px',
                            marginBottom: '12px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            fontSize: '17px',
                            boxSizing: 'border-box'
                          }}
                        />
                        
                        <input 
                          type="email"
                          placeholder="Email (optionnel)"
                          value={emailClient}
                          onChange={(e) => setEmailClient(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '14px',
                            marginBottom: '12px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            fontSize: '17px',
                            boxSizing: 'border-box'
                          }}
                        />
                        
                        <textarea 
                          placeholder="Commentaire (optionnel)"
                          value={commentaire}
                          onChange={(e) => setCommentaire(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '14px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            fontSize: '17px',
                            minHeight: '80px',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <div style={{ 
                        marginTop: '24px',
                        display: 'flex',
                        gap: '12px'
                      }}>
                        <button
                          onClick={envoyerCommande}
                          disabled={envoiEnCours}
                          style={{
                            flex: 1,
                            padding: '14px',
                            backgroundColor: envoiEnCours ? '#d2d2d7' : '#0071e3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '980px',
                            fontSize: '17px',
                            fontWeight: '500',
                            cursor: envoiEnCours ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {envoiEnCours ? 'Envoi...' : 'Commander'}
                        </button>
                        
                        <button
                          onClick={() => setPanierOuvert(false)}
                          style={{
                            padding: '14px 24px',
                            backgroundColor: 'transparent',
                            color: '#0071e3',
                            border: 'none',
                            borderRadius: '980px',
                            fontSize: '17px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Fermer
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
