import React, { useState, useEffect } from 'react';

const MUGS_DATA = {
  nouveautes: [{ id: 101, reference: 'NW 01', image: '/images/mugs/nouveaute1.jpg', couleur: 'Édition Aurore' }],
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
  fuck: [{ id: 11, reference: 'TF 01', image: '/images/mugs/Fuckblancnoir.JPG', couleur: 'Tasse FUCK' }],
  discount: [{ id: 201, reference: 'DS 01', image: '/images/mugs/logo.jpeg', couleur: 'Promotion' }]
};

export default function BoutiqueOlda() {
  const [activeTab, setActiveTab] = useState('olda');
  const [quantites, setQuantites] = useState({});
  const [panier, setPanier] = useState([]);

  // FORCE LE MINIMUM À 3 AU CHARGEMENT
  const getQte = (id) => quantites[id] || 3;

  const ajuster = (id, delta) => {
    const actuelle = getQte(id);
    const nouvelle = actuelle + delta;
    if (nouvelle >= 3) {
      setQuantites({ ...quantites, [id]: nouvelle });
    }
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1d1d1f', fontFamily: '-apple-system, sans-serif' }}>
      <style>{`
        /* ROULETTE COLLECTIONS */
        .nav-header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid #d2d2d7; padding: 12px 0; }
        .roulette { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 10px; padding: 0 15px; scrollbar-width: none; }
        .roulette::-webkit-scrollbar { display: none; }
        .collection-btn { flex: 0 0 140px; scroll-snap-align: center; padding: 10px; border-radius: 18px; border: none; font-weight: 600; font-size: 14px; background: #f5f5f7; color: #86868b; cursor: pointer; }
        .collection-btn.active { background: #000; color: #fff; }
        
        /* GRILLE PRODUITS */
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .card { background: #fff; border-radius: 24px; padding: 20px; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .img-box { background: #fbfbfd; border-radius: 18px; padding: 30px; text-align: center; }
        
        /* STEPPER HAUT DE GAMME (PAS D'INPUT) */
        .stepper-container { display: flex; align-items: center; background: #f5f5f7; border-radius: 14px; height: 48px; padding: 0 5px; }
        .btn-step { border: none; background: none; width: 45px; height: 48px; font-size: 24px; cursor: pointer; color: #0071e3; }
        .btn-step:disabled { color: #d2d2d7; }
        .val-step { width: 35px; text-align: center; font-weight: 700; font-size: 18px; }
        
        .btn-ajouter { flex: 1; margin-left: 15px; height: 48px; border: none; border-radius: 14px; background: #0071e3; color: #fff; font-weight: 600; font-size: 16px; cursor: pointer; }
      `}</style>

      <nav className="nav-header">
        <div className="roulette">
          {Object.keys(MUGS_DATA).map(key => (
            <button 
              key={key} 
              className={`collection-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {key === 'olda' ? 'Collection OLDA' : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      <main className="container">
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '25px' }}>
          {activeTab === 'olda' ? 'Collection OLDA' : activeTab.toUpperCase()}
        </h1>

        {MUGS_DATA[activeTab].map(p => (
          <div key={p.id} className="card">
            <div className="img-box">
              <img src={p.image} style={{ height: '220px', objectFit: 'contain' }} alt={p.couleur} />
            </div>
            <h2 style={{ fontSize: '22px', marginTop: '20px', marginBottom: '5px' }}>{p.couleur}</h2>
            <p style={{ color: '#86868b', marginBottom: '20px' }}>Réf: {p.reference}</p>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="stepper-container">
                <button 
                  className="btn-step" 
                  onClick={() => ajuster(p.id, -1)} 
                  disabled={getQte(p.id) <= 3}
                >
                  −
                </button>
                <div className="val-step">{getQte(p.id)}</div>
                <button 
                  className="btn-step" 
                  onClick={() => ajuster(p.id, 1)}
                >
                  +
                </button>
              </div>
              
              <button className="btn-ajouter">
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
