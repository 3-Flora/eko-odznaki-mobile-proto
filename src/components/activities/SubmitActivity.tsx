import React, { useState } from "react";
import { Camera, Upload, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { activityCategories } from "../../data/badges";
import { ActivityCategory } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

export const SubmitActivity: React.FC = () => {
  const { submitActivity } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<
    ActivityCategory | ""
  >("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setLoading(true);
    setError("");

    try {
      // TODO: Upload photo to Firebase Storage if photo exists
      let photoURL: string | undefined;
      if (photo) {
        // For now, we'll use the preview URL - in production you'd upload to Firebase Storage
        photoURL = photoPreview || undefined;
      }

      await submitActivity({
        category: selectedCategory as ActivityCategory,
        title,
        description,
        photoURL,
      });

      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setSelectedCategory("");
        setTitle("");
        setDescription("");
        setPhoto(null);
        setPhotoPreview(null);
      }, 3000);
    } catch (err: unknown) {
      console.error("Error submitting activity:", err);
      setError("Wystąpił błąd podczas wysyłania aktywności. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Wysłano!</h2>
          <p className="text-gray-600 mb-4">
            Twoje działanie zostało przesłane do weryfikacji przez nauczyciela
          </p>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block">
            <CheckCircle className="inline w-4 h-4 mr-1" />
            Oczekuje na zatwierdzenie
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedCategoryData = activityCategories.find(
    (cat) => cat.id === selectedCategory,
  );

  return (
    <div className="p-4 pb-20 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-4xl mb-4">🌍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Dodaj działanie
        </h1>
        <p className="text-gray-600">Podziel się swoimi eko-działaniami!</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Wybierz kategorię
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {activityCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(category.id as ActivityCategory)
                }
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "border-green-500 bg-green-50 scale-105"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium text-gray-800">
                  {category.name}
                </p>
                <p className="text-xs text-gray-600">+{category.points} pkt</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Activity Details */}
        {selectedCategory && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">
                  {selectedCategoryData?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedCategoryData?.name}
                  </h3>
                  <p className="text-sm text-green-600">
                    +{selectedCategoryData?.points} punktów
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tytuł działania
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="np. Przejazd rowerem do szkoły"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis działania
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opisz szczegóły swojego eko-działania..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Photo Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Dodaj zdjęcie (opcjonalne)
              </h3>

              {!photoPreview ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Kliknij, aby dodać zdjęcie
                    </p>
                    <p className="text-sm text-gray-400">PNG, JPG do 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Wyślij działanie
                </>
              )}
            </motion.button>
          </>
        )}
      </form>
    </div>
  );
};
