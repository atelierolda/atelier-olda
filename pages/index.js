import React, { useState } from 'react';

// 1. On sort les données du composant pour la performance
const PRODUITS_OLDA = [
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
];

const PRODUITS_FUCK = [
  // ATTENTION : Vérifiez bien l'orthographe exacte du fichier sur GitHub
  { id: 11, reference: 'TF 01', image: '/images/mugs/Fuckblancnoir.JPG', couleur: 'Blanc & Noir' }
];

export default function CatalogueCommande() {
  const [collectionActive, setCollectionActive] = useState('olda');
  const [panier, setPanier] = useState([]);
  const [quantiteSelectionnee, setQuantiteSelectionnee] = useState({});
  const [commentairesProduits, setCommentairesProduits] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [boutonStatus, setBoutonStatus] = useState({}); // Pour l'animation "Ajouté !"
  
  // États client
  const [nomClient, setNomClient] = useState('');
  const [emailClient, setEmailClient] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);

  const produitsActifs = collectionActive === 'olda' ? PRODUITS_OLDA : PRODUITS_FUCK;

  const ajouterAuPanier = (produit, quantite) => {
    if (quantite <= 0) return;
    
    const commentaireProduit = commentairesProduits[produit.id] || '';
    const existe = panier.find(p => p.id === produit.id);
    
    if (existe) {
      setPanier(panier.map(p => 
        p.id === produit.id ? { ...p, quantite: p.quantite + quantite, commentaire: commentaireProduit } : p
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: quantite, commentaire: commentaireProduit }]);
    }

    // Petit feedback visuel sur le bouton
    setBoutonStatus({ ...boutonStatus, [produit.id]: 'Ajouté !' });
    setTimeout(() => {
      setBoutonStatus({ ...boutonStatus, [produit.id]: null });
    }, 2000);
  };

  const updateQuantite = (id, quantite) => {
    const qte = parseInt(quantite);
    if (qte <= 0) {
      setPanier(panier.filter(p => p.id !== id));
    } else {
      setPanier(panier.map(p => p.id === id ? { ...p, quantite: qte } : p));
    }
  };

  const totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

  // ... (Reste de la logique envoyerCommande identique)

  return (
    <div style={{ backgroundColor: '#fbfbfd', minHeight: '100vh', fontFamily: '-apple-system, sans-serif' }}>
      {/* Header, Hero, etc. (Gardez votre style actuel qui est très beau) */}
      
      {/* Modification de la Grid pour inclure le feedback visuel */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {produitsActifs.map(produit => (
            <div key={produit.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <img 
                  src={produit.image} 
                  alt={produit.couleur}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Introuvable'; }} // Image de secours
                  style={{ height: '80px', width: '80px', objectFit: 'contain' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{collectionActive === 'fuck' ? 'Tasse FUCK' : 'Tasse OLDA'}</h3>
                  <p style={{ margin: 0, color: '#86868b', fontSize: '14px' }}>{produit.couleur}</p>
                </div>
              </div>

              {/* ... Reste de votre formulaire (textarea, select) ... */}

              <button
                onClick={() => ajouterAuPanier(produit, quantiteSelectionnee[produit.id] || 1)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: boutonStatus[produit.id] ? '#34c759' : '#0071e3', // Vert si ajouté
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {boutonStatus[produit.id] || 'Ajouter au panier'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Votre Modal Panier ici */}
    </div>
  );
}
