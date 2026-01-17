import React, { useState, useMemo } from 'react';

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
  const [quantites, setQuantites] = useState({}); // Pour le stepper haut de gamme
  const [commentairesProduits, setCommentairesProduits] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);
  const [feedbackAjout, setFeedbackAjout] = useState({});

  const produitsActifs = useMemo(() => COLLECTIONS[collectionActive] || [], [collectionActive]);
  const totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

  // Gestionnaire du stepper
  const ajusterQuantiteLocale = (id, delta) => {
    setQuantites(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const ajouterAuPanier = (produit) => {
    const qte = quantites[produit.id] || 1;
    const comm = commentairesProduits[produit.id] || '';
    const existe = panier.find(p => p.id === produit.id);
    
    if (existe) {
      setPanier(panier.map(p => p.id === produit.id ? { ...p, quantite: p.quantite + qte, commentaire: comm } : p));
    } else {
      setPanier([...panier, { ...produit, quantite: qte, commentaire: comm }]);
    }
    
    setFeedbackAjout({ ...feedbackAjout, [produit.id]: true });
    setTimeout(() => setFeedbackAjout({ ...feedbackAjout, [produit.id]: false }), 1500);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f7', minHeight: '100vh', fontFamily: '-apple-system, sans-serif' }}>
      
      {/* NAV ROULETTE COLLECTIONS */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <img src="/images/mugs/logo.jpeg" alt="Logo" style={{ height: '30px', borderRadius: '8px' }} />
            <button onClick={() => setPanierOuvert(true)} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: '600', cursor: 'pointer' }}>
              Panier ({totalArticles})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '5px' }}>
            {[
              { id: 'nouveautes', label: 'Nouveautés', tc: '#0071e3' },
              { id: 'olda', label: 'Collection OLDA', tc: '#1d1d1f' },
              { id: 'fuck', label: 'Collection FUCK', tc: '#1d1d1f' },
              { id: 'discount', label: 'Discount', tc: '#ff3b30' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCollectionActive(tab.id)}
                style={{
                  flexShrink: 0, border: 'none', padding: '10px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  backgroundColor: collectionActive === tab.id ? '#1d1d1f' : 'rgba(0,0,0,0.05)',
                  color: collectionActive === tab.id ? '#fff' : '#86868b',
                  transition: '0.3s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* CATALOGUE */}
      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {produitsActifs.map(produit => (
            <div key={produit.id} style={{ backgroundColor: '#fff', borderRadius: '30px', padding: '30px', border: '1px solid rgba(0,0,0,0.02)' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={produit.image} alt={produit.reference} style={{ height: '180px', objectFit: 'contain' }} />
              </div>
              <h3 style={{ margin: '0', fontSize: '20px' }}>{produit.couleur}</h3>
              <p style={{ color: '#86868b', marginTop: '5px' }}>Réf: {produit.reference}</p>
              
              <textarea 
                placeholder="Note pour la préparation..."
                onChange={(e) => setCommentairesProduits({...commentairesProduits, [produit.id]: e.target.value})}
                style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '15px', padding: '12px', margin: '15px 0', height: '60px', resize: 'none', outline: 'none' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                {/* STEPPER HAUT DE GAMME */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f7', borderRadius: '15px', padding: '5px' }}>
                  <button onClick={() => ajusterQuantiteLocale(produit.id, -1)} style={{ border: 'none', background: 'none', width: '35px', height: '35px', cursor: 'pointer', fontSize: '20px' }}>-</button>
                  <span style={{ width: '30px', textAlign: 'center', fontWeight: '600' }}>{quantites[produit.id] || 1}</span>
                  <button onClick={() => ajusterQuantiteLocale(produit.id, 1)} style={{ border: 'none', background: 'none', width: '35px', height: '35px', cursor: 'pointer', fontSize: '20px' }}>+</button>
                </div>

                <button 
                  onClick={() => ajouterAuPanier(produit)}
                  style={{
                    flex: 1, border: 'none', borderRadius: '15px', padding: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: feedbackAjout[produit.id] ? '#34c759' : '#0071e3', color: '#fff'
                  }}
                >
                  {feedbackAjout[produit.id] ? 'Ajouté ✓' : 'Ajouter'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
