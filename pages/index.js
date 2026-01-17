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
  const [quantiteSelectionnee, setQuantiteSelectionnee] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [emailClient, setEmailClient] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);

  const ajouterAuPanier = (produit, quantite) => {
    if (quantite <= 0) return;
    
    const existe = panier.find(p => p.id === produit.id);
    if (existe) {
      setPanier(panier.map(p => 
        p.id === produit.id ? { ...p, quantite: p.quantite + quantite } : p
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: quantite }]);
    }
    
    setQuantiteSelectionnee({ ...quantiteSelectionnee, [produit.id]: 1 });
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#fbfbfd'
    }}>
      {/* Header minimaliste */}
      <nav style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(251, 251, 253, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '12px 0',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo Olda à gauche */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/logo.png" 
              alt="Olda" 
              style={{ height: '32px', width: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span style={{ 
              display: 'none',
              fontSize: '20px', 
              fontWeight: '600',
              color: '#1d1d1f',
              letterSpacing: '-0.01em'
            }}>
              OLDA
            </span>
          </div>
          
          {/* Icône panier Apple */}
          <button
            onClick={() => setPanierOuvert(true)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 2.5H2.5L4.5 17.5H14.5L16.5 7.5H3.5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {totalArticles > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '0px',
                backgroundColor: '#000',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {totalArticles}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero ultra minimaliste */}
      <div style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        maxWidth: '980px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '600',
          margin: '0',
          color: '#1d1d1f',
          letterSpacing: '-0.02em',
          lineHeight: '1.07'
        }}>
          Catalogue Tasse OLDA
        </h1>
      </div>

      {/* Grid produits ultra clean */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 48px 120px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '12px'
        }}>
          {produits.map(produit => (
            <div key={produit.id} style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '32px 24px',
              border: '1px solid rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {/* Image et texte */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px',
                marginBottom: '24px'
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
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '19px', 
                    fontWeight: '600',
                    color: '#1d1d1f',
                    letterSpacing: '-0.01em'
                  }}>
                    Tasse Céramique
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: '#86868b',
                    fontWeight: '400'
                  }}>
                    {produit.couleur}
                  </p>
                </div>
              </div>
              
              {/* Dropdown quantité façon Apple */}
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                alignItems: 'center'
              }}>
                <select
                  value={quantiteSelectionnee[produit.id] || 1}
                  onChange={(e) => setQuantiteSelectionnee({
                    ...quantiteSelectionnee,
                    [produit.id]: parseInt(e.target.value)
                  })}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #d2d2d7',
                    borderRadius: '12px',
                    fontSize: '17px',
                    color: '#1d1d1f',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                    paddingRight: '40px'
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => ajouterAuPanier(produit, quantiteSelectionnee[produit.id] || 1)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#0071e3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0077ED'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#0071e3'}
                >
                  Ajouter
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
          backgroundColor: 'rgba(0,0,0,0.48)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '24px',
          backdropFilter: 'blur(20px)'
        }}
        onClick={() => setPanierOuvert(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '28px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {montrerMerci ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 40px'
              }}>
                <div style={{ 
                  fontSize: '72px', 
                  marginBottom: '24px',
                  fontWeight: '300'
                }}>
                  ✓
                </div>
                <h2 style={{ 
                  fontSize: '40px', 
                  fontWeight: '600', 
                  color: '#1d1d1f',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.02em'
                }}>
                  Merci
                </h2>
                <p style={{ 
                  fontSize: '19px', 
                  color: '#86868b',
                  margin: 0,
                  fontWeight: '400'
                }}>
                  Votre commande a été envoyée
                </p>
              </div>
            ) : (
              <>
                <div style={{ 
                  padding: '40px 40px 32px',
                  borderBottom: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ 
                      margin: 0, 
                      fontSize: '32px', 
                      fontWeight: '600',
                      color: '#1d1d1f',
                      letterSpacing: '-0.02em'
                    }}>
                      Panier
                    </h2>
                    <button
                      onClick={() => setPanierOuvert(false)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '28px',
                        color: '#86868b',
                        cursor: 'pointer',
                        padding: '4px',
                        lineHeight: '1'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    color: '#86868b',
                    fontSize: '17px',
                    fontWeight: '400'
                  }}>
                    {totalArticles} article{totalArticles > 1 ? 's' : ''}
                  </p>
                </div>

                <div style={{ padding: '32px 40px 40px' }}>
                  {panier.length === 0 ? (
                    <p style={{ 
                      textAlign: 'center', 
                      color: '#86868b',
                      fontSize: '19px',
                      padding: '40px 0',
                      margin: 0
                    }}>
                      Votre panier est vide
                    </p>
                  ) : (
                    <>
                      <div style={{ marginBottom: '32px' }}>
                        {panier.map(item => (
                          <div key={item.id} style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px 0',
                            borderBottom: '1px solid rgba(0,0,0,0.04)'
                          }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ 
                                margin: '0 0 4px 0',
                                fontSize: '17px',
                                fontWeight: '600',
                                color: '#1d1d1f'
                              }}>
                                {item.couleur}
                              </p>
                              <p style={{ 
                                margin: 0,
                                fontSize: '14px',
                                color: '#86868b'
                              }}>
                                {item.reference}
                              </p>
                            </div>
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px'
                            }}>
                              <input 
                                type="number"
                                min="0"
                                value={item.quantite}
                                onChange={(e) => updateQuantite(item.id, e.target.value)}
                                style={{ 
                                  width: '70px',
                                  padding: '10px',
                                  border: '1px solid #d2d2d7',
                                  borderRadius: '10px',
                                  fontSize: '17px',
                                  textAlign: 'center',
                                  fontWeight: '500'
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: '32px' }}>
                        <input 
                          type="text"
                          placeholder="Nom"
                          value={nomClient}
                          onChange={(e) => setNomClient(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            fontSize: '17px',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit'
                          }}
                        />
                        
                        <input 
                          type="email"
                          placeholder="Email (optionnel)"
                          value={emailClient}
                          onChange={(e) => setEmailClient(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            fontSize: '17px',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit'
                          }}
                        />
                        
                        <textarea 
                          placeholder="Commentaire (optionnel)"
                          value={commentaire}
                          onChange={(e) => setCommentaire(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '16px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            fontSize: '17px',
                            minHeight: '100px',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <button
                        onClick={envoyerCommande}
                        disabled={envoiEnCours}
                        style={{
                          width: '100%',
                          padding: '16px',
                          backgroundColor: envoiEnCours ? '#d2d2d7' : '#0071e3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '17px',
                          fontWeight: '600',
                          cursor: envoiEnCours ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {envoiEnCours ? 'Envoi en cours...' : 'Commander'}
                      </button>
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
