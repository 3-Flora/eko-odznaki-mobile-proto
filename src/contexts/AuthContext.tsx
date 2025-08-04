import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";
import { User, Badge, Activity, ActivityCategory } from "../types";
import { availableBadges } from "../data/badges";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPoints: (points: number) => Promise<void>;
  addBadgeToUser: (badge: Badge) => Promise<void>;
  refreshUserData: () => Promise<void>;
  submitActivity: (activityData: {
    category: ActivityCategory;
    title: string;
    description: string;
    photoURL?: string;
  }) => Promise<void>;
  getUserActivities: () => Promise<Activity[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (
    firebaseUser: FirebaseUser,
    additionalData?: Partial<User>
  ): Promise<User> => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName:
          firebaseUser.displayName || additionalData?.displayName || "",
        school: additionalData?.school || "",
        className: additionalData?.className || "",
        role: additionalData?.role || "student",
        points: 0,
        badges: [],
        ...(firebaseUser.photoURL && { photoURL: firebaseUser.photoURL }),
      };

      await setDoc(userRef, userData);
      return userData;
    }

    return userSnap.data() as User;
  };

  const updateUserPoints = async (additionalPoints: number) => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.id);
    const newPoints = currentUser.points + additionalPoints;

    await updateDoc(userRef, {
      points: newPoints,
    });

    // Update local state
    setCurrentUser((prev) => (prev ? { ...prev, points: newPoints } : null));

    // Check and award new badges
    await checkAndAwardBadges(newPoints);
  };

  const checkAndAwardBadges = async (userPoints: number) => {
    if (!currentUser) return;

    const earnedBadgeIds = currentUser.badges.map((badge) => badge.id);
    const newBadges: Badge[] = [];

    // Check point-based badges
    availableBadges.forEach((badge) => {
      if (
        badge.pointsRequired > 0 &&
        userPoints >= badge.pointsRequired &&
        !earnedBadgeIds.includes(badge.id)
      ) {
        newBadges.push({ ...badge, earnedAt: new Date() });
      }
    });

    // Award new badges
    for (const badge of newBadges) {
      await addBadgeToUser(badge);
    }
  };

  const addBadgeToUser = async (badge: Badge) => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.id);
    const newBadges = [
      ...currentUser.badges,
      { ...badge, earnedAt: new Date() },
    ];

    await updateDoc(userRef, {
      badges: newBadges,
    });

    // Update local state
    setCurrentUser((prev) => (prev ? { ...prev, badges: newBadges } : null));
  };

  const refreshUserData = async () => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setCurrentUser(userSnap.data() as User);
    }
  };

  const submitActivity = async (activityData: {
    category: ActivityCategory;
    title: string;
    description: string;
    photoURL?: string;
  }) => {
    if (!currentUser) return;

    const activity: Omit<Activity, "id"> = {
      userId: currentUser.id,
      userName: currentUser.displayName,
      userPhoto: currentUser.photoURL,
      category: activityData.category,
      title: activityData.title,
      description: activityData.description,
      photoURL: activityData.photoURL,
      points: getCategoryPoints(activityData.category), // We'll create this helper
      status: "pending",
      submittedAt: new Date(),
    };

    await addDoc(collection(db, "activities"), {
      ...activity,
      submittedAt: serverTimestamp(),
    });
  };

  const getUserActivities = async (): Promise<Activity[]> => {
    if (!currentUser) return [];

    const activitiesQuery = query(
      collection(db, "activities"),
      where("userId", "==", currentUser.id),
      orderBy("submittedAt", "desc")
    );

    const querySnapshot = await getDocs(activitiesQuery);
    const activities: Activity[] = [];

    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
        reviewedAt: doc.data().reviewedAt?.toDate(),
      } as Activity);
    });

    return activities;
  };

  // Helper function to get points for activity category
  const getCategoryPoints = (category: ActivityCategory): number => {
    const categoryMap: Record<ActivityCategory, number> = {
      transport: 10,
      recycling: 15,
      energy: 12,
      water: 8,
      cleanup: 20,
      nature: 18,
      education: 25,
    };
    return categoryMap[category] || 10;
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createUserDocument(user, userData);
  };

  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await createUserDocument(user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    let userUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await createUserDocument(firebaseUser);
          setCurrentUser(userData);

          // Set up real-time listener for user data
          const userRef = doc(db, "users", firebaseUser.uid);
          userUnsubscribe = onSnapshot(
            userRef,
            (doc) => {
              if (doc.exists()) {
                setCurrentUser(doc.data() as User);
              }
            },
            (error) => {
              console.error("Error listening to user data:", error);
            }
          );
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (userUnsubscribe) {
        userUnsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserPoints,
    addBadgeToUser,
    refreshUserData,
    submitActivity,
    getUserActivities,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
