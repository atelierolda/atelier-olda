import React, { useState, useMemo } from 'react';

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
  const [feedbackAjout, setFeedbackAjout] = useState({});

  const tabs = [
    { id: 'nouveautes', label: 'Nouveautés' },
    { id: 'olda', label: 'Collection OLDA' },
    { id: 'fuck', label: 'Collection FUCK' },
    { id: 'discount', label: 'Discount' }
  ];

  const ajusterQte = (id, delta) => {
    // On récupère la valeur actuelle ou 3 par défaut
    const actuelle = quantites[id] || 3;
    const nouvelle = actuelle + delta;
    if (nouvelle >= 3 && nouvelle <= 50) {
      setQuantites({ ...quantites, [id]: nouvelle });
    }
  };

  const ajouterAuPanier = (p) => {
    const qte = quantites[p.id] || 3;
    const existe = panier.find(i => i.id === p.id);
    if (existe) {
      setPanier(panier.map(i => i.id === p.id ? { ...i, quantite: i.quantite + qte } : i));
    } else {
      setPanier([...panier, { ...p, quantite: qte }]);
    }
    setFeedbackAjout({ ...feedbackAjout, [p.id]: true });
    setTimeout(() => setFeedbackAjout({ ...feedbackAjout, [p.id]: false }), 1500);
  };

  return (
    <div className="container">
      <style>{`
        .container { background: #fff; min-height: 100vh; font-family: -apple-system, sans-serif; color: #1d1d1f; }
        
        /* MENU ROULETTE HAUT DE GAMME */
        .nav-header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid #d2d2d7; padding: 15px; display: flex; align-items: center; }
        .roulette-wrapper { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 10px; flex: 1; padding: 0 10px; scrollbar-width: none; }
        .roulette-wrapper::-webkit-scrollbar { display: none; }
        
        .tab-button { 
          flex: 0 0 140px; scroll-snap-align: center; padding: 10px; border-radius: 20px; border: none; 
          font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s;
          background: transparent; color: #86868b;
        }
        .tab-button.active { background: #1d1d1f; color: #fff; }
        
        /* GRILLE ET PRODUITS */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; padding: 20px; max-width: 1000px; margin: 0 auto; }
        .card { display: flex; flexDirection: column; }
        .img-box { background: #f5f5f7; border-radius: 20px; padding: 30px; text-align: center; margin-bottom: 15px; }
        
        /* STEPPER */
        .stepper { display: flex; align-items: center; background: #f5f5f7; border-radius: 12px; height: 40px; }
        .step-btn { border: none; background: none; width: 40px; height: 40px; font-size: 20px; cursor: pointer; }
        .step-val { width: 30px; text-align: center; font-weight: 700; }
        
        .add-btn { flex: 1; height: 40px; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; margin-left: 10px; background: #0071e3; color: #fff; }
        .add-btn.success { background: #000; }
      `}</style>

      <nav className="nav-header">
        <img src="/images/mugs/logo.jpeg" style={{ height: '25px', borderRadius: '4px' }} alt="Logo" />
        <div className="roulette-wrapper">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              className={`tab-button ${collectionActive === tab.id ? 'active' : ''}`}
              onClick={() => setCollectionActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{fontSize: '13px', fontWeight: '600'}}>Panier ({panier.length})</div>
      </nav>

      <main className="grid">
        {COLLECTIONS[collectionActive].map(p => (
          <div key={p.id} className="card">
            <div className="img-box">
              <img src={p.image} style={{ height: '180px', objectFit: 'contain' }} />
            </div>
            <h3 style={{ margin: '0', fontSize: '18px' }}>{p.couleur}</h3>
            <p style={{ color: '#86868b', fontSize: '14px', margin: '5px 0 15px' }}>{p.reference}</p>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="stepper">
                <button className="step-btn" onClick={() => ajusterQte(p.id, -1)} disabled={(quantites[p.id] || 3) <= 3} style={{opacity: (quantites[p.id] || 3) <= 3 ? 0.3 : 1}}>−</button>
                <span className="step-val">{quantites[p.id] || 3}</span>
                <button className="step-btn" onClick={() => ajusterQte(p.id, 1)}>+</button>
              </div>
              <button 
                className={`add-btn ${feedbackAjout[p.id] ? 'success' : ''}`}
                onClick={() => ajouterAuPanier(p)}
              >
                {feedbackAjout[p.id] ? 'Ajouté' : 'Ajouter'}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
