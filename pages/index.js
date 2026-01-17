import React, { useState } from 'react';

// Données complètes avec toutes vos tasses
const COLLECTIONS_DATA = {
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
    { id: 11, reference: 'TF 01', image: '/images/mugs/Fuckblancnoir.JPG', couleur: 'Tasse FUCK' }
  ],
  discount: [
    { id: 201, reference: 'DS 01', image: '/images/mugs/logo.jpeg', couleur: 'Offre Spéciale' }
  ]
};

export default function OldaBoutiqueV2() {
  const [activeTab, setActiveTab] = useState('olda');
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [feedback, setFeedback] = useState({});

  const tabs = [
    { id: 'nouveautes', label: 'Nouveautés' },
    { id: 'olda', label: 'Tasse OLDA' },
    { id: 'fuck', label: 'Tasse FUCK' },
    { id: 'discount', label: 'Discount' }
  ];

  const handleQty = (id, change) => {
    const current = quantities[id] || 3;
    const next = current + change;
    if (next >= 3 && next <= 50) setQuantities({ ...quantities, [id]: next });
  };

  const addToCart = (p) => {
    const q = quantities[p.id] || 3;
    setCart([...cart, { ...p, qte: q }]);
    setFeedback({ ...feedback, [p.id]: true });
    setTimeout(() => setFeedback({ ...feedback, [p.id]: false }), 1000);
  };

  return (
    <div className="main-app">
      <style>{`
        .main-app { background: #ffffff; min-height: 100vh; font-family: -apple-system, sans-serif; color: #1d1d1f; }
        .header { position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid #d2d2d7; padding: 12px; }
        .nav-scroll { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 10px; padding: 5px; scrollbar-width: none; }
        .nav-scroll::-webkit-scrollbar { display: none; }
        .tab-item { flex: 0 0 140px; scroll-snap-align: center; padding: 12px; border-radius: 12px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; background: #f5f5f7; color: #86868b; transition: 0.2s; }
        .tab-item.active { background: #1d1d1f; color: #ffffff; }
        .content { max-width: 1000px; margin: 0 auto; padding: 30px 15px; }
        .product-card { margin-bottom: 40px; display: flex; flex-direction: column; }
        .img-container { background: #f5f5f7; border-radius: 28px; padding: 40px; text-align: center; margin-bottom: 15px; }
        .img-container img { height: 220px; object-fit: contain; }
        .controls { display: flex; align-items: center; gap: 12px; }
        .stepper-ui { display: flex; align-items: center; background: #f5f5f7; border-radius: 14px; height: 44px; padding: 0 4px; }
        .s-btn { border: none; background: none; width: 40px; height: 40px; font-size: 20px; cursor: pointer; }
        .s-val { width: 30px; text-align: center; font-weight: 700; font-size: 16px; }
        .add-btn-apple { flex: 1; height: 44px; border: none; border-radius: 14px; background: #0071e3; color: #fff; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .add-btn-apple.done { background: #000; }
      `}</style>

      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '0 5px' }}>
            <img src="/images/mugs/logo.jpeg" style={{ height: '22px', borderRadius: '4px' }} alt="Logo" />
            <span style={{ marginLeft: 'auto', fontWeight: '600' }}>🛒 ({cart.length})</span>
        </div>
        <div className="nav-scroll">
          {tabs.map(t => (
            <button key={t.id} className={`tab-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
        <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>{tabs.find(t => t.id === activeTab).label}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {COLLECTIONS_DATA[activeTab].map(p => (
            <div key={p.id} className="product-card">
              <div className="img-container"><img src={p.image} alt={p.couleur} /></div>
              <h2 style={{ fontSize: '22px', margin: '0' }}>{p.couleur}</h2>
              <p style={{ color: '#86868b', marginBottom: '20px' }}>Réf: {p.reference}</p>
              <div className="controls">
                <div className="stepper-ui">
                  <button className="s-btn" onClick={() => handleQty(p.id, -1)} disabled={(quantities[p.id] || 3) <= 3} style={{opacity: (quantities[p.id] || 3) <= 3 ? 0.2 : 1}}>−</button>
                  <span className="s-val">{quantities[p.id] || 3}</span>
                  <button className="s-btn" onClick={() => handleQty(p.id, 1)}>+</button>
                </div>
                <button className={`add-btn-apple ${feedback[p.id] ? 'done' : ''}`} onClick={() => addToCart(p)}>
                  {feedback[p.id] ? 'Ajouté ✓' : 'Ajouter'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

