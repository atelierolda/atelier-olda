import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nomClient, emailClient, panier, totalArticles } = req.body;
  const dateCommande = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  try {
    // Email pour vous (l'entreprise)
    const htmlVous = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Arial, sans-serif; background-color: #ffffff; -webkit-font-smoothing​​​​​​​​​​​​​​​​
