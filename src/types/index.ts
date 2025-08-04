export interface User {
  id: string;
  email: string;
  displayName: string;
  school: string;
  className: string;
  role: "student" | "teacher";
  points: number;
  badges: Badge[];
  photoURL?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  color: string;
  earnedAt?: Date;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  category: ActivityCategory;
  title: string;
  description: string;
  photoURL?: string;
  points: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export type ActivityCategory =
  | "transport"
  | "recycling"
  | "energy"
  | "water"
  | "cleanup"
  | "nature"
  | "education";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  bonusPoints: number;
  startDate: Date;
  endDate: Date;
  participants: string[];
}

export interface Ranking {
  userId: string;
  userName: string;
  userPhoto?: string;
  points: number;
  rank: number;
  school?: string;
  className?: string;
}
