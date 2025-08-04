import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Activity, User } from "../types";
import { useAuth } from "./AuthContext";

interface ActivityContextType {
  pendingActivities: Activity[];
  approvedActivities: Activity[];
  loading: boolean;
  approveActivity: (activityId: string, points: number) => Promise<void>;
  rejectActivity: (activityId: string, reason?: string) => Promise<void>;
  getRecentActivities: (
    schoolName?: string,
    className?: string,
  ) => Promise<Activity[]>;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [pendingActivities, setPendingActivities] = useState<Activity[]>([]);
  const [approvedActivities, setApprovedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setPendingActivities([]);
      setApprovedActivities([]);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      // For teachers, load all pending activities from their school/class
      // For students, load their own activities
      let activitiesQuery;

      if (currentUser.role === "teacher") {
        // Teacher sees all pending activities from their school
        activitiesQuery = query(
          collection(db, "activities"),
          where("status", "==", "pending"),
          orderBy("submittedAt", "desc"),
        );
      } else {
        // Student sees their own activities
        activitiesQuery = query(
          collection(db, "activities"),
          where("userId", "==", currentUser.id),
          orderBy("submittedAt", "desc"),
        );
      }

      unsubscribe = onSnapshot(
        activitiesQuery,
        (snapshot) => {
          const activities: Activity[] = [];
          snapshot.forEach((doc) => {
            activities.push({
              id: doc.id,
              ...doc.data(),
              submittedAt: doc.data().submittedAt?.toDate() || new Date(),
              reviewedAt: doc.data().reviewedAt?.toDate(),
            } as Activity);
          });

          if (currentUser.role === "teacher") {
            setPendingActivities(activities);
          } else {
            // For students, separate by status
            setPendingActivities(
              activities.filter((a) => a.status === "pending"),
            );
            setApprovedActivities(
              activities.filter((a) => a.status === "approved"),
            );
          }

          setLoading(false);
        },
        (error) => {
          console.error("Error loading activities:", error);
          setLoading(false);
        },
      );
    } catch (error) {
      console.error("Error setting up activities listener:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const approveActivity = async (activityId: string, points: number) => {
    if (currentUser?.role !== "teacher") return;

    const activityRef = doc(db, "activities", activityId);
    await updateDoc(activityRef, {
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: currentUser.id,
      points: points, // Teacher can adjust points
    });

    // Find the activity to get user info
    const activity = pendingActivities.find((a) => a.id === activityId);
    if (activity) {
      // Update user points directly in user document
      const userRef = doc(db, "users", activity.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        await updateDoc(userRef, {
          points: userData.points + points,
        });
      }
    }
  };

  const rejectActivity = async (activityId: string, reason?: string) => {
    if (currentUser?.role !== "teacher") return;

    const activityRef = doc(db, "activities", activityId);
    await updateDoc(activityRef, {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: currentUser.id,
      rejectionReason: reason || "Nie spełnia wymagań",
    });
  };

  const getRecentActivities = async (
    schoolName?: string,
    className?: string,
  ): Promise<Activity[]> => {
    let activitiesQuery;

    if (schoolName && className) {
      // Get activities from specific class
      const usersQuery = query(
        collection(db, "users"),
        where("school", "==", schoolName),
        where("className", "==", className),
      );
      const usersSnapshot = await getDocs(usersQuery);
      const userIds = usersSnapshot.docs.map((doc) => doc.id);

      if (userIds.length === 0) return [];

      activitiesQuery = query(
        collection(db, "activities"),
        where("userId", "in", userIds),
        where("status", "==", "approved"),
        orderBy("reviewedAt", "desc"),
        limit(10),
      );
    } else {
      // Get all recent approved activities
      activitiesQuery = query(
        collection(db, "activities"),
        where("status", "==", "approved"),
        orderBy("reviewedAt", "desc"),
        limit(10),
      );
    }

    const snapshot = await getDocs(activitiesQuery);
    const activities: Activity[] = [];

    snapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
        reviewedAt: doc.data().reviewedAt?.toDate(),
      } as Activity);
    });

    return activities;
  };

  const value = {
    pendingActivities,
    approvedActivities,
    loading,
    approveActivity,
    rejectActivity,
    getRecentActivities,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};
