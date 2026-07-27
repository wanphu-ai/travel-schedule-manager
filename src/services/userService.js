import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    const profileData = {
      uid,
      email: userData.email || '',
      username: userData.email ? userData.email.split('@')[0] : 'User',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      address: userData.address || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, profileData);
    return { profile: profileData, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { profile: null, error: error.message };
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { profile: docSnap.data(), error: null };
    } else {
      return { profile: null, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { profile: null, error: error.message };
  }
};

export const updateUserProfile = async (uid, updateData) => {
  try {
    const userRef = doc(db, 'users', uid);
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(userRef, dataToUpdate);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};
