import React, { useState, useMemo, useEffect } from 'react';

const COLLECTIONS = {
  nouveautes: [{ id: 101, reference: 'NW 01', image: '/images/mugs/nouveaute1.jpg', couleur: 'Édition Aurore' }],
  olda: [
    { id: 1, reference: 'TC 01', image: '/images/mugs/roseblanc.jpg', couleur: 'Rose & Blanc' },
    { id: 2, reference: 'TC 02', image: '/images/mugs/rougeblanc.jpg', couleur: 'Rouge & Blanc' },
    { id: 5, reference: 'TC 05', image: '/images/mugs/noirblanc.jpg', couleur: 'Noir & Blanc' }
  ],
  fuck: [{ id: 11, reference: 'TF 01', image: '/images/mugs/Fuckblancnoir.JPG', couleur: 'Blanc & Noir' }],
  discount: [{ id: 201, reference: 'DS 01', image: '/images/mugs/promo.jpg', couleur: 'Offre Spéciale' }]
};

export default function Home() {
  const [collectionActive, setCollectionActive] = useState('olda');
  const [panier, setPanier] = useState([]);
  const [quantites, setQuantites] = useState({}); 
  const [commentaires, setCommentaires] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [feedbackAjout, setFeedbackAjout] = useState({});

  const tabs = [
    { id: 'nouveautes', label: 'Nouveautés' },
    { id: 'olda', label: 'Collection OLDA' },
    { id: 'fuck', label: 'Collection FUCK' },
    { id: 'discount', label: 'Discount' }
  ];

  // STEPPER : Logique pure 1 par 1 (Minimum 3)
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
    const existe = panier.find(i => i.id === p.id);
    if (existe) {
      setPanier(panier.map(i => i.id === p.id ? { ...i, quantite: i.quantite + qte } : i));
    } else {
      setPanier([...panier, { ...p, quantite: qte, commentaire: commentaires[p.id] || '' }]);
    }
    setFeedbackAjout({ ...feedbackAjout, [p.id]: true });
    setTimeout(() => setFeedbackAjout({ ...feedbackAjout, [p.id]: false }), 1500);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1d1d1f', WebkitFontSmoothing: 'antialiased' }}>
      
      {/* HEADER FIXE AVEC ROULETTE */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid #d2d2d7' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '64px', padding: '0 20px' }}>
          <img src="/images/mugs/logo.jpeg" style={{ height: '28px', borderRadius: '6px' }} alt="Logo" />
          
          {/* LA ROULETTE OPTIMISÉE */}
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory', 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            padding: '0 10px',
            gap: '10px',
            flex: 1,
            alignItems: 'center'
          }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCollectionActive(tab.id)}
                style={{
                  flex: '0 0 auto',
                  minWidth: '120px',
                  scrollSnapAlign: 'center',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: collectionActive === tab.id ? '#1d1d1f' : 'transparent',
                  color: collectionActive === tab.id ? '#fff' : '#86868b',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button onClick={() => setPanierOuvert(true)} style={{ background: 'none', border: 'none', color: '#0066cc', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            Panier ({totalArticles})
          </button>
        </div>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '40px' }}>
          {tabs.find(t => t.id === collectionActive).label}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
          {COLLECTIONS[collectionActive].map(p => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ background: '#f5f5f7', borderRadius: '24px', padding: '40px', textAlign: 'center', marginBottom: '18px' }}>
                <img src={p.image} style={{ height: '220px', objectFit: 'contain' }} alt={p.couleur} />
              </div>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0' }}>{p.couleur}</h3>
              <p style={{ color: '#86868b', fontSize: '15px', marginBottom: '20px' }}>{p.reference}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                {/* LE STEPPER (BLOCÉ À 3 MIN) */}
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f7', borderRadius: '12px', padding: '2px' }}>
                  <button 
                    onClick={() => ajusterQte(p.id, -1)} 
                    style={{ border: 'none', background: 'none', width: '38px', height: '38px', fontSize: '20px', cursor: 'pointer', color: (quantites[p.id] || 3) <= 3 ? '#d2d2d7' : '#000' }}
                    disabled={(quantites[p.id] || 3) <= 3}
                  >
                    −
                  </button>
                  <span style={{ width: '28px', textAlign: 'center', fontWeight: '700', fontSize: '16px' }}>
                    {quantites[p.id] || 3}
                  </span>
                  <button 
                    onClick={() => ajusterQte(p.id, 1)} 
                    style={{ border: 'none', background: 'none', width: '38px', height: '38px', fontSize: '20px', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => ajouterAuPanier(p)}
                  style={{
                    flex: 1, height: '42px', backgroundColor: feedbackAjout[p.id] ? '#34c759' : '#0071e3', 
                    color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: '0.3s'
                  }}
                >
                  {feedbackAjout[p.id] ? 'Ajouté ✓' : 'Ajouter'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
