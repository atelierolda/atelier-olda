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
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [logo, setLogo] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

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
      let commandeDetails = '';
      panier.forEach((item, index) => {
        commandeDetails += `${index + 1}. Tasse Céramique\n`;
        if (item.couleur) commandeDetails += `   Couleur: ${item.couleur}\n`;
        commandeDetails += `   Référence: ${item.reference}\n`;
        commandeDetails += `   Quantité: ${item.quantite}\n\n`;
      });

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomClient,
          emailClient,
          commandeDetails,
          totalArticles
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Atelier OLDA vous remercie pour votre commande');
        setProduits(produits.map(p => ({ ...p, quantite: 0 })));
        setNomClient('');
        setEmailClient('');
        setPanierOuvert(false);
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
                  padding: '10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                🛒
                {totalArticles > 0 && (
                  <span style={{ 
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#111827',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                cursor: 'pointer'
              }}
            >
              {modeEdition ? 'Terminer' : 'Modifier'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        
        <div style={{ marginBottom: '24px' }}>
          {produits.map((produit) => (
            <div key={produit.id} style={{ 
              backgroundColor: 'white',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                
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
                        padding: '10px'
                      }}>
                        ✏️
                      </div>
                    </label>
                  )}
                </div>

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
                          color: '#374151'
                        }}
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
                          color: '#374151'
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}

                  {modeEdition && (
                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      style={{ 
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444'
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

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
              gap: '8px'
            }}
          >
            + Ajouter une tasse
          </button>
        )}
      </div>

      {panierOuvert && (
        <div style={{ 
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'center',
          padding: '0'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '448px',
            borderRadius: '24px 24px 0 0',
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            <div style={{ 
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>Panier</h2>
              <button
                onClick={() => setPanierOuvert(false)}
                style={{ 
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#9ca3af'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {produits.filter(p => p.quantite > 0).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Panier vide</p>
                </div>
              ) : (
                <div>
                  {produits.filter(p => p.quantite > 0).map(produit => (
                    <div key={produit.id} style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '16px',
                      paddingBottom: '16px',
                      marginBottom: '16px',
                      borderBottom: '1px soli​​​​​​​​​​​​​​​​
