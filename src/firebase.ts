// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadString} from "firebase/storage";
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

// storage
const storage = getStorage(app, 'gs://declaration-of-prototype.appspot.com');

// *********************************************************************************
// declarations
// *********************************************************************************
const declarationsCollection = collection(db, "declarations");
export const getDeclarations = async () => {
    const querySnapshot = await getDocs(declarationsCollection);
    const declarations: any = [];
    querySnapshot.forEach((doc) => {
        declarations.push({...doc.data(), id: doc.id});
    });
    return declarations;
}
export const getDeclaration = async (id: any) => {
    if (!id) return;
    console.log('fetching declaration with id ' + id);
    const docRef = doc(db, "declarations", id);
    const docSnap = await getDoc(docRef);

    return {
        ...docSnap.data(),
        id: docSnap.id,
    };
}
export const createDeclaration = async (declaration: any) => {
    console.log('posting new declaration to FireBase', declaration);
    const docRef = await addDoc(collection(db, "declarations"), {
        ...declaration,
    });
    const newId = docRef.id;
    return newId;
}
export const deleteDeclaration = async (id: any) => {
    await deleteDoc(doc(db, "declarations", id));
}
export const updateDeclaration = async (id: any, declaration: any) => {
    // upload attachments
    // const promises: any = [];
    // for (let i = 0; i < declaration?.attachments?.length; i++) {
    //     const fileRef = ref(storage, `${id}/${i}`);
    //     const uploadTask = uploadString(fileRef, declaration?.attachments[i], 'data_url');
    //     promises.push(uploadTask);
    // }
    // await Promise.all(promises);
    await updateDoc(doc(db, "declarations", id), {
        ...declaration,
        attachments: declaration?.attachments?.length,
    });
}

// *********************************************************************************
// expenses
// *********************************************************************************
const expensesCollection = collection(db, "expenses");
export const getExpenses = async () => {
    const querySnapshot = await getDocs(expensesCollection);
    const expenses: any = [];
    querySnapshot.forEach((doc) => {
        expenses.push({...doc.data(), id: doc.id});
    });
    console.log('expenses', expenses);
    return expenses;
}

export const getExpense = async (id: any) => {
    if (!id) return;
    console.log('fetching expense with id ' + id);
    const docRef = doc(db, "expenses", id);
    const docSnap = await getDoc(docRef);
    const expense = docSnap.data();

    console.log('fetched expense', expense);

    const attachments = [];
    for (const attachmentRef of expense?.attachments) {
        const fileRef = ref(storage, attachmentRef);
        const url = await getDownloadURL(fileRef);
        attachments.push(url);
    }
    const response = {
        ...expense,
        id: docSnap.id,
        attachments,
    }
    console.log('parsed expense', response);
    return response;
}

export const createExpense = async (inputExpense: any) => {
    let newExpenseId = null;
    try {
        console.log('creating new expense', inputExpense);

        const docRef = await addDoc(collection(db, "expenses"), {
            ...inputExpense,
            attachments: inputExpense?.attachments?.length,
        });
        newExpenseId = docRef.id;
    } catch (error) {
        console.log('error creating expense', error);
    }

    if (newExpenseId && inputExpense?.attachments?.length > 0) {
        try {
            // upload attachments
            const attachments = [];
            const promises: any = [];
            for (let i = 0; i < inputExpense?.attachments?.length; i++) {
                const attachment = inputExpense?.attachments[i];
                const fileRef = ref(storage, `${newExpenseId}/${i}`);
                const uploadTask = uploadString(fileRef, attachment, 'data_url');
                attachments.push(`${newExpenseId}/${i}`);
                promises.push(uploadTask);
            }
            await Promise.all(promises);

            // update the expense with the attachments
            await updateDoc(doc(db, "expenses", newExpenseId), {
                ...inputExpense,
                attachments,
            });
        } catch (error) {
            console.log('error uploading attachments', error);
        }
    }
    return newExpenseId;
}
export const deleteExpense = async (id: any) => {
    await deleteDoc(doc(db, "expenses", id));
}
export const updateExpense = async (id: any, expense: any) => {
    // upload attachments
    // const promises: any = [];
    // for (let i = 0; i < declaration?.attachments?.length; i++) {
    //     const fileRef = ref(storage, `${id}/${i}`);
    //     const uploadTask = uploadString(fileRef, declaration?.attachments[i], 'data_url');
    //     promises.push(uploadTask);
    // }
    // await Promise.all(promises);
    await updateDoc(doc(db, "expenses", id), {
        ...expense,
        attachments: expense?.attachments,
    });
}
// *********************************************************************************
// attachments
// *********************************************************************************
export const getExpenseAttachments = async (attachmentRefs: any) => {
    console.log('fetching attachments', attachmentRefs);
    const attachments: any = [];
    for (let i = 0; i < attachmentRefs?.length; i++) {
        const fileRef = ref(storage, attachmentRefs[i]);
        const url = await getDownloadURL(fileRef);
        attachments?.push(url);
    }
    console.log('fetched attachments', attachments);
    return attachments;
}

// export const getDeclarationAttachments = async (id: any, numberOfAttachments: number) => {
//     return await fetchDeclarationAttachments(id, numberOfAttachments);
// }

// *********************************************************************************
// Notifications
// *********************************************************************************
const notificationsCollection = collection(db, "notifications");
export const getNotifications = async () => {
    const querySnapshot = await getDocs(notificationsCollection);
    const notifications: any = [];
    querySnapshot.forEach((doc) => {
        notifications.push({...doc.data(), id: doc.id});
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
