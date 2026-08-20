import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Suppress noisy network warning logs in sandbox iframe/proxied environments
setLogLevel('error');

// Initialize Firestore with robust offline persistence & multi-tab cache synchronization
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  }),
  experimentalForceLongPolling: true // Force HTTP long-polling to bypass restrictive sandbox iframes/proxies
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Email/Password", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, pass: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && result.user) {
      await updateProfile(result.user, { displayName: name });
    }
    return result.user;
  } catch (error) {
    console.error("Error signing up with Email/Password", error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

