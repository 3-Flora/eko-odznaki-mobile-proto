# Eko Odznaki - Mobile Prototype

Aplikacja mobilna do zdobywania odznak ekologicznych. Projekt zbudowany na Vite + React + TypeScript z integracją Firebase.

## 🚀 Funkcjonalności

- **System autoryzacji** - Rejestracja i logowanie użytkowników
- **Dashboard** - Główny panel użytkownika
- **Wyzwania ekologiczne** - Przeglądanie dostępnych wyzwań
- **Przesyłanie aktywności** - Dodawanie wykonanych działań ekologicznych
- **Ranking** - Porównanie wyników z innymi użytkownikami
- **Profil użytkownika** - Zarządzanie kontem i zdobytymi odznakami

## 🛠️ Technologie

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router DOM
- **Animacje**: Framer Motion
- **Ikony**: Lucide React
- **Backend**: Firebase (Authentication, Firestore)
- **Linting**: ESLint

## 📋 Wymagania

- Node.js (wersja 18 lub wyższa)
- npm lub yarn
- Konto Firebase (dla konfiguracji backendu)

## 🚀 Instalacja i uruchomienie

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/3-Flora/eko-odznaki-mobile-proto.git
cd eko-odznaki-mobile-proto
```

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Konfiguracja Firebase

Utwórz plik `.env` w głównym katalogu projektu i dodaj swoje dane konfiguracyjne Firebase:

```env
VITE_FIREBASE_API_KEY=twoj_api_key
VITE_FIREBASE_AUTH_DOMAIN=twoj_auth_domain
VITE_FIREBASE_PROJECT_ID=twoj_project_id
VITE_FIREBASE_STORAGE_BUCKET=twoj_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=twoj_messaging_sender_id
VITE_FIREBASE_APP_ID=twoj_app_id
```

### 4. Uruchom projekt w trybie deweloperskim

```bash
npm run dev
```

Aplikacja zostanie uruchomiona na `http://localhost:5173`

## 📱 Dostęp z urządzeń mobilnych

Dzięki flagze `--host` w skrypcie `dev`, aplikacja jest dostępna również z innych urządzeń w tej samej sieci lokalnej. Po uruchomieniu sprawdź adres IP w konsoli.

## 🔧 Dostępne komendy

| Komenda           | Opis                                 |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Uruchomienie serwera deweloperskiego |
| `npm run build`   | Zbudowanie aplikacji do produkcji    |
| `npm run preview` | Podgląd zbudowanej aplikacji         |
| `npm run lint`    | Sprawdzenie kodu z ESLint            |

## 📁 Struktura projektu

```text
src/
├── components/          # Komponenty wielokrotnego użytku
│   ├── layout/         # Komponenty layoutu (Navbar, BottomNav)
│   └── modal/          # Komponenty modalne
├── contexts/           # Konteksty React (AuthContext)
├── pages/              # Strony aplikacji
│   ├── activities/     # Strona przesyłania aktywności
│   ├── auth/          # Strona autoryzacji
│   ├── challenges/    # Strona wyzwań
│   ├── dashboard/     # Główna strona
│   ├── profile/       # Profil użytkownika
│   └── ranking/       # Ranking użytkowników
├── config/            # Konfiguracje (Firebase)
├── data/              # Dane statyczne
├── types/             # Definicje typów TypeScript
└── App.tsx            # Główny komponent aplikacji
```

## 🔒 Bezpieczeństwo

- Nie commituj plików `.env` do repozytorium
- Używaj zmiennych środowiskowych dla kluczowych danych konfiguracyjnych
- Skonfiguruj odpowiednie reguły bezpieczeństwa w Firebase

## 🤝 Rozwój

1. Utwórz branch dla nowej funkcjonalności
2. Wprowadź zmiany zgodnie z konwencjami projektu
3. Uruchom `npm run lint` przed commitem
4. Utwórz Pull Request

---

Zbudowano z ❤️ używając Vite i React
