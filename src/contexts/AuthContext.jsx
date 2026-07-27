import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const { profile } = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
        } else {
          // Fallback profile if Firestore is still propagating
          setUserProfile({
            uid: user.uid,
            email: user.email,
            username: user.email ? user.email.split('@')[0] : 'User',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
            firstName: '',
            lastName: '',
            phone: '',
            address: ''
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (currentUser) {
      const { profile } = await getUserProfile(currentUser.uid);
      if (profile) setUserProfile(profile);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    refreshProfile,
    setUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
