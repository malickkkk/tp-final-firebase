import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase'; // Importer Firestore (db)
import { doc, setDoc } from 'firebase/firestore'; // Méthodes pour écrire dans Firestore

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Créer un nouvel utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Récupérer les informations utilisateur
      const user = userCredential.user;

      // Sauvegarder les informations utilisateur dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email, // Email de l'utilisateur
        uid: user.uid, // UID de l'utilisateur
      });

      setMessage('Inscription réussie et données enregistrées dans Firestore.');
      console.log("Utilisateur créé avec succès :", user.email);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setMessage('Erreur lors de l\'inscription.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUpForm;
