import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { availableBadges } from "../../data/badges";

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Mock recent activities for now
  const recentActivities = [
    {
      id: "1",
      userName: "Anna K.",
      title: "Przejazd rowerem do szkoły",
      points: 10,
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      reviewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: "2",
      userName: "Piotr M.",
      title: "Segregacja śmieci",
      points: 15,
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      reviewedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
  ];

  // Find next badge
  const nextBadge = availableBadges
    .filter((badge) => (currentUser?.points || 0) < badge.pointsRequired)
    .sort((a, b) => a.pointsRequired - b.pointsRequired)[0];

  const nextBadgePoints = nextBadge?.pointsRequired || 50;
  const currentStreak = 5; // TODO: Calculate from user data
  const weeklyProgress = Math.min(
    ((currentUser?.points || 0) / 100) * 100,
    100,
  ); // Weekly goal of 100 points

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">
          Cześć, {currentUser?.displayName?.split(" ")[0]}! 👋
        </h2>
        <p className="text-gray-600 mb-4">
          Masz już <span className="font-bold">{currentUser?.points || 0}</span>{" "}
          punktów eco!
        </p>
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full px-3 py-1 mr-2">
            <span className="text-sm font-semibold">
              Streak: {currentStreak} dni 🔥
            </span>
          </div>
        </div>
      </motion.div>

      {/* Progress to Next Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Kolejna odznaka
          </h3>
          <div className="text-2xl">🏆</div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              {currentUser?.points || 0} / {nextBadgePoints} punktów
            </span>
            <span>
              {Math.round(((currentUser?.points || 0) / nextBadgePoints) * 100)}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  ((currentUser?.points || 0) / nextBadgePoints) * 100,
                  100,
                )}%`,
              }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Jeszcze {Math.max(0, nextBadgePoints - (currentUser?.points || 0))}{" "}
          punktów do odznaki "{nextBadge?.name || "następnej odznaki"}"!
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-lg text-center"
        >
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-2xl font-bold text-gray-800">{weeklyProgress}%</p>
          <p className="text-sm text-gray-600">Tygodniowy cel</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-lg text-center"
        >
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-2xl font-bold text-gray-800">
            {currentUser?.badges?.length || 0}
          </p>
          <p className="text-sm text-gray-600">Zdobyte odznaki</p>
        </motion.div>
      </div>

      {/* Recent Class Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Aktywność klasy
          </h3>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-gray-600">Brak aktywności w klasie</p>
              <p className="text-sm text-gray-400 mt-2">
                Zachęć uczniów do zgłaszania działań eco!
              </p>
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-50 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {activity.userName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.userName}
                    </p>
                    <p className="text-xs text-gray-600">{activity.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    +{activity.points} pkt
                  </p>
                  <p className="text-xs text-gray-400">
                    {activity.reviewedAt
                      ? new Date(activity.reviewedAt).toLocaleDateString(
                          "pl-PL",
                        )
                      : new Date(activity.submittedAt).toLocaleDateString(
                          "pl-PL",
                        )}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Current Weekly Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Wyzwanie tygodnia</h3>
          <div className="text-2xl">⚡</div>
        </div>
        <h4 className="text-xl font-bold mb-2">Tydzień bez plastiku</h4>
        <p className="text-blue-100 mb-4">
          Unikaj jednorazowych przedmiotów plastikowych przez cały tydzień
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm">Bonus: +50 punktów</span>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Pozostało 3 dni
          </span>
        </div>
      </motion.div>
    </div>
  );
};
