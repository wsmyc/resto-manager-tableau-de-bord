
// Firebase Configuration and Services

// Define proper types for our data structures
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface FirebaseAuthResponse {
  user: User;
}

interface DocumentData {
  id?: string;
  [key: string]: any; // This allows for dynamic fields in documents
}

interface DocumentSnapshot {
  exists: boolean;
  id: string;
  data: () => DocumentData;
}

interface QuerySnapshot {
  docs: DocumentSnapshot[];
}

interface Employee {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
}

// 1. Firebase Configuration
// Replace these values with your own Firebase project configuration
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Firebase Authentication Functions
export const auth = {
  // Sign in with email and password
  signInWithEmailAndPassword: async (email: string, password: string): Promise<FirebaseAuthResponse> => {
    // TODO: Replace with actual Firebase Auth implementation
    // return signInWithEmailAndPassword(auth, email, password);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({ user: { uid: 'user123', email } });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },
  
  // Create user with email and password
  createUserWithEmailAndPassword: async (email: string, password: string): Promise<FirebaseAuthResponse> => {
    // TODO: Replace with actual Firebase Auth implementation
    // return createUserWithEmailAndPassword(auth, email, password);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({ user: { uid: `user-${Date.now()}`, email } });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },
  
  // Sign out
  signOut: async (): Promise<void> => {
    // TODO: Replace with actual Firebase Auth implementation
    // return signOut(auth);
    
    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  },
  
  // Get current user
  currentUser: null,

  // Update user profile
  updateProfile: async (user: User, profile: {displayName?: string, photoURL?: string}): Promise<boolean> => {
    // TODO: Replace with actual Firebase Auth implementation
    // return updateProfile(user, profile);
    
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Profile updated:", profile);
        resolve(true);
      }, 500);
    });
  }
};

// 3. Firestore Database Functions
export const firestore = {
  // Get collection reference
  collection: (path: string) => ({
    // Get document by ID
    doc: (id: string) => ({
      // Get document data
      get: async (): Promise<DocumentSnapshot> => {
        // TODO: Replace with actual Firestore implementation
        // return getDoc(doc(db, path, id));
        
        // Simulate API call
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              exists: true,
              data: () => ({ id, name: 'Sample Data' }),
              id
            });
          }, 500);
        });
      },
      
      // Set document data
      set: async (data: DocumentData): Promise<void> => {
        // TODO: Replace with actual Firestore implementation
        // return setDoc(doc(db, path, id), data);
        
        // Simulate API call
        return new Promise(resolve => {
          console.log(`Setting ${path}/${id}:`, data);
          setTimeout(resolve, 500);
        });
      },
      
      // Update document data
      update: async (data: DocumentData): Promise<void> => {
        // TODO: Replace with actual Firestore implementation
        // return updateDoc(doc(db, path, id), data);
        
        // Simulate API call
        return new Promise(resolve => {
          console.log(`Updating ${path}/${id}:`, data);
          setTimeout(resolve, 500);
        });
      },
      
      // Delete document
      delete: async (): Promise<void> => {
        // TODO: Replace with actual Firestore implementation
        // return deleteDoc(doc(db, path, id));
        
        // Simulate API call
        return new Promise(resolve => {
          console.log(`Deleting ${path}/${id}`);
          setTimeout(resolve, 500);
        });
      }
    }),
    
    // Add document to collection
    add: async (data: DocumentData): Promise<{id: string}> => {
      // TODO: Replace with actual Firestore implementation
      // return addDoc(collection(db, path), data);
      
      // Simulate API call
      return new Promise(resolve => {
        const docId = `doc-${Date.now()}`;
        console.log(`Adding to ${path}:`, data);
        setTimeout(() => {
          resolve({ id: docId });
        }, 500);
      });
    },
    
    // Get collection data
    get: async (): Promise<QuerySnapshot> => {
      // TODO: Replace with actual Firestore implementation
      // return getDocs(collection(db, path));
      
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            docs: [
              {
                id: 'doc1',
                data: () => ({ name: 'Sample Data 1' }),
                exists: true
              },
              {
                id: 'doc2',
                data: () => ({ name: 'Sample Data 2' }),
                exists: true
              }
            ]
          });
        }, 500);
      });
    },
    
    // Query collection
    where: (field: string, operator: string, value: string | number | boolean) => ({
      get: async (): Promise<QuerySnapshot> => {
        // TODO: Replace with actual Firestore implementation
        // const q = query(collection(db, path), where(field, operator, value));
        // return getDocs(q);
        
        // Simulate API call
        return new Promise(resolve => {
          console.log(`Querying ${path} where ${field} ${operator} ${value}`);
          setTimeout(() => {
            resolve({
              docs: [
                {
                  id: 'doc1',
                  data: () => ({ name: 'Filtered Data' }),
                  exists: true
                }
              ]
            });
          }, 500);
        });
      }
    })
  })
};

