import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User, Trophy, Target } from "lucide-react";

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🌱</div>
            <h1 className="text-xl font-bold text-gray-800">EKO-odznaki</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm font-semibold text-green-800">
                {currentUser?.points || 0} pkt
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {currentUser?.displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
