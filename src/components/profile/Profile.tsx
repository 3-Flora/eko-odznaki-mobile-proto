import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Trophy, Star, Calendar, School, Users } from "lucide-react";
import { motion } from "framer-motion";
import { availableBadges } from "../../data/badges";

export const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  const earnedBadges = availableBadges.filter(
    (badge) => (currentUser?.points || 0) >= badge.pointsRequired,
  );

  const stats = [
    {
      label: "Punkty",
      value: currentUser?.points || 0,
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      label: "Odznaki",
      value: earnedBadges.length,
      icon: Star,
      color: "text-purple-600",
    },
    {
      label: "Dni aktywności",
      value: 15,
      icon: Calendar,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-6 text-white text-center"
      >
        <div className="relative inline-block mb-4">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          ) : (
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white">
              <span className="text-3xl font-bold">
                {currentUser?.displayName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2">
            <Trophy className="w-6 h-6 text-yellow-800" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">{currentUser?.displayName}</h1>
        <p className="text-green-100 mb-2">
          {currentUser?.role === "teacher" ? "Nauczyciel" : "Uczeń"}
        </p>

        <div className="flex items-center justify-center space-x-4 mt-4">
          <div className="flex items-center">
            <School className="w-4 h-4 mr-1" />
            <span className="text-sm">{currentUser?.school}</span>
          </div>
          {currentUser?.className && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">Klasa {currentUser?.className}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg text-center"
          >
            <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Twoje odznaki</h2>

        {earnedBadges.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-gray-600">Zdobądź pierwszą odznakę!</p>
            <p className="text-sm text-gray-400 mt-2">
              Zgłaszaj działania eco, aby zdobywać punkty i odznaki
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`${badge.color} rounded-xl p-4 text-white text-center`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                <p className="text-xs opacity-90">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Available Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Odznaki do zdobycia
        </h2>

        <div className="space-y-3">
          {availableBadges
            .filter(
              (badge) => (currentUser?.points || 0) < badge.pointsRequired,
            )
            .map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center p-4 bg-gray-50 rounded-xl"
              >
                <div className="text-2xl mr-4 opacity-50">{badge.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>
                        {currentUser?.points || 0} / {badge.pointsRequired} pkt
                      </span>
                      <span>
                        {Math.round(
                          ((currentUser?.points || 0) / badge.pointsRequired) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(((currentUser?.points || 0) / badge.pointsRequired) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};