// 4. Employee Services
export const employeeService = {
  // Get all employees
  getEmployees: async (): Promise<Employee[]> => {
    // TODO: Replace with actual Firestore implementation
    // const employeesCollection = collection(db, 'employees');
    // const employeeSnapshot = await getDocs(employeesCollection);
    // return employeeSnapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...doc.data()
    // }));
    
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean.dupont@restaurant.fr",
            phone: "06 12 34 56 78",
            role: "Chef",
            salary: 2800
          },
          {
            id: 2,
            firstName: "Marie",
            lastName: "Laurent",
            email: "marie.laurent@restaurant.fr",
            phone: "06 98 76 54 32",
            role: "Serveur",
            salary: 1800
          },
        ]);
      }, 500);
    });
  },
  
  // Add new employee
  addEmployee: async (employee: Employee): Promise<{id: string}> => {
    // TODO: Replace with actual Firestore implementation
    // const employeesCollection = collection(db, 'employees');
    // return addDoc(employeesCollection, employee);
    
    // Simulate API call
    return new Promise(resolve => {
      console.log("Adding employee:", employee);
      setTimeout(() => {
        resolve({ id: `emp-${Date.now()}` });
      }, 500);
    });
  },
  
  // Update employee
  updateEmployee: async (id: string, data: Partial<Employee>): Promise<{success: boolean}> => {
    // TODO: Replace with actual Firestore implementation
    // const employeeDoc = doc(db, 'employees', id);
    // return updateDoc(employeeDoc, data);
    
    // Simulate API call
    return new Promise(resolve => {
      console.log(`Updating employee ${id}:`, data);
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
  
  // Delete employee
  deleteEmployee: async (id: string): Promise<{success: boolean}> => {
    // TODO: Replace with actual Firestore implementation
    // const employeeDoc = doc(db, 'employees', id);
    // return deleteDoc(employeeDoc);
    
    // Simulate API call
    return new Promise(resolve => {
      console.log(`Deleting employee ${id}`);
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};

/*
 * GUIDE D'INTÉGRATION DE FIREBASE
 * 
 * Pour connecter cette application à Firebase et remplacer les données statiques:
 * 
 * 1. CONFIGURATION
 *    - Créez un projet Firebase sur https://console.firebase.google.com/
 *    - Ajoutez une application Web et copiez la configuration
 *    - Installez Firebase: npm install firebase
 *    - Remplacez firebaseConfig avec votre configuration
 * 
 * 2. INITIALISATION
 *    - Décommentez ce code et placez-le en haut du fichier:
 * 
 *    import { initializeApp } from 'firebase/app';
 *    import { 
 *      getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
 *      signOut, updateProfile
 *    } from 'firebase/auth';
 *    import { 
 *      getFirestore, collection, doc, getDoc, setDoc, updateDoc, 
 *      deleteDoc, addDoc, getDocs, query, where
 *    } from 'firebase/firestore';
 * 
 *    const app = initializeApp(firebaseConfig);
 *    const auth = getAuth(app);
 *    const db = getFirestore(app);
 * 
 * 3. REMPLACER LES FONCTIONS SIMULÉES
 *    - Pour chaque fonction simulée (Promise avec setTimeout), remplacez par
 *      l'appel réel à Firebase (commenté avec "TODO: Replace with actual...")
 * 
 * 4. IMPORTATION DE DONNÉES
 *    - Si vous avez des données JSON existantes, vous pouvez les importer avec:
 *      
 *    async function importData(collectionName, data) {
 *      const batch = writeBatch(db);
 *      data.forEach(item => {
 *        const docRef = doc(collection(db, collectionName));
 *        batch.set(docRef, item);
 *      });
 *      await batch.commit();
 *    }
 *    
 *    // Exemple d'utilisation:
 *    // import employeesData from './data/employees.json';
 *    // importData('employees', employeesData);
 *
 * 5. SÉCURITÉ
 *    - Configurez les règles de sécurité Firebase pour contrôler l'accès
 *    - Pour Firestore: https://console.firebase.google.com/project/YOUR_PROJECT/firestore/rules
 *    - Pour Auth: https://console.firebase.google.com/project/YOUR_PROJECT/authentication/emails
 */
