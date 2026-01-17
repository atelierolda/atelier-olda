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

  // Stepper fluide de 1 à 50
  const ajusterQuantite = (id, delta) => {
    const actuelle = quantites[id] || 1;
    const nouvelle = actuelle + delta;
    if (nouvelle >= 1 && nouvelle <= 50) {
      setQuantites({ ...quantites, [id]: nouvelle });
    }
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
    setTimeout(() => setFeedbackAjout({ ...feedbackAjout, [produit.id]: false }), 2000);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, system-ui, sans-serif', color: '#1d1d1f' }}>
      
      {/* NAVIGATION COLLECTIONS */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid #d2d2d7' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '12px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <img src="/images/mugs/logo.jpeg" alt="Atelier OLDA" style={{ height: '24px', borderRadius: '4px' }} />
            <button 
              onClick={() => setPanierOuvert(true)} 
              style={{ background: 'none', border: 'none', color: '#0066cc', fontSize: '14px', fontWeight: '400', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              Panier {totalArticles > 0 && <span style={{ backgroundColor: '#1d1d1f', color: '#fff', padding: '2px 7px', borderRadius: '10px', fontSize: '11px' }}>{totalArticles}</span>}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '25px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '5px' }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {[
              { id: 'nouveautes', label: 'Nouveautés' },
              { id: 'olda', label: 'Collection OLDA' },
              { id: 'fuck', label: 'Collection FUCK' },
              { id: 'discount', label: 'Discount' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCollectionActive(tab.id)}
                style={{
                  flexShrink: 0, border: 'none', background: 'none', padding: '8px 0', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                  color: collectionActive === tab.id ? '#1d1d1f' : '#86868b',
                  borderBottom: collectionActive === tab.id ? '2px solid #1d1d1f' : '2px solid transparent',
                  transition: '0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* TITRE DE LA COLLECTION */}
      <header style={{ maxWidth: '1000px', margin: '50px auto 30px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          {collectionActive === 'nouveautes' && "Nouveautés"}
          {collectionActive === 'olda' && "Collection OLDA"}
          {collectionActive === 'fuck' && "Collection FUCK"}
          {collectionActive === 'discount' && "Discount"}
        </h1>
      </header>

      {/* GRILLE DE PRODUITS */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
          {produitsActifs.map(produit => (
            <div key={produit.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#f5f5f7', borderRadius: '18px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '15px' }}>
                <img src={produit.image} alt={produit.reference} style={{ height: '80%', objectFit: 'contain' }} />
              </div>
              
              <div style={{ padding: '0 5px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: '600', margin: '0' }}>{produit.couleur}</h3>
                <p style={{ color: '#86868b', fontSize: '14px', margin: '4px 0 15px 0' }}>Référence {produit.reference}</p>
                
                <textarea 
                  placeholder="Instructions de préparation..."
                  onChange={(e) => setCommentairesProduits({...commentairesProduits, [produit.id]: e.target.value})}
                  style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '12px', padding: '12px', fontSize: '14px', height: '50px', resize: 'none', marginBottom: '15px', outlineColor: '#0066cc' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  {/* STEPPER HAUT DE GAMME */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d2d2d7', borderRadius: '10px', overflow: 'hidden', height: '36px' }}>
                    <button onClick={() => ajusterQuantite(produit.id, -1)} style={{ border: 'none', background: '#fff', width: '36px', cursor: 'pointer', fontSize: '18px', color: '#1d1d1f' }}>−</button>
                    <span style={{ width: '34px', textAlign: 'center', fontSize: '14px', fontWeight: '600', borderLeft: '1px solid #d2d2d7', borderRight: '1px solid #d2d2d7', lineHeight: '36px', background: '#fff' }}>
                      {quantites[produit.id] || 1}
                    </span>
                    <button onClick={() => ajusterQuantite(produit.id, 1)} style={{ border: 'none', background: '#fff', width: '36px', cursor: 'pointer', fontSize: '18px', color: '#1d1d1f' }}>+</button>
                  </div>

                  {/* BOUTON AJOUTER APPLE STYLE */}
                  <button 
                    onClick={() => ajouterAuPanier(produit)}
                    style={{
                      backgroundColor: feedbackAjout[produit.id] ? '#1d1d1f' : '#0071e3',
                      color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s'
                    }}
                  >
                    {feedbackAjout[produit.id] ? '✓ Ajouté' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* ... (Modal panier identique à précédemment mais avec design épuré) */}
    </div>
  );
}
