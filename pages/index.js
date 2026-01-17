import React, { useState } from 'react';

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
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      
      {/* Header Apple */}
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.72)', 
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.07)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div>
            {modeEdition ? (
              <label style={{ cursor: 'pointer', display: 'block' }}>
                {logo ? (
                  <img src={logo} alt="Logo" style={{ height: '44px', width: 'auto' }} />
                ) : (
                  <div style={{ 
                    height: '44px', 
                    width: '44px', 
                    backgroundColor: '#f5f5f7',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: '#86868b'
                  }}>
                    +
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </label>
            ) : (
              logo && <img src={logo} alt="Logo" style={{ height: '44px', width: 'auto' }} />
            )}
          </div>
          
          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {!modeEdition && (
              <button
                onClick={() => setPanierOuvert(true)}
                style={{ 
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* Icône sac Apple */}
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ display: 'block' }}>
                  <path d="M4.5 6.5V5.5C4.5 2.73858 6.73858 0.5 9.5 0.5C12.2614 0.5 14.5 2.73858 14.5 5.5V6.5M1.5 8.5L1.9 19.6C1.96066 20.9189 3.03988 21.9519 4.36 21.9519H14.64C15.9601 21.9519 17.0393 20.9189 17.1 19.6L17.5 8.5H1.5Z" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {totalArticles > 0 && (
                  <span style={{ 
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: '#1d1d1f',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '600',
                    borderRadius: '10px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}>
                    {totalArticles}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setModeEdition(!modeEdition)}
              style={{ 
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: '#1d1d1f',
                cursor: 'pointer',
                opacity: 0.8,
                fontWeight: '400'
              }}
            >
              {modeEdition ? 'Terminé' : 'Modifier'}
            </button>
          </div>
        </div>
      </div>

      {/* Liste produits */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          {produits.map((produit) => (
            <div key={produit.id} style={{ 
              padding: '16px 0',
              borderBottom: '0.5px solid rgba(0,0,0,0.08)'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                {/* Photo */}
                <div style={{ 
                  position: 'relative',
                  width: '90px',
                  height: '90px',
                  flexShrink: 0,
                  backgroundColor: '#fbfbfd',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  {produit.image ? (
                    <img src={produit.image} alt="Tasse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d2d2d7', fontSize: '11px' }}>
                      Photo
                    </div>
                  )}
                  
                  {modeEdition && (
                    <label style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)', transition: 'background-color 0.2s' }}>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(produit.id, e)} style={{ display: 'none' }} />
                      <div style={{ opacity: 0, transition: 'opacity 0.2s' }}>✏️</div>
                    </label>
                  )}
                </div>

                {/* Infos */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.01em' }}>
                      Tasse Céramique
                    </h3>
                    
                    {modeEdition ? (
                      <input
                        type="text"
                        value={produit.couleur}
                        onChange={(e) => updateProduit(produit.id, 'couleur', e.target.value)}
                        placeholder="Couleur"
                        style={{ 
                          width: '200px',
                          padding: '6px 10px',
                          fontSize: '13px',
                          color: '#86868b',
                          backgroundColor: '#f5f5f7',
                          border: 'none',
                          borderRadius: '8px',
                          outline: 'none',
                          marginBottom: '4px'
                        }}
                      />
                    ) : (
                      produit.couleur && (
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#86868b' }}>
                          {produit.couleur}
                        </p>
                      )
                    )}

                    <p style={{ margin: 0, fontSize: '12px', color: '#86868b' }}>
                      {produit.reference}
                    </p>
                  </div>

                  {/* Quantité */}
                  {!modeEdition && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => produit.quantite > 0 && updateQuantite(produit.id, produit.quantite - 1)}
                        style={{ 
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#f5f5f7',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#1d1d1f',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        −
                      </button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '14px', fontWeight: '400', color: '#1d1d1f' }}>
                        {produit.quantite}
                      </span>
                      <button
                        onClick={() => updateQuantite(produit.id, produit.quantite + 1)}
                        style={{ 
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#f5f5f7',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#1d1d1f',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}

                  {modeEdition && (
                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff3b30', fontSize: '18px' }}
                    >
                      ×
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
              padding: '10px 20px',
              backgroundColor: '#0071e3',
              color: 'white',
              fontSize: '12px',
              fontWeight: '400',
              border: 'none',
              borderRadius: '980px',
              cursor: 'pointer'
            }}
          >
            Ajouter une tasse
          </button>
        )}
      </div>

      {/* Modal Panier */}
      {panierOuvert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.48)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '420px', borderRadius: '18px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: '#1d1d1f' }}>Panier</h2>
                <button onClick={() => setPanierOuvert(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#86868b', lineHeight: '1' }}>×</button>
              </div>
            </div>

            {/* Contenu */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {produits.filter(p => p.quantite > 0).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#86868b' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>Votre panier est vide</p>
                </div>
              ) : (
                <>
                  {produits.filter(p => p.quantite > 0).map(produit => (
                    <div key={produit.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ width: '64px', height: '64px', backgroundColor: '#fbfbfd', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        {produit.image && <img src={produit.image} alt="Tasse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>Tasse Céramique</p>
                        {produit.couleur && <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#86868b' }}>{produit.couleur}</p>}
                        <p style={{ margin: 0, fontSize: '12px', color: '#86868b' }}>{produit.reference}</p>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>× {produit.quantite}</div>
                    </div>
                  ))}

                  <div style={{ padding: '16px', backgroundColor: '#f5f5f7', borderRadius: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#86868b' }}>Total</span>
                      <span style={{ fontSize: '17px', fontWeight: '600', color: '#1d1d1f' }}>{totalArticles} article{totalArticles > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={nomClient}
                    onChange={(e) => setNomClient(e.target.value)}
                    placeholder="Nom"
                    style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f5f5f7', border: 'none', borderRadius: '10px', fontSize: '14px', marginBottom: '10px', outline: 'none', boxSizing: 'border-box', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
                  />
                  
                  <input
                    type="email"
                    value={emailClient}
                    onChange={(e) => setEmailClient(e.target.value)}
                    placeholder="Email"
                    style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f5f5f7', border: 'none', borderRadius: '10px', fontSize: '14px', marginBottom: '10px', outline: 'none', boxSizing: 'border-box', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
                  />

                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Commentaire pour l'équipe (optionnel)"
                    rows="3"
                    style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f5f5f7', border: 'none', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
                  />

                  <button
                    onClick={envoyerCommande}
                    disabled={envoiEnCours}
                    style={{ width: '100%', padding: '13px', backgroundColor: envoiEnCours ? '#86868b' : '#0071e3', color: 'white', border: 'none', borderRadius: '980px', fontSize: '14px', fontWeight: '400', cursor: envoiEnCours ? 'not-allowed' : 'pointer', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    {envoiEnCours ? 'Envoi...' : 'Commander'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message de remerciement */}
      {montrerMerci && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.48)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: '48px 32px', textAlign: 'center', maxWidth: '360px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            {logo && <img src={logo} alt="Logo" style={{ height: '56px', width: 'auto', marginBottom: '24px' }} />}
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.02em' }}>
              Atelier OLDA vous remercie
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#86868b', lineHeight: '1.5' }}>
              Votre commande a bien été envoyée
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
