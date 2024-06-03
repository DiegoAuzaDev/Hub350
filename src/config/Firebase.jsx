/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { deleteObject } from "firebase/storage";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDhNzm22R5AKnlMAT0AyAeMiK1opRulMgQ",
  authDomain: "kanta-data-abc-123.firebaseapp.com",
  projectId: "kanta-data-abc-123",
  storageBucket: "kanta-data-abc-123.appspot.com",
  messagingSenderId: "766864621598",
  appId: "1:766864621598:web:0898805f2b15531a376e0f",
  measurementId: "G-G6PS1PFF31",
};

export const app = initializeApp(firebaseConfig);

const db = getFirestore();
const colRef = collection(db, "KanataMapDataCollection");
const storage = getStorage(app);

export async function getUserRoleByUID(uid) {
  const userDocRef = doc(db, "users", uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting user data: ${error}`);
    return null;
  }
}

export async function createNewImageCompany(docId, image, role) {
  try {
    const logosRef = ref(storage, `logos/${docId}`);
    const uploadTask = await uploadBytes(logosRef, image);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    const docRef = doc(db, "KanataMapDataCollection", docId);
    await updateDoc(docRef, {
      Image: downloadURL,
    });
    return true;
  } catch (error) {
    console.error(`Error creating new image: ${error}`);
    return null;
  }
}
export async function deleteImageFromStorage(docId, imageURL) {
  try {
    const docRef = doc(db, "KanataMapDataCollection", docId);
    await updateDoc(docRef, {
      Image: null,
    });
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error(`Error deleting image: ${error}`);
    return null;
  }
}

export async function updateGeolocation(docId, element, Latitude, Longitude) {
  try {
    const docRef = doc(db, "KanataMapDataCollection", docId);
    await updateDoc(docRef, {
      ...element,
      Latitude: Latitude,
      Longitude: Longitude,
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
}
export async function getDataFirebase() {
  try {
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({
        ...doc.data(),
        docId: doc.id,
      });
    });
    return data;
  } catch (error) {
    console.error(`Error getting data from Firebase: Error -> ${error}`);
    return null;
  }
}

const userRef = collection(db, "users");
