import React, { useState } from 'react';

export default function CatalogueCommande() {
  const [collectionActive, setCollectionActive] = useState('olda');
  
  const [produitsOlda] = useState([
    { id: 1, reference: 'TC 01', image: '/images/mugs/roseblanc.jpg', couleur: 'Rose & Blanc', quantite: 0 },
    { id: 2, reference: 'TC 02', image: '/images/mugs/rougeblanc.jpg', couleur: 'Rouge & Blanc', quantite: 0 },
    { id: 3, reference: 'TC 03', image: '/images/mugs/orangeblanc.jpg', couleur: 'Orange & Blanc', quantite: 0 },
    { id: 4, reference: 'TC 04', image: '/images/mugs/vertblanc.jpg', couleur: 'Vert & Blanc', quantite: 0 },
    { id: 5, reference: 'TC 05', image: '/images/mugs/noirblanc.jpg', couleur: 'Noir & Blanc', quantite: 0 },
    { id: 6, reference: 'TC 06', image: '/images/mugs/noirrose.JPG', couleur: 'Noir & Rose', quantite: 0 },
    { id: 7, reference: 'TC 07', image: '/images/mugs/noirrouge.JPG', couleur: 'Noir & Rouge', quantite: 0 },
    { id: 8, reference: 'TC 08', image: '/images/mugs/noirorange.JPG', couleur: 'Noir & Orange', quantite: 0 },
    { id: 9, reference: 'TC 09', image: '/images/mugs/noirjaune.JPG', couleur: 'Noir & Jaune', quantite: 0 },
    { id: 10, reference: 'TC 10', image: '/images/mugs/noirvert.JPG', couleur: 'Noir & Vert', quantite: 0 }
  ]);

  const [produitsFuck] = useState([
    { id: 11, reference: 'TF 01', image: '/images/mugs/fuckblancnoir.JPG', couleur: 'Blanc & Noir', quantite: 0 }
  ]);

  const [panier, setPanier] = useState([]);
  const [quantiteSelectionnee, setQuantiteSelectionnee] = useState({});
  const [commentairesProduits, setCommentairesProduits] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [nomClient, setNomClient] = useState('');
  const [emailClient, setEmailClient] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [montrerMerci, setMontrerMerci] = useState(false);

  const produitsActifs = collectionActive === 'olda' ? produitsOlda : produitsFuck;

  const ajouterAuPanier = (produit, quantite) => {
    if (quantite <= 0) return;
    
    const existe = panier.find(p => p.id === produit.id);
    const commentaireProduit = commentairesProduits[produit.id] || '';
    
    if (existe) {
      setPanier(panier.map(p => 
        p.id === produit.id ? { ...p, quantite: p.quantite + quantite, commentaire: commentaireProduit } : p
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: quantite, commentaire: commentaireProduit }]);
    }
    
    setQuantiteSelectionnee({ ...quantiteSelectionnee, [produit.id]: 1 });
  };

  const updateQuantite = (id, quantite) => {
    if (quantite <= 0) {
      setPanier(panier.filter(p => p.id !== id));
    } else {
      setPanier(panier.map(p =>
        p.id === id ? { ...p, quantite: parseInt(quantite) } : p
      ));
    }
  };

  const totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

  const envoyerCommande = async () => {
    if (!nomClient || panier.length === 0) {
      alert('Veuillez renseigner votre nom et ajouter au moins un produit');
      return;
    }

    setEnvoiEnCours(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomClient,
          emailClient,
          commentaire,
          panier
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMontrerMerci(true);
        setTimeout(() => {
          setPanier([]);
          setNomClient('');
          setEmailClient('');
          setCommentaire('');
          setCommentairesProduits({});
          setMontrerMerci(false);
          setPanierOuvert(false);
        }, 4000);
      } else {
        alert('Erreur: ' + (data.message || 'Problème lors de l\'envoi'));
        console.error('Détails erreur:', data);
      }
    } catch (error) {
      alert('Erreur de connexion: ' + error.message);
      console.error('Erreur:', error);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#fbfbfd'
    }}>
      {/* Header */}
      <nav style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(251, 251, 253, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        padding: '14px 0',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 max(20px, env(safe-area-inset-left))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <img 
            src="/images/mugs/logo.jpeg" 
            alt="Olda" 
            style={{ 
              height: '32px', 
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          
          {/* Onglets Collections */}
          <div style={{ 
            display: 'flex', 
            gap: '24px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <button
              onClick={() => setCollectionActive('olda')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                color: collectionActive === 'olda' ? '#1d1d1f' : '#86868b',
                padding: '8px 12px',
                position: 'relative',
                transition: 'color 0.2s'
              }}
            >
              Tasse OLDA
              {collectionActive === 'olda' && (
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '2px',
                  backgroundColor: '#1d1d1f',
                  borderRadius: '2px'
                }} />
              )}
            </button>
            
            <button
              onClick={() => setCollectionActive('fuck')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
