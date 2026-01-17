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
      setPanier([...panier, { ...produit, quantite, commentaire: commentaireP }]);
    }
    
    setFeedbackAjout({ ...feedbackAjout, [produit.id]: true });
    setTimeout(() => setFeedbackAjout({ ...feedbackAjout, [produit.id]: false }), 1500);
  };

  const updateQuantite = (id, qte) => {
    const n = parseInt(qte);
    if (n <= 0) setPanier(panier.filter(p => p.id !== id));
    else setPanier(panier.map(p => p.id === id ? { ...p, quantite: n } : p));
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
      } else {
        alert("Erreur lors de l'envoi");
      }
    } catch (e) {
      alert("Erreur de connexion");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f7', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1d1d1f', transition: 'all 0.3s' }}>
      
      {/* HEADER ULTRA-FLUIDE */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '12px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <img src="/images/mugs/logo.jpeg" alt="Logo" style={{ height: '32px', borderRadius: '8px', objectFit: 'contain' }} />
          
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '14px' }}>
            {[
              { id: 'nouveautes', label: 'Nouveautés', bg: 'rgba(0,113,227,0.12)', tc: '#0071e3' },
              { id: 'olda', label: 'Tasse OLDA', bg: '#fff', tc: '#1d1d1f' },
              { id: 'fuck', label: 'Tasse FUCK', bg: '#fff', tc: '#1d1d1f' },
              { id: 'discount', label: 'Discount', bg: 'rgba(255,59,48,0.12)', tc: '#ff3b30' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCollectionActive(tab.id)}
                style={{
                  border: 'none', padding: '8px 14px', borderRadius: '11px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  backgroundColor: collectionActive === tab.id ? tab.bg : 'transparent',
                  color: collectionActive === tab.id ? tab.tc : '#86868b',
                  boxShadow: collectionActive === tab.id && (tab.id === 'olda' || tab.id === 'fuck') ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button onClick={() => setPanierOuvert(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {totalArticles > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, background: '#ff3b30', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>{totalArticles}</span>
            )}
          </button>
        </div>
      </nav>

      {/* TITRE HERO */}
      <header style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>
          {collectionActive === 'nouveautes' && "Dernières créations"}
          {collectionActive === 'olda' && "Catalogue Tasse OLDA"}
          {collectionActive === 'fuck' && "Collection Tasse FUCK"}
          {collectionActive === 'discount' && "Nos offres Discount"}
        </h1>
      </header>

      {/* GRID PRODUITS */}
      <main style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {produitsActifs.map(produit => (
            <div key={produit.id} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <img 
                  src={produit.image} 
                  alt={produit.reference} 
                  loading="lazy"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Image+Indisponible'; }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>{produit.couleur}</h3>
                <p style={{ color: '#86868b', fontSize: '14px', margin: '0 0 16px 0' }}>Référence: {produit.reference}</p>
                
                <textarea 
                  placeholder="Note pour ce produit..."
                  value={commentairesProduits[produit.id] || ''}
                  onChange={(e) => setCommentairesProduits({...commentairesProduits, [produit.id]: e.target.value})}
                  style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '12px', padding: '12px', fontSize: '14px', marginBottom: '16px', fontFamily: 'inherit', resize: 'none', height: '60px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={quantiteSelectionnee[produit.id] || 1}
                  onChange={(e) => setQuantiteSelectionnee({...quantiteSelectionnee, [produit.id]: parseInt(e.target.value)})}
                  style={{ borderRadius: '12px', border: '1px solid #d2d2d7', padding: '10px', backgroundColor: '#f5f5f7', fontWeight: '500' }}
                >
                  {[1,2,3,4,5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button 
                  onClick={() => ajouterAuPanier(produit, quantiteSelectionnee[produit.id] || 1)}
                  style={{
                    flex: 1, border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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

      {/* MODAL PANIER DESIGN APPLE */}
      {panierOuvert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(15px)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px' }} onClick={() => setPanierOuvert(false)}>
          <div style={{ backgroundColor: '#fff', width: '95%', maxWidth: '550px', borderRadius: '28px', padding: '32px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            {montrerMerci ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
                <h2 style={{ fontSize: '24px' }}>Commande enregistrée !</h2>
                <p style={{ color: '#86868b' }}>Atelier OLDA prépare votre colis.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Panier</h2>
                  <button onClick={() => setPanierOuvert(false)} style={{ background: '#f5f5f7', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}>×</button>
                </div>

                {panier.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#86868b', padding: '40px 0' }}>Votre panier est vide.</p>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                      {panier.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f5f5f7' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600' }}>{item.couleur} ({item.reference})</div>
                            {item.commentaire && <div style={{ fontSize: '12px', color: '#ff3b30', marginTop: '4px' }}>Note: {item.commentaire}</div>}
                          </div>
                          <input type="number" value={item.quantite} onChange={(e) => updateQuantite(item.id, e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '8px', border: '1px solid #d2d2d7', textAlign: 'center' }} />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input placeholder="Nom complet" value={nomClient} onChange={(e) => setNomClient(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #d2d2d7', fontSize: '16px', boxSizing: 'border-box' }} />
                      <input placeholder="Email (optionnel)" value={emailClient} onChange={(e) => setEmailClient(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #d2d2d7', fontSize: '16px', boxSizing: 'border-box' }} />
                      <textarea placeholder="Commentaire général..." value={commentaireGeneral} onChange={(e) => setCommentaireGeneral(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #d2d2d7', fontSize: '16px', height: '80px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>

                    <button 
                      onClick={envoyerCommande} 
                      disabled={envoiEnCours} 
                      style={{ width: '100%', padding: '18px', backgroundColor: '#0071e3', color: '#fff', borderRadius: '16px', marginTop: '24px', border: 'none', fontWeight: '600', fontSize: '17px', cursor: 'pointer' }}
                    >
                      {envoiEnCours ? 'Envoi en cours...' : 'Passer la commande'}
                    </button>
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
