// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCLSNRq4cN6MhJGQjyGeNj8QoGyjm3PnVQ",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "firo-fed58.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "firo-fed58",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "firo-fed58.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "938201610605",
  appId: env.VITE_FIREBASE_APP_ID || "1:938201610605:web:5c6922b9be92fe5cb64264",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-SL5GTX4PZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const logout = () => signOut(auth);

const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

const mapDocs = (snapshot) => snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

const getPortfolioItems = async () => {
  const snapshot = await getDocs(collection(db, "portfolio"));
  return mapDocs(snapshot);
};

const addPortfolioItem = async (item) => {
  const docRef = await addDoc(collection(db, "portfolio"), item);
  return docRef.id;
};

const deletePortfolioItem = async (id) => deleteDoc(doc(db, "portfolio", id));

const getServices = async () => {
  const snapshot = await getDocs(collection(db, "services"));
  return mapDocs(snapshot);
};

const addService = async (service) => {
  const docRef = await addDoc(collection(db, "services"), service);
  return docRef.id;
};

const deleteService = async (id) => deleteDoc(doc(db, "services", id));

const getAboutContent = async () => {
  const docRef = doc(db, "content", "about");
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data() : { content: "" };
};

const saveAboutContent = async (content) =>
  setDoc(doc(db, "content", "about"), { content }, { merge: true });

const getHeroData = async () => {
  const docRef = doc(db, "content", "hero");
  const snapshot = await getDoc(docRef);
  return snapshot.exists()
    ? snapshot.data()
    : { title: "", subtitle: "", imageUrl: "" };
};

const subscribeHeroData = (callback) => {
  const docRef = doc(db, "content", "hero");
  return onSnapshot(docRef, (snapshot) => {
    callback(
      snapshot.exists()
        ? snapshot.data()
        : { title: "", subtitle: "", imageUrl: "" }
    );
  });
};

const saveHeroData = async (heroData) =>
  setDoc(doc(db, "content", "hero"), heroData, { merge: true });

const getSocialLinks = async () => {
  const snapshot = await getDocs(collection(db, "socials"));
  return mapDocs(snapshot);
};

const addSocialLink = async (social) => {
  const docRef = await addDoc(collection(db, "socials"), social);
  return docRef.id;
};

const deleteSocialLink = async (id) => deleteDoc(doc(db, "socials", id));

const addContactMessage = async (message) =>
  addDoc(collection(db, "messages"), {
    ...message,
    createdAt: serverTimestamp()
  });

const getMessages = async () => {
  const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(messagesQuery);
  return mapDocs(snapshot);
};

const deleteMessage = async (id) => deleteDoc(doc(db, "messages", id));

export {
  app,
  auth,
  db,
  registerWithEmail,
  loginWithEmail,
  logout,
  onAuthChange,
  getPortfolioItems,
  addPortfolioItem,
  deletePortfolioItem,
  getServices,
  addService,
  deleteService,
  getAboutContent,
  saveAboutContent,
  getHeroData,
  subscribeHeroData,
  saveHeroData,
  getSocialLinks,
  addSocialLink,
  deleteSocialLink,
  addContactMessage,
  getMessages,
  deleteMessage
};
