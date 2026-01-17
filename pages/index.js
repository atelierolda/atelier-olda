import React, { useState } from 'react';

const COLLECTIONS = {
  nouveautes: [{ id: 101, reference: 'NW 01', image: '/images/mugs/nouveaute1.jpg', couleur: 'Édition Aurore' }],
  olda: [
    { id: 1, reference: 'TC 01', image: '/images/mugs/roseblanc.jpg', couleur: 'Rose & Blanc' },
    { id: 2, reference: 'TC 02', image: '/images/mugs/rougeblanc.jpg', couleur: 'Rouge & Blanc' }
  ],
  fuck: [{ id: 11, reference: 'TF 01', image: '/images/mugs/Fuckblancnoir.JPG', couleur: 'Blanc & Noir' }],
  discount: [{ id: 201, reference: 'DS 01', image: '/images/mugs/promo.jpg', couleur: 'Offre Spéciale' }]
};

export default function Home() {
  const [collectionActive, setCollectionActive] = useState('olda');
  const [panier, setPanier] = useState([]);
  const [quantites, setQuantites] = useState({});

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

  return (
    <div className="app-container">
      <style>{`
        .app-container { background: #fff; min-height: 100vh; font-family: -apple-system, sans-serif; color: #1d1d1f; }
        .nav-header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid #d2d2d7; padding: 15px; display: flex; align-items: center; justify-content: space-between; }
        .roulette { display: flex; overflow-x: auto; gap: 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; padding: 0 10px; }
        .roulette::-webkit-scrollbar { display: none; }
        .tab { flex: 0 0 130px; padding: 10px; border-radius: 15px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.3s; background: #f5f5f7; color: #86868b; }
        .tab.active { background: #1d1d1f; color: #fff; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; padding: 20px; max-width: 1000px; margin: 0 auto; }
        .product-card { background: #fff; border-radius: 25px; display: flex; flex-direction: column; }
        .img-container { background: #f5f5f7; border-radius: 20px; padding: 30px; text-align: center; margin-bottom: 15px; }
        .stepper { display: flex; align-items: center; background: #f5f5f7; border-radius: 12px; height: 44px; padding: 0 5px; }
        .step-btn { border: none; background: none; width: 40px; height: 40px; font-size: 22px; cursor: pointer; color: #1d1d1f; }
        .step-val { width: 35px; text-align: center; font-weight: 700; font-size: 16px; }
        .btn-add { flex: 1; height: 44px; border: none; border-radius: 12px; font-weight: 600; background: #0071e3; color: #fff; margin-left: 12px; cursor: pointer; }
      `}</style>

      <nav className="nav-header">
        <img src="/images/mugs/logo.jpeg" style={{ height: '24px' }} alt="Logo" />
        <div className="roulette">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              className={`tab ${collectionActive === tab.id ? 'active' : ''}`}
              onClick={() => setCollectionActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="grid">
        {COLLECTIONS[collectionActive].map(p => (
          <div key={p.id} className="product-card">
            <div className="img-container">
              <img src={p.image} style={{ height: '200px', objectFit: 'contain' }} alt={p.couleur} />
            </div>
            <h2 style={{ fontSize: '20px', margin: '0' }}>{p.couleur}</h2>
            <p style={{ color: '#86868b', fontSize: '14px', margin: '5px 0 20px' }}>Réf: {p.reference}</p>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="stepper">
                <button className="step-btn" onClick={() => ajusterQte(p.id, -1)} disabled={(quantites[p.id] || 3) <= 3} style={{opacity: (quantites[p.id] || 3) <= 3 ? 0.2 : 1}}>−</button>
                <div className="step-val">{quantites[p.id] || 3}</div>
                <button className="step-btn" onClick={() => ajusterQte(p.id, 1)}>+</button>
              </div>
              <button className="btn-add">Ajouter</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
