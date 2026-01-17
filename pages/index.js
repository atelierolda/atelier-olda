import React, { useState, useMemo } from 'react';

// --- CONFIGURATION DES DONNÉES ---
const COLLECTIONS = {
  nouveautes: [
    { id: 101, reference: 'NW 01', image: '/images/mugs/nouveaute1.jpg', couleur: 'Édition Aurore' },
  ],
  olda: [
    { id: 1, reference: 'TC 01', image: '/images/mugs/roseblanc.jpg', couleur: 'Rose & Blanc' },
    { id: 2, reference: 'TC 02', image: '/images/mugs/rougeblanc.jpg', couleur: 'Rouge & Blanc' },
    { id: 3, reference: 'TC 03', image: '/images/mugs/orangeblanc.jpg', couleur: 'Orange & Blanc' },
    { id: 4, reference: 'TC 04', image: '/images/mugs/vertblanc.jpg', couleur: 'Vert & Blanc' },
    { id: 5, reference: 'TC 05', image: '/images/mugs/noirblanc.jpg', couleur: 'Noir & Blanc' },
    { id: 6, reference: 'TC 06', image: '/images/mugs/noirrose.JPG', couleur: 'Noir & Rose' },
    { id: 7, reference: 'TC 07', image: '/images/mugs/noirrouge.JPG', couleur: 'Noir & Rouge' },
    { id: 8, reference: 'TC 08', image: '/images/mugs/noirorange.JPG', couleur: 'Noir & Orange' },
    { id: 9, reference: 'TC 09', image: '/images/mugs/noirjaune.JPG', couleur: 'Noir & Jaune' },
    { id: 10, reference: 'TC 10', image: '/images/mugs/noirvert.JPG', couleur: 'Noir & Vert' }
  ],
  fuck: [
    { id: 11, reference: 'TF 01', image: '/images/mugs/Fuckblancnoir.JPG', couleur: 'Blanc & Noir' }
  ],
  discount: [
    { id: 201, reference: 'DS 01', image: '/images/mugs/promo.jpg', couleur: 'Fin de série' }
  ]
};

