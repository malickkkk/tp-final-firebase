import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './App.css';
import SignUpForm from './SignUpForm';
import SignInForm from './SigniForm';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDN4TuOmPwI-uBQaQHDoVTjilANw1LnbQU",
  authDomain: "tpfinal-c516f.firebaseapp.com",
  projectId: "tpfinal-c516f",
  storageBucket: "tpfinal-c516f.firebasestorage.app",
  messagingSenderId: "156094658207",
  appId: "1:156094658207:web:9fd2ffc0c7477d46c294aa"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // Fonction de déconnexion
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Écouter l'état de l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Écouter les nouveaux messages
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  // Gérer les messages
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, 'messages'), {
        texte: newMessage,
        auteurId: user.uid,
        auteurNom: user.displayName || user.email,
        auteurImage: profileImageUrl,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  // Gérer les images de profil
  const handleProfileImageChange = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const handleUploadProfileImage = async () => {
    if (profileImage) {
      const imageRef = ref(storage, `images_profil/${user.uid}`);
      try {
        await uploadBytes(imageRef, profileImage);
        const imageUrl = await getDownloadURL(imageRef);
        setProfileImageUrl(imageUrl);
        // Optionnel : mettre à jour l'URL de l'image de profil dans Firestore
        // await updateDoc(doc(db, 'users', user.uid), { profileImageUrl: imageUrl });
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image :", error);
      }
    }
  };

  return (
    <div className="App">
      {user ? (
        <>
          <div>
            <img src={profileImageUrl || 'default-profile.png'} alt="Image de profil" />
            <p>{user.displayName || user.email}</p>
            <button onClick={handleSignOut}>Déconnexion</button>
          </div>
          <form onSubmit={handleSubmitMessage}>
            <input type="text" value={newMessage} onChange={handleNewMessageChange} />
            <button type="submit">Envoyer</button>
          </form>
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <img src={message.auteurImage || 'default-profile.png'} alt="Image de profil" />
                <p>{message.auteurNom}: {message.texte}</p>
              </li>
            ))}
          </ul>
          <div>
            <h2>Télécharger une image de profil</h2>
            <input type="file" onChange={handleProfileImageChange} />
            <button onClick={handleUploadProfileImage}>Télécharger</button>
          </div>
        </>
      ) : (
        <div>
          <SignUpForm />
          <SignInForm />
        </div>
      )}
    </div>
  );
}

export default App;
