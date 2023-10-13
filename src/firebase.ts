// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpqgq3YLSKhra1bMfQRdSYQJi-MZzOzPM",
    authDomain: "declaration-of-prototype.firebaseapp.com",
    projectId: "declaration-of-prototype",
    storageBucket: "declaration-of-prototype.appspot.com",
    messagingSenderId: "514470074938",
    appId: "1:514470074938:web:93348a7f5067b6fe9ab303"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Declaration functions
const declarationsCollection = collection(db, "declarations");
export const getDeclarations = async () => {
    const querySnapshot = await getDocs(declarationsCollection);
    const declarations: any = [];
    querySnapshot.forEach((doc) => {
        declarations.push({ ...doc.data(), id: doc.id });
    });
    return declarations;
}
export const getDeclaration = async (id: any) => {
    const docRef = doc(db, "declarations", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}
export const createDeclaration = async (declaration: any) => {
    const docRef = await addDoc(collection(db, "declarations"), declaration);
    console.log("Document written with ID: ", docRef.id);
}
export const deleteDeclaration = async (id: any) => {
    await deleteDoc(doc(db, "declarations", id));
}
export const updateDeclaration = async (id: any, declaration: any) => {
    await updateDoc(doc(db, "declarations", id), declaration);
}

// Notification functions
const notificationsCollection = collection(db, "notifications");
export const getNotifications = async () => {
    const querySnapshot = await getDocs(notificationsCollection);
    const notifications: any = [];
    querySnapshot.forEach((doc) => {
        notifications.push({ ...doc.data(), id: doc.id });
    });
    return notifications;
}
export const createNotification = async (notification: any) => {
    const docRef = await addDoc(collection(db, "notifications"), {
        ...notification,
        timestamp: new Date(),
    });
    console.log("Notification written with ID: ", docRef.id);
}
