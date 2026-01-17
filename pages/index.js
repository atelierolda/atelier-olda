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
    { id: 201, reference: 'DS 01', image: '/images/mugs/promo.jpg', couleur: 'Offre Spéciale' }
  ]
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
        .nav-header { 
          position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.8); 
          backdrop-filter: blur(20px); border-bottom: 1px solid #d2d2d7; 
          display: flex; align-items: center; padding: 10px 15px;
        }
        .roulette-container { 
          display: flex; overflow-x: auto; gap: 10px; flex: 1; 
          padding: 0 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch;
        }
        .roulette-container::-webkit-scrollbar { display: none; }
        .tab-btn { 
          flex: 0 0 auto; min-width: 130px; padding: 10px 15px; border-radius: 20px; 
          border: none; font-size: 14px; font-weight: 600; cursor: pointer; 
          background: #f5f5f7; color: #86868b; transition: 0.3s;
        }
        .tab-btn.active { background: #1d1d1f; color: #fff; }
        .grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 30px; padding: 40px 20px; max-width: 1100px; margin: 0 auto; 
        }
        .card { display: flex; flex-direction: column; }
        .img-wrap { background: #f5f5f7; border-radius: 25px; padding: 30px; text-align: center; margin-bottom: 15px; }
        .stepper { display: flex; align-items: center; background: #f5f5f7; border-radius: 14px; padding: 2px; }
        .step-btn { border: none; background: none; width: 40px; height: 40px; font-size: 22px; cursor: pointer; }
        .step-val { width: 30px; text-align: center; font-weight: 700; font-size: 16px; }
        .add-btn { 
          flex: 1; margin-left: 12px; height: 44px; border: none; border-radius: 14px; 
          font-weight: 600; background: #0071e3; color: #fff; cursor: pointer; transition: 0.3s;
        }
        .add-btn.done { background: #000; }
      `}</style>

      <nav className="nav-header">
        <img src="/images/mugs/logo.jpeg" style={{ height: '28px', borderRadius: '5px' }} alt="Logo" />
        <div className="roulette-container">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              className={`tab-btn ${collectionActive === tab.id ? 'active' : ''}`}
              onClick={() => setCollectionActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="grid">
        {COLLECTIONS[collectionActive].map(p => (
          <div key={p.id} className="card">
            <div className="img-wrap">
              <img src={p.image} style={{ height: '200px', objectFit: 'contain' }} alt={p.couleur} />
            </div>
            <h3 style={{ margin: '0', fontSize: '19px', fontWeight: '600' }}>{p.couleur}</h3>
            <p style={{ color: '#86868b', fontSize: '14px', margin: '4px 0 18px' }}>Réf: {p.reference}</p>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="stepper">
                <button className="step-btn" onClick={() => ajusterQte(p.id, -1)} disabled={(quantites[p.id] || 3) <= 3} style={{opacity: (quantites[p.id] || 3) <= 3 ? 0.2 : 1}}>−</button>
                <span className="step-val">{quantites[p.id] || 3}</span>
                <button className="step-btn" onClick={() => ajusterQte(p.id, 1)}>+</button>
              </div>
              <button 
                className={`add-btn ${feedbackAjout[p.id] ? 'done' : ''}`}
                onClick={() => ajouterAuPanier(p)}
              >
                {feedbackAjout[p.id] ? 'Ajouté ✓' : 'Ajouter'}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
