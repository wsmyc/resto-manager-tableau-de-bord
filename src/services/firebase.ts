// src/firebase.ts

// 1. Import Firebase SDK modules
import { getApps, initializeApp } from 'firebase/app'; // Initialize or reuse Firebase App instance
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth'; // Firebase Authentication
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
  where
} from 'firebase/firestore'; // Firestore Database

// 2. Your Firebase project configuration
//    These values link your code to your existing Firebase project (no new project is created)
const firebaseConfig = {
  apiKey: "AIzaSyAh_qXAMGvuayCYU0Dany2RIgC5Z4NQg1M",
  authDomain: "pferestau25.firebaseapp.com",
  projectId: "pferestau25",
  storageBucket: "pferestau25.firebasestorage.app",
  messagingSenderId: "180090883215", // TODO: Enter your messaging sender ID
  appId: "1:180090883215:web:caa2a13100d2bd6b4e34fa" // TODO: Enter your app ID
};

// 3. Initialize or reuse Firebase App, Auth, and Firestore
//    For hot-reload environments, avoid duplicate initialization by reusing an existing app if present
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)  // Link to your existing Firebase project using provided config
  : getApps()[0];                 // Reuse already initialized app instance

export const auth = getAuth(firebaseApp);  // Authentication service linked to existing project
export const db = getFirestore(firebaseApp); // Firestore service linked to existing project

// --- Authentication Functions ---

/**
 * Sign up a new user with email and password
 * @param email User's email
 * @param password User's chosen password
 * @returns The created FirebaseUser object
 */
export async function signUpUser(email: string, password: string): Promise<FirebaseUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign in an existing user with email and password
 * @param email User's email
 * @param password User's password
 * @returns The signed-in FirebaseUser object
 */
export async function signInUser(email: string, password: string): Promise<FirebaseUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign out the currently logged-in user
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Update the current user's profile (displayName, photoURL)
 * @param updates Object containing displayName and/or photoURL
 * @throws Error if no user is signed in
 * @returns true if update succeeds
 */
export async function updateUserProfile(updates: { displayName?: string; photoURL?: string; }): Promise<boolean> {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }
  await firebaseUpdateProfile(auth.currentUser, {
    displayName: updates.displayName,
    photoURL: updates.photoURL
  });
  return true;
}

// --- Firestore Types & Functions ---

/**
 * Employee data structure for Firestore documents
 */
export interface Employee {
  id?: string;            // Firestore document ID
  firstName: string;      // Employee's first name
  lastName: string;       // Employee's last name
  email: string;          // Employee's email address
  phone: string;          // Employee's phone number
  role: string;           // Employee's job role/title
  salary: number;         // Employee's salary
}

/**
 * Retrieve all employees from Firestore "employees" collection
 * @returns Array of Employee objects
 */
export async function getAllEmployees(): Promise<Employee[]> {
  const employeesCol = collection(db, 'employees');                // Reference to collection
  const snapshot = await getDocs(employeesCol);                   // Fetch all docs

  const employees: Employee[] = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as Omit<Employee, 'id'>;
    employees.push({ id: docSnap.id, ...data });                  // Include doc ID
  });
  return employees;
}

/**
 * Retrieve a single employee by document ID
 * @param id Document ID of the employee
 * @returns Employee object or null if not found
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  const docRef = doc(db, 'employees', id);                        // Document reference
  const docSnap = await getDoc(docRef);                           // Fetch doc

  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as Omit<Employee, 'id'>) };
  }
  return null;
}

/**
 * Add a new employee to Firestore
 * @param employee The Employee data (without ID)
 * @returns The new document ID
 */
export async function addEmployee(employee: Employee): Promise<string> {
  const docRef = await addDoc(collection(db, 'employees'), employee);
  return docRef.id;
}

/**
 * Update an existing employee document
 * @param id Document ID of the employee
 * @param data Partial fields to update
 */
export async function updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
  const docRef = doc(db, 'employees', id);
  await updateDoc(docRef, data);
}

/**
 * Delete an employee document by ID
 * @param id Document ID of the employee
 */
export async function deleteEmployee(id: string): Promise<void> {
  const docRef = doc(db, 'employees', id);
  await deleteDoc(docRef);
}

/**
 * Example query: retrieve employees by role
 * @param role Role to filter by (e.g., 'Chef')
 * @returns Array of Employee objects matching the role
 */
export async function queryEmployeesByRole(role: string): Promise<Employee[]> {
  const q = query(collection(db, 'employees'), where('role', '==', role));
  const snapshot = await getDocs(q);

  const results: Employee[] = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as Omit<Employee, 'id'>;
    results.push({ id: docSnap.id, ...data });
  });
  return results;
}
