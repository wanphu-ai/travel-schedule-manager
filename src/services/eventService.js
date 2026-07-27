import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const LOCAL_STORAGE_EVENTS_KEY = 'travel_events_backup';

// Helper local storage fallback
export const getLocalEvents = (uid) => {
  const saved = localStorage.getItem(`${LOCAL_STORAGE_EVENTS_KEY}_${uid}`);
  return saved ? JSON.parse(saved) : [];
};

export const saveLocalEvents = (uid, events) => {
  localStorage.setItem(`${LOCAL_STORAGE_EVENTS_KEY}_${uid}`, JSON.stringify(events));
};

// Firestore CRUD Event Services
export const subscribeUserEvents = (uid, onUpdate, onError) => {
  try {
    const q = query(
      collection(db, 'users', uid, 'events'),
      orderBy('order', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      // Backup to localStorage
      saveLocalEvents(uid, events);
      onUpdate(events);
    }, (error) => {
      console.warn('Firestore subscription error, fallback to localStorage:', error);
      const fallback = getLocalEvents(uid);
      onUpdate(fallback);
      if (onError) onError(error);
    });
  } catch (err) {
    console.warn('Firestore setup error, using localStorage fallback:', err);
    const fallback = getLocalEvents(uid);
    onUpdate(fallback);
    return () => {};
  }
};

export const createEvent = async (uid, eventData, existingEvents = []) => {
  try {
    const newOrder = existingEvents.length;
    const dataWithMeta = {
      ...eventData,
      order: newOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'users', uid, 'events'), dataWithMeta);
    return { id: docRef.id, ...dataWithMeta, error: null };
  } catch (error) {
    console.warn('Firestore error, adding to localStorage:', error);
    const fallbackEvents = getLocalEvents(uid);
    const localId = `local_${Date.now()}`;
    const newEvent = { id: localId, ...eventData, order: fallbackEvents.length, createdAt: new Date().toISOString() };
    const updated = [...fallbackEvents, newEvent];
    saveLocalEvents(uid, updated);
    return { ...newEvent, error: null };
  }
};

export const updateEvent = async (uid, eventId, updateData) => {
  try {
    if (eventId.startsWith('local_')) {
      const fallbackEvents = getLocalEvents(uid);
      const updated = fallbackEvents.map(e => e.id === eventId ? { ...e, ...updateData } : e);
      saveLocalEvents(uid, updated);
      return { success: true };
    }
    const eventRef = doc(db, 'users', uid, 'events', eventId);
    await updateDoc(eventRef, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.warn('Firestore update error, updating local:', error);
    const fallbackEvents = getLocalEvents(uid);
    const updated = fallbackEvents.map(e => e.id === eventId ? { ...e, ...updateData } : e);
    saveLocalEvents(uid, updated);
    return { success: true };
  }
};

export const deleteEvent = async (uid, eventId) => {
  try {
    if (eventId.startsWith('local_')) {
      const fallbackEvents = getLocalEvents(uid);
      const updated = fallbackEvents.filter(e => e.id !== eventId);
      saveLocalEvents(uid, updated);
      return { success: true };
    }
    const eventRef = doc(db, 'users', uid, 'events', eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    const fallbackEvents = getLocalEvents(uid);
    const updated = fallbackEvents.filter(e => e.id !== eventId);
    saveLocalEvents(uid, updated);
    return { success: true };
  }
};
