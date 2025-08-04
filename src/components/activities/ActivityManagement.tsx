import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useActivity } from "../../contexts/ActivityContext";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export const ActivityManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { pendingActivities, approveActivity, rejectActivity, loading } =
    useActivity();
  const [actionLoading, setActionLoading] = useState(false);

  if (currentUser?.role !== "teacher") {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">
          Ta funkcja jest dostępna tylko dla nauczycieli.
        </p>
      </div>
    );
  }

  const handleApprove = async (activityId: string, points: number) => {
    setActionLoading(true);
    try {
      await approveActivity(activityId, points);
    } catch (error) {
      console.error("Error approving activity:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (activityId: string, reason?: string) => {
    setActionLoading(true);
    try {
      await rejectActivity(activityId, reason);
    } catch (error) {
      console.error("Error rejecting activity:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 pb-20 justify-normal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-4xl mb-4">👨‍🏫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Zarządzanie aktywnościami
        </h1>
        <p className="text-gray-600">Zatwierdź lub odrzuć działania uczniów</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-gray-800">
              {pendingActivities.length}
            </p>
            <p className="text-sm text-gray-600">Oczekujące</p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600">Zatwierdzone dziś</p>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-gray-800">
              {pendingActivities.reduce(
                (sum, activity) => sum + activity.points,
                0
              )}
            </p>
            <p className="text-sm text-gray-600">Punkty do przyznania</p>
          </div>
        </div>
      </motion.div>

      {/* Pending Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Oczekujące aktywności
        </h3>

        {pendingActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-gray-600">Brak oczekujących aktywności</p>
            <p className="text-sm text-gray-400 mt-2">
              Wszystkie aktywności zostały sprawdzone!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {activity.userName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>{activity.userName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>
                            {new Date(activity.submittedAt).toLocaleDateString(
                              "pl-PL"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          <span>{activity.points} pkt</span>
                        </div>
                      </div>

                      {activity.photoURL && (
                        <div className="mt-3">
                          <img
                            src={activity.photoURL}
                            alt="Activity photo"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleApprove(activity.id, activity.points)
                      }
                      disabled={actionLoading}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(activity.id)}
                      disabled={actionLoading}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
