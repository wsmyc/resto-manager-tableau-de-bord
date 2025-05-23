// src/firebase.ts

// ------------------------------
// 1. Import Firebase SDK modules
// ------------------------------
import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

// -----------------------------------
// 2. Your Firebase project config
// -----------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAh_qXAMGvuayCYU0Dany2RIgC5Z4NQg1M",
  authDomain: "pferestau25.firebaseapp.com",
  projectId: "pferestau25",
  storageBucket: "pferestau25.appspot.com",
  messagingSenderId: "180090883215",
  appId: "1:180090883215:web:caa2a13100d2bd6b4e34fa"
};

// --------------------------------------------------
// 3. Initialize (or reuse) Firebase App, Auth, Firestore
// --------------------------------------------------
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// -----------------------------------
// 4. Authentication Functions
// -----------------------------------
/**
 * Sign up a new user with email and password
 */
export async function signUpUser(email: string, password: string): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign in an existing user with email and password
 */
export async function signInUser(email: string, password: string): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign out the currently logged-in user
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Update the current user's profile (displayName, photoURL)
 */
export async function updateUserProfile(updates: { displayName?: string; photoURL?: string; }): Promise<boolean> {
  if (!auth.currentUser) throw new Error('No user is currently signed in');
  await firebaseUpdateProfile(auth.currentUser, updates);
  return true;
}

// -----------------------------------
// 5. Firestore Utility Functions
// -----------------------------------
export interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
}

export async function getAllEmployees(): Promise<Employee[]> {
  const snap = await getDocs(collection(db, 'employees'));
  return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Employee) }));
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const docSnap = await getDoc(doc(db, 'employees', id));
  return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Employee) } : null;
}

export async function addEmployee(emp: Employee): Promise<string> {
  const ref = await addDoc(collection(db, 'employees'), {
    ...emp,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
  await updateDoc(doc(db, 'employees', id), data);
}

export async function deleteEmployee(id: string): Promise<void> {
  await deleteDoc(doc(db, 'employees', id));
}

// Debug logger
export const logDebug = (msg: string, data?: string | number | boolean | object | null | undefined) => console.log('[Firebase]', msg, data);