export default function Home() {
  const [collectionActive, setCollectionActive] = useState('olda');
  const [panier, setPanier] = useState([]);
  const [quantiteSelectionnee, setQuantiteSelectionnee] = useState({});
  const [commentairesProduits, setCommentairesProduits] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [emailClient, setEmailClient] = useState('');
  const [commentaireGeneral, setCommentaireGeneral] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);
  const [feedbackAjout, setFeedbackAjout] = useState({});

  const produitsActifs = useMemo(() => COLLECTIONS[collectionActive] || [], [collectionActive]);
  const totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

  const ajouterAuPanier = (produit, quantite) => {
    if (quantite <= 0) return;
    const commentaireP = commentairesProduits[produit.id] || '';
    const existe = panier.find(p => p.id === produit.id);
    
    if (existe) {
      setPanier(panier.map(p => p.id === produit.id ? { ...p, quantite: p.quantite + quantite, commentaire: commentaireP } : p));
    } else {
      setPanier([...panier, { ...produit, quantite: parseInt(quantite), commentaire: commentaireP }]);
    }
    
    setFeedbackAjout({ ...feedbackAjout, [produit.id]: true });
    setTimeout(() => setFeedbackAjout({ ...feedbackAjout, [produit.id]: false }), 1500);
  };

  const updateQuantite = (id, qte) => {
    const n = parseInt(qte);
    if (n <= 0) {
      setPanier(panier.filter(p => p.id !== id));
    } else {
      setPanier(panier.map(p => p.id === id ? { ...p, quantite: n } : p));
    }
  };

  const envoyerCommande = async () => {
    if (!nomClient || panier.length === 0) {
      alert('Veuillez renseigner votre nom et ajouter des produits');
      return;
    }
    setEnvoiEnCours(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomClient, emailClient, commentaireGeneral, panier })
      });
      if (response.ok) {
        setMontrerMerci(true);
        setTimeout(() => {
          setPanier([]); setNomClient(''); setCommentaireGeneral(''); setEmailClient('');
          setMontrerMerci(false); setPanierOuvert(false);
        }, 3000);
      }
    } catch (e) {
      alert("Erreur de connexion");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f7', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#1d1d1f' }}>
      
      {/* HEADER FIXE AVEC NAVIGATION ROULETTE */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <img src="/images/mugs/logo.jpeg" alt="Logo" style={{ height: '28px', borderRadius: '6px' }} />
            <button 
              onClick={() => setPanierOuvert(true)} 
              style={{ background: '#1d1d1f', border: 'none', borderRadius: '20px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Panier {totalArticles > 0 && <span style={{ background: '#ff3b30', padding: '1px 6px', borderRadius: '10px', fontSize: '11px' }}>{totalArticles}</span>}
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '5px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {[
              { id: 'nouveautes', label: '✨ Nouveautés', bg: 'rgba(0,113,227,0.1)', tc: '#0071e3' },
              { id: 'olda', label: 'Tasses OLDA', bg: 'rgba(0,0,0,0.05)', tc: '#1d1d1f' },
              { id: 'fuck', label: 'Tasses FUCK', bg: 'rgba(0,0,0,0.05)', tc: '#1d1d1f' },
              { id: 'discount', label: '🏷️ Discount', bg: 'rgba(255,59,48,0.1)', tc: '#ff3b30' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCollectionActive(tab.id)}
                style={{
                  flexShrink: 0,
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: collectionActive === tab.id ? (tab.id === 'nouveautes' || tab.id === 'discount' ? tab.bg : '#1d1d1f') : 'transparent',
                  color: collectionActive === tab.id ? (tab.id === 'nouveautes' || tab.id === 'discount' ? tab.tc : '#fff') : '#86868b',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* GRID PRODUITS */}
      <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {produitsActifs.map(produit => (
            <div key={produit.id} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <img src={produit.image} alt={produit.reference} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} loading="lazy" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>{produit.couleur}</h3>
              <p style={{ color: '#86868b', fontSize: '14px', margin: '0 0 16px 0' }}>{produit.reference}</p>
              
              <textarea 
                placeholder="Ajouter une note..."
                value={commentairesProduits[produit.id] || ''}
                onChange={(e) => setCommentairesProduits({...commentairesProduits, [produit.id]: e.target.value})}
                style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '12px', padding: '12px', fontSize: '14px', marginBottom: '16px', fontFamily: 'inherit', resize: 'none', height: '60px', outline: 'none' }}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <select 
                  value={quantiteSelectionnee[produit.id] || 1}
                  onChange={(e) => setQuantiteSelectionnee({...quantiteSelectionnee, [produit.id]: parseInt(e.target.value)})}
                  style={{ borderRadius: '12px', border: '1px solid #d2d2d7', padding: '10px', backgroundColor: '#f5f5f7' }}
                >
                  {[1,2,3,4,5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button 
                  onClick={() => ajouterAuPanier(produit, quantiteSelectionnee[produit.id] || 1)}
                  style={{
                    flex: 1, border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s',
                    backgroundColor: feedbackAjout[produit.id] ? '#34c759' : '#0071e3',
                    color: '#fff'
                  }}
                >
                  {feedbackAjout[produit.id] ? '✓ Ajouté' : 'Ajouter'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL PANIER */}
      {panierOuvert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(15px)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setPanierOuvert(false)}>
          <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '500px', borderRadius: '28px', padding: '24px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            {montrerMerci ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h2 style={{ fontSize: '40px', margin: '0' }}>✅</h2>
                <h2 style={{ fontSize: '24px', marginTop: '10px' }}>Commande enregistrée !</h2>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Panier</h2>
                {panier.length === 0 ? <p style={{ textAlign: 'center', color: '#86868b', padding: '20px 0' }}>Votre panier est vide</p> : (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      {panier.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f7' }}>
                          <div>
                            <div style={{ fontWeight: '600' }}>{item.reference}</div>
                            <div style={{ fontSize: '12px', color: '#86868b' }}>{item.couleur}</div>
                            {item.commentaire && <div style={{ fontSize: '11px', color: '#ff3b30' }}>Note: {item.commentaire}</div>}
                          </div>
                          <input type="number" min="0" value={item.quantite} onChange={(e) => updateQuantite(item.id, e.target.value)} style={{ width: '60px', padding: '8px', border: '1px solid #d2d2d7', borderRadius: '8px', textAlign: 'center' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input placeholder="Votre Nom" value={nomClient} onChange={(e) => setNomClient(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '16px' }} />
                      <button onClick={envoyerCommande} disabled={envoiEnCours} style={{ width: '100%', padding: '16px', backgroundColor: '#0071e3', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '600', fontSize: '17px', cursor: 'pointer' }}>
                        {envoiEnCours ? 'Envoi...' : 'Confirmer la commande'}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
