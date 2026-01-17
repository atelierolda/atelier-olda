import React, { useState } from 'react';

export default function CatalogueCommande() {
  const [produits, setProduits] = useState([
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

  const updateQuantite = (id, quantite) => {
    setProduits(produits.map(p =>
      p.id === id ? { ...p, quantite: Math.max(0, parseInt(quantite) || 0) } : p
    ));
  };

  const panier = produits.filter(p => p.quantite > 0);

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
          logo,
          commentaire,
          panier
        })
      });

      if (response.ok) {
        setMontrerMerci(true);
        setProduits(produits.map(p => ({ ...p, quantite: 0 })));
        setNomClient('');
        setEmailClient('');
        setLogo('');
        setCommentaire('');
        setTimeout(() => {
          setMontrerMerci(false);
          setPanierOuvert(false);
        }, 3000);
      } else {
        alert('Erreur lors de l\'envoi de la commande');
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Catalogue Tasses Olda</h1>
      
      <button 
        onClick={() => setModeEdition(!modeEdition)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: modeEdition ? '#f44336' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        {modeEdition ? 'Mode Normal' : 'Mode Edition'}
      </button>

      {modeEdition && (
        <button 
          onClick={ajouterProduit}
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          + Ajouter Produit
        </button>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '80px'
      }}>
        {produits.map(produit => (
          <div key={produit.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {modeEdition && (
              <button 
                onClick={() => supprimerProduit(produit.id)}
                style={{
                  float: 'right',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Supprimer
              </button>
            )}
            
            <h3>{produit.reference}</h3>
            
            {modeEdition ? (
              <>
                <input 
                  type="text"
                  placeholder="URL de l'image"
                  value={produit.image}
                  onChange={(e) => updateProduit(produit.id, 'image', e.target.value)}
                  style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <input 
                  type="text"
                  placeholder="Couleur"
                  value={produit.couleur}
                  onChange={(e) => updateProduit(produit.id, 'couleur', e.target.value)}
                  style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
              </>
            ) : (
              <>
                {produit.image && (
                  <img 
                    src={produit.image} 
                    alt={produit.couleur}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                )}
                <p><strong>Couleur:</strong> {produit.couleur}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label>Quantité:</label>
                  <input 
                    type="number"
                    min="0"
                    value={produit.quantite}
                    onChange={(e) => updateQuantite(produit.id, e.target.value)}
                    style={{ width: '60px', padding: '5px' }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {!modeEdition && (
        <button
          onClick={() => setPanierOuvert(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}
        >
          Panier ({panier.length})
        </button>
      )}

      {panierOuvert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%'
          }}>
            {montrerMerci ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2 style={{ color: '#4CAF50' }}>✓ Commande envoyée avec succès!</h2>
                <p>Merci pour votre commande</p>
              </div>
            ) : (
              <>
                <h2>Votre Commande</h2>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Nom du client *</label>
                  <input 
                    type="text"
                    value={nomClient}
                    onChange={(e) => setNomClient(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                  
                  <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                  <input 
                    type="email"
                    value={emailClient}
                    onChange={(e) => setEmailClient(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                  
                  <label style={{ display: 'block', marginBottom: '5px' }}>Logo (facultatif)</label>
                  <input 
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="Description du logo souhaité"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                  
                  <label style={{ display: 'block', marginBottom: '5px' }}>Commentaire</label>
                  <textarea 
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    style={{ width: '100%', padding: '8px', minHeight: '80px' }}
                  />
                </div>

                <h3>Articles commandés:</h3>
                {panier.map(item => (
                  <div key={item.id} style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{item.reference} - {item.couleur}</span>
                    <span><strong>Quantité: {item.quantite}</strong></span>
                  </div>
                ))}

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={envoyerCommande}
                    disabled={envoiEnCours}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: envoiEnCours ? '#ccc' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: envoiEnCours ? 'not-allowed' : 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    {envoiEnCours ? 'Envoi en cours...' : 'Envoyer la commande'}
                  </button>
                  
                  <button
                    onClick={() => setPanierOuvert(false)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
