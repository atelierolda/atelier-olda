import React, { useState, useEffect } from 'react';

export default function CatalogueCommande() {
  const [produits, setProduits] = useState([
    { id: 1, reference: 'TC 01', image: '', couleur: '', quantite: 0 },
    { id: 2, reference: 'TC 02', image: '', couleur: '', quantite: 0 },
    { id: 3, reference: 'TC 03', image: '', couleur: '', quantite: 0 },
    { id: 4, reference: 'TC 04', image: '', couleur: '', quantite: 0 },
    { id: 5, reference: 'TC 05', image: '', couleur: '', quantite: 0 },
    { id: 6, reference: 'TC 06', image: '', couleur: '', quantite: 0 },
    { id: 7, reference: 'TC 07', image: '', couleur: '', quantite: 0 },
    { id: 8, reference: 'TC 08', image: '', couleur: '', quantite: 0 },
    { id: 9, reference: 'TC 09', image: '', couleur: '', quantite: 0 },
    { id: 10, reference: 'TC 10', image: '', couleur: '', quantite: 0 }
  ]);

  const [modeEdition, setModeEdition] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [emailClient, setEmailClient] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [logo, setLogo] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);

  const ajouterProduit = () => {
    const nouveauNumero = produits.length + 1;
    setProduits([...produits, {
      id: Date.now(),
      reference: `TC ${nouveauNumero.toString().padStart(2, '0')}`,
      image: '',
      couleur: '',
      quantite: 0
    }]);
  };

  const supprimerProduit = (id) => {
    if (confirm('Supprimer ce produit ?')) {
      setProduits(produits.filter(p => p.id !== id));
    }
  };

  const updateProduit = (id, field, value) => {
    setProduits(produits.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const updateQuantite = (id, qte) => {
    updateProduit(id, 'quantite', Math.max(0, parseInt(qte) || 0));
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateProduit(id, 'image', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalArticles = produits.reduce((sum, p) => sum + p.quantite, 0);

  const envoyerCommande = async () => {
    const panier = produits.filter(p => p.quantite > 0);
    
    if (panier.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    if (!nomClient || !emailClient) {
      alert('Veuillez remplir votre nom et email');
      return;
    }

    setEnvoiEnCours(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomClient,
          emailClient,
          commentaire,
          panier,
          totalArticles
        })
      });

      const data = await response.json();

      if (data.success) {
        setPanierOuvert(false);
        setMontrerMerci(true);
        setTimeout(() => {
          setMontrerMerci(false);
          setProduits(produits.map(p => ({ ...p, quantite: 0 })));
          setNomClient('');
          setEmailClient('');
          setCommentaire('');
        }, 3000);
      } else {
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid rgba(229,231,235,0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {modeEdition ? (
              <label style={{ cursor: 'pointer' }}>
                {logo ? (
                  <img src={logo} alt="Atelier OLDA" style={{ height: '48px', width: 'auto' }} />
                ) : (
                  <div style={{ 
                    height: '48px', 
                    width: '48px', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>📷</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              logo ? (
                <img src={logo} alt="Atelier OLDA" style={{ height: '48px', width: 'auto' }} />
              ) : (
                <div style={{ height: '48px', width: '48px', backgroundColor: '#f3f4f6', borderRadius: '4px' }} />
              )
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!modeEdition && (
              <button
                onClick={() => setPanierOuvert(true)}
                style={{ 
                  position: 'relative',
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 8M17 13l1.6 8"/>
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="17" cy="21" r="1"/>
                </svg>
                {totalArticles > 0 && (
                  <span style={{ 
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: '#111827',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '600',
                    borderRadius: '10px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5px'
                  }}>
                    {totalArticles}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setModeEdition(!modeEdition)}
              style={{ 
                fontSize: '14px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {modeEdition ? 'Terminer' : 'Modifier'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        
        {/* Liste des produits */}
        <div style={{ marginBottom: '24px' }}>
          {produits.map((produit) => (
            <div key={produit.id} style={{ 
              backgroundColor: 'white',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                
                {/* Photo */}
                <div style={{ 
                  position: 'relative',
                  width: '96px',
                  height: '96px',
                  flexShrink: 0,
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  {produit.image ? (
                    <img 
                      src={produit.image} 
                      alt="Tasse"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d1d5db',
                      fontSize: '12px'
                    }}>
                      Photo
                    </div>
                  )}
                  
                  {modeEdition && (
                    <label style={{ 
                      position: 'absolute',
                      inset: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0)',
                      transition: 'background-color 0.2s'
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(produit.id, e)}
                        style={{ display: 'none' }}
                      />
                      <div style={{ 
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        padding: '10px',
                        opacity: 0,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                      >
                        ✏️
                      </div>
                    </label>
                  )}
                </div>

                {/* Informations */}
                <div style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                      Tasse Céramique
                    </h3>
                    
                    {modeEdition ? (
                      <input
                        type="text"
                        value={produit.couleur}
                        onChange={(e) => updateProduit(produit.id, 'couleur', e.target.value)}
                        placeholder="Couleur"
                        style={{ 
                          width: '100%',
                          maxWidth: '300px',
                          padding: '4px 8px',
                          fontSize: '14px',
                          color: '#6b7280',
                          backgroundColor: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          outline: 'none',
                          marginBottom: '4px'
                        }}
                      />
                    ) : (
                      produit.couleur && (
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          {produit.couleur}
                        </p>
                      )
                    )}

                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                      {produit.reference}
                    </p>
                  </div>

                  {/* Compteur quantité */}
                  {!modeEdition && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f9fafb', borderRadius: '12px', padding: '4px' }}>
                      <button
                        onClick={() => {
                          if (produit.quantite > 0) {
                            updateQuantite(produit.id, produit.quantite - 1);
                          }
                        }}
                        style={{ 
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#374151',
                          fontSize: '18px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        −
                      </button>
                      <span style={{ 
                        width: '40px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#111827'
                      }}>
                        {produit.quantite}
                      </span>
                      <button
                        onClick={() => updateQuantite(produit.id, produit.quantite + 1)}
                        style={{ 
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#374151',
                          fontSize: '18px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* Bouton supprimer */}
                  {modeEdition && (
                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      style={{ 
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        borderRadius: '8px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton ajouter */}
        {modeEdition && (
          <button
            onClick={ajouterProduit}
            style={{ 
              padding: '12px 24px',
              backgroundColor: '#111827',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#000000'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#111827'}
          >
            + Ajouter une tasse
          </button>
        )}
      </div>

      {/* Modal Panier */}
      {panierOuvert && (
        <div style={{ 
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '480px',
            borderRadius: '16px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            
            {/* Header */}
            <div style={{ 
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <h2 style={{ fontSize: '17px', fontWeight: '600', color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
                Panier
              </h2>
              <button
                onClick={() => setPanierOuvert(false)}
                style={{ 
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  color: '#6b7280',
                  fontSize: '18px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                ×
              </button>
            </div>

            {/* Contenu */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {produits.filter(p => p.quantite > 0).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 8M17 13l1.6 8"/>
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="17" cy="21" r="1"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>Votre panier est vide</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '24px' }}>
                    {produits.filter(p => p.quantite > 0).map(produit => (
                      <div key={produit.id} style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingBottom: '16px',
                        marginBottom: '16px',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        
                        <div style={{ 
                          width: '56px',
                          height: '56px',
                          flexShrink: 0,
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          {produit.image ? (
                            <img 
                              src={produit.image} 
                              alt="Tasse"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb' }} />
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                            Tasse Céramique
                          </h3>
                          {produit.couleur && (
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 2px 0' }}>
                              {produit.couleur}
                            </p>
                          )}
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                            {produit.reference}
                          </p>
                        </div>

                        <div style={{ 
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#111827',
                          backgroundColor: '#f9fafb',
                          padding: '6px 12px',
                          borderRadius: '8px'
                        }}>
                          × {produit.quantite}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ 
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total</span>
                    <span style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                      {totalArticles} article{totalArticles > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Formulaire */}
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="text"
                      value={nomClient}
                      onChange={(e) => setNomClient(e.target.value)}
                      placeholder="Nom"
                      style={{ 
                        width: '100%',
                        padding: '14px 16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                        boxSizing: 'border-box',
                        marginBottom: '12px'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.borderColor = '#3b82f6';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />
                    
                    <input
                      type="email"
                      value={emailClient}
                      onChange={(e) => setEmailClient(e.target.value)}
                      placeholder="Email"
                      style={{ 
                        width: '100%',
                        padding: '14px 16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                        boxSizing: 'border-box',
                        marginBottom: '12px'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.borderColor = '#3b82f6';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />

                    <textarea
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      placeholder="Commentaire (optionnel)"
                      rows="3"
                      style={{ 
                        width: '100%',
                        padding: '14px 16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.borderColor = '#3b82f6';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />
                  </div>

                  <button
                    onClick={envoyerCommande}
                    disabled={envoiEnCours}
                    style={{ 
                      width: '100%',
                      padding: '14px',
                      backgroundColor: envoiEnCours ? '#9ca3af' : '#111827',
                      color: 'white',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: envoiEnCours ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                    onMouseOver={(e) => { if (!envoiEnCours) e.target.style.backgroundColor = '#000000' }}
                    onMouseOut={(e) => { if (!envoiEnCours) e.target.style.backgroundColor = '#111827' }}
                  >
                    {envoiEnCours ? 'Envoi en cours...' : 'Commander'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message de remerciement */}
      {montrerMerci && (
        <div style={{ 
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '48px 40px',
            textAlign: 'center',
            maxWidth: '400px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            {logo && (
              <img src={logo} alt="Atelier OLDA" style={{ height: '60px', width: 'auto', marginBottom: '24px' }} />
            )}
            <h2 style={{ 
              margin:​​​​​​​​​​​​​​​​
