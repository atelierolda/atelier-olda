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

      const data = await response.json();
      
      if (response.ok) {
        setMontrerMerci(true);
        setTimeout(() => {
          setPanier([]);
          setNomClient('');
          setEmailClient('');
          setCommentaire('');
          setMontrerMerci(false);
          setPanierOuvert(false);
        }, 4000);
      } else {
        alert('Erreur: ' + (data.message || 'Problème lors de l\'envoi'));
      }
    } catch (error) {
      alert('Erreur de connexion: ' + error.message);
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
      {/* Header */}
      <nav style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(251, 251, 253, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '12px 0',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 max(20px, env(safe-area-inset-left))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/logo.png" 
              alt="Olda" 
              style={{ height: '28px', width: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span style={{ 
              display: 'none',
              fontSize: '18px', 
              fontWeight: '600',
              color: '#1d1d1f',
              letterSpacing: '-0.01em'
            }}>
              OLDA
            </span>
          </div>
          
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
            <svg width="16" height="19" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        maxWidth: '980px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 56px)',
          fontWeight: '600',
          margin: '0',
          color: '#1d1d1f',
          letterSpacing: '-0.02em',
          lineHeight: '1.07'
        }}>
          Catalogue Tasse OLDA
        </h1>
      </div>

      {/* Grid produits */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px 80px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', 
          gap: '12px'
        }}>
          {produits.map(produit => (
            <div key={produit.id} style={{
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '20px',
              border: '1px solid rgba(0,0,0,0.04)'
            }}>
              {/* Image à gauche + Texte à droite */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: '16px'
              }}>
                {produit.image && (
                  <img 
                    src={produit.image} 
                    alt={produit.couleur}
                    style={{ 
                      height: '2.5cm', 
                      width: 'auto', 
                      objectFit: 'contain',
                      flexShrink: 0
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '17px', 
                    fontWeight: '600',
                    color: '#1d1d1f',
                    letterSpacing: '-0.01em'
                  }}>
                    Tasse Céramique
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '13px', 
                    color: '#86868b',
                    fontWeight: '400'
                  }}>
                    {produit.couleur}
                  </p>
                </div>
              </div>
              
              {/* Dropdown + Bouton */}
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                alignItems: 'stretch'
              }}>
                <select
                  value={quantiteSelectionnee[produit.id] || 1}
                  onChange={(e) => setQuantiteSelectionnee({
                    ...quantiteSelectionnee,
                    [produit.id]: parseInt(e.target.value)
                  })}
                  style={{
                    width: '70px',
                    padding: '10px 8px',
                    backgroundColor: 'white',
                    border: '1px solid #d2d2d7',
                    borderRadius: '10px',
                    fontSize: '15px',
                    color: '#1d1d1f',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 4px center',
                    backgroundSize: '14px',
                    paddingRight: '24px',
                    textAlign: 'center'
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => ajouterAuPanier(produit, quantiteSelectionnee[produit.id] || 1)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#0071e3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
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
          padding: '20px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        onClick={() => !montrerMerci && setPanierOuvert(false)}
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
                  fontSize: 'clamp(28px, 5vw, 40px)', 
                  fontWeight: '600', 
                  color: '#1d1d1f',
                  margin: '0 0 16px 0',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1'
                }}>
                  Atelier OLDA vous remercie pour votre commande
                </h2>
              </div>
            ) : (
              <>
                <div style={{ 
                  padding: 'clamp(24px, 5vw, 40px)',
                  borderBottom: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ 
                        margin: '0 0 4px 0', 
                        fontSize: 'clamp(24px, 4vw, 32px)', 
                        fontWeight: '600',
                        color: '#1d1d1f',
                        letterSpacing: '-0.02em'
                      }}>
                        Panier
                      </h2>
                      <p style={{ 
                        margin: 0, 
                        color: '#86868b',
                        fontSize: '15px',
                        fontWeight: '400'
                      }}>
                        {totalArticles} article{totalArticles > 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setPanierOuvert(false)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '32px',
                        color: '#86868b',
                        cursor: 'pointer',
                        padding: '4px',
                        lineHeight: '1'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div style={{ padding: 'clamp(24px, 5vw, 32px)' }}>
                  {panier.length === 0 ? (
                    <p style={{ 
                      textAlign: 'center', 
                      color: '#86868b',
                      fontSize: '17px',
                      padding: '40px 0',
                      margin: 0
                    }}>
                      Votre panier est vide
                    </p>
                  ) : (
                    <>
                      <div style={{ marginBottom: '24px' }}>
                        {panier.map(item => (
                          <div key={item.id} style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px 0',
                            borderBottom: '1px solid rgba(0,0,0,0.04)'
                          }}>
                            <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
                              <p style={{ 
                                margin: '0 0 4px 0',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#1d1d1f'
                              }}>
                                {item.couleur}
                              </p>
                              <p style={{ 
                                margin: 0,
                                fontSize: '13px',
                                color: '#86868b'
                              }}>
                                {item.reference}
                              </p>
                            </div>
                            <input 
                              type="number"
                              min="0"
                              value={item.quantite}
                              onChange={(e) => updateQuantite(item.id, e.target.value)}
                              style={{ 
                                width: '65px',
                                padding: '8px',
                                border: '1px solid #d2d2d7',
                                borderRadius: '8px',
                                fontSize: '15px',
                                textAlign: 'center',
                                fontWeight: '500'
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <input 
                          type="text"
                          placeholder="Nom"
                          value={nomClient}
                          onChange={(e) => setNomClient(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '14px',
                            marginBottom: '10px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '10px',
                            fontSize: '16px',
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
                            padding: '14px',
                            marginBottom: '10px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '10px',
                            fontSize: '16px',
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
                            padding: '14px',
                            border: '1px solid #d2d2d7',
                            borderRadius: '10px',
                            fontSize: '16px',
                            minHeight: '80px',
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
                          padding: '14px',
                          backgroundColor: envoiEnCours ? '#d2d2d7' : '#0071e3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '17px',
                          fontWeight: '600',
                          cursor: envoiEnCours ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
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
