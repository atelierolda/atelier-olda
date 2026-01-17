import React, { useState, useMemo } from 'react';

// --- CONFIGURATION DES COLLECTIONS ---
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
    { id: 201, reference: 'DS 01', image: '/images/mugs/promo.jpg', couleur: 'Offre Spéciale' }
  ]
};

export default function Home() {
  const [collectionActive, setCollectionActive] = useState('olda');
  const [panier, setPanier] = useState([]);
  const [quantites, setQuantites] = useState({}); 
  const [commentairesProduits, setCommentairesProduits] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);
  const [feedbackAjout, setFeedbackAjout] = useState({});

  const produitsActifs = useMemo(() => COLLECTIONS[collectionActive] || [], [collectionActive]);
  const totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

  const tabs = [
    { id: 'nouveautes', label: 'Nouveautés' },
    { id: 'olda', label: 'Collection OLDA' },
    { id: 'fuck', label: 'Collection FUCK' },
    { id: 'discount', label: 'Discount' }
  ];

  // Stepper Premium : Minimum 3
  const ajusterQte = (id, delta) => {
    setQuantites(prev => {
      const actuelle = prev[id] || 3;
      const nouvelle = actuelle + delta;
      if (nouvelle < 3) return { ...prev, [id]: 3 };
      if (nouvelle > 50) return { ...prev, [id]: 50 };
      return { ...prev, [id]: nouvelle };
    });
  };

  const ajouterAuPanier = (p) => {
    const qte = quantites[p.id] || 3;
    const comm = commentairesProduits[p.id] || '';
    const existe = panier.find(i => i.id === p.id);
    
    if (existe) {
      setPanier(panier.map(i => i.id === p.id ? { ...i, quantite: i.quantite + qte, commentaire: comm } : i));
    } else {
      setPanier([...panier, { ...p, quantite: qte, commentaire: comm }]);
    }
    
    setFeedbackAjout({ ...feedbackAjout, [p.id]: true });
    setTimeout(() => setFeedbackAjout({ ...feedbackAjout, [p.id]: false }), 1500);
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
        body: JSON.stringify({ nomClient, panier })
      });
      if (response.ok) {
        setMontrerMerci(true);
        setTimeout(() => {
          setPanier([]); setNomClient(''); setMontrerMerci(false); setPanierOuvert(false);
        }, 3000);
      }
    } catch (e) {
      alert("Erreur d'envoi");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, sans-serif', color: '#1d1d1f' }}>
      
      {/* NAVIGATION ROULETTE COLLECTIONS */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid #d2d2d7' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '15px' }}>
          <img src="/images/mugs/logo.jpeg" style={{ height: '25px', marginRight: '10px', borderRadius: '4px' }} alt="Logo" />
          <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', gap: '15px', padding: '5px 10px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCollectionActive(tab.id)}
                style={{
                  flex: '0 0 140px', scrollSnapAlign: 'center', padding: '10px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  backgroundColor: collectionActive === tab.id ? '#f5f5f7' : 'transparent',
                  color: collectionActive === tab.id ? '#000' : '#86868b',
                  transition: '0.3s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button onClick={() => setPanierOuvert(true)} style={{ background: 'none', border: 'none', color: '#0066cc', fontSize: '14px', cursor: 'pointer', marginLeft: 'auto' }}>
            Panier ({totalArticles})
          </button>
        </div>
      </nav>

      {/* TITRE & GRILLE */}
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px 100px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px' }}>
          {tabs.find(t => t.id === collectionActive).label}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
          {produitsActifs.map(p => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#f5f5f7', borderRadius: '22px', padding: '30px', textAlign: 'center', marginBottom: '15px' }}>
                <img src={p.image} style={{ height: '200px', objectFit: 'contain' }} alt={p.couleur} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: '600', margin: '0' }}>{p.couleur}</h3>
              <p style={{ color: '#86868b', margin: '5px 0 20px' }}>Réf: {p.reference}</p>
              
              <textarea 
                placeholder="Note de préparation..."
                onChange={(e) => setCommentairesProduits({...commentairesProduits, [p.id]: e.target.value})}
                style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '12px', padding: '12px', height: '50px', resize: 'none', marginBottom: '15px', outlineColor: '#0066cc' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
                {/* STEPPER PREMIUM */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d2d2d7', borderRadius: '12px', overflow: 'hidden' }}>
                  <button onClick={() => ajusterQte(p.id, -1)} style={{ border: 'none', background: '#fff', width: '35px', height: '35px', cursor: 'pointer', opacity: (quantites[p.id] || 3) <= 3 ? 0.3 : 1 }} disabled={(quantites[p.id] || 3) <= 3}>−</button>
                  <span style={{ width: '30px', textAlign: 'center', fontWeight: '600' }}>{quantites[p.id] || 3}</span>
                  <button onClick={() => ajusterQte(p.id, 1)} style={{ border: 'none', background: '#fff', width: '35px', height: '35px', cursor: 'pointer' }}>+</button>
                </div>

                <button 
                  onClick={() => ajouterAuPanier(p)}
                  style={{
                    flex: 1, backgroundColor: feedbackAjout[p.id] ? '#1d1d1f' : '#0071e3', color: '#fff',
                    border: 'none', borderRadius: '20px', padding: '10px', fontWeight: '600', cursor: 'pointer', transition: '0.3s'
                  }}
                >
                  {feedbackAjout[p.id] ? 'Ajouté ✓' : 'Ajouter'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL PANIER */}
      {panierOuvert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(15px)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setPanierOuvert(false)}>
          <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '500px', borderRadius: '28px', padding: '30px' }} onClick={e => e.stopPropagation()}>
            {montrerMerci ? (
              <h2 style={{ textAlign: 'center' }}>✅ Commande reçue !</h2>
            ) : (
              <>
                <h2 style={{ margin: '0 0 20px' }}>Votre Panier</h2>
                {panier.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f5f5f7' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{item.couleur}</div>
                      <div style={{ fontSize: '12px', color: '#86868b' }}>Qte: {item.quantite}</div>
                    </div>
                  </div>
                ))}
                <input placeholder="Votre Nom" value={nomClient} onChange={(e) => setNomClient(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #d2d2d7', margin: '20px 0', fontSize: '16px' }} />
                <button onClick={envoyerCommande} disabled={envoiEnCours} style={{ width: '100%', padding: '15px', background: '#0071e3', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  {envoiEnCours ? 'Envoi...' : 'Confirmer la commande'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
