import { useEffect, useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfilesList from "./components/ProfilesList.tsx";
import ProfileView from "./components/ProfileView.tsx";
import CreateProfile from "./components/CreateProfile.tsx";
import EditProfile from "./components/EditProfile.tsx";
import { api } from "./api";

type View =
  | { name: "list" }
  | { name: "create" }
  | { name: "edit" }
  | { name: "profile"; id: number };

type AuthView = "login" | "signup";

function MainApp() {
  const { user, logout, isLoading } = useAuth();
  const [view, setView] = useState<View>({ name: "list" });
  const [authView, setAuthView] = useState<AuthView>("login");
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [userProfileId, setUserProfileId] = useState<number | null>(null);

  useEffect(() => {
    document.title = "UW Abroad";
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        try {
          const profile = await api<any>("/profiles/me");
          setHasProfile(true);
          setUserProfileId(profile.id);
        } catch (err) {
          setHasProfile(false);
          setUserProfileId(null);
        }
      }
    };
    checkProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return authView === "login" ? (
      <Login onShowSignup={() => setAuthView("signup")} />
    ) : (
      <Signup onShowLogin={() => setAuthView("login")} />
    );
  }

  const handleProfileCreated = (id: number) => {
    setHasProfile(true);
    setUserProfileId(id);
    setView({ name: "profile", id });
  };

  const handleProfileUpdated = (id: number) => {
    setView({ name: "profile", id });
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="text-2xl font-semibold">UW Abroad</h1>
        <nav className="flex gap-3 items-center">
          <span className="text-sm text-gray-600">
            {user.firstName} {user.lastName}
          </span>
          <button
            className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
            onClick={() => setView({ name: "list" })}
          >
            Browse
          </button>
          {hasProfile ? (
            <>
              <button
                className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
                onClick={() =>
                  userProfileId &&
                  setView({ name: "profile", id: userProfileId })
                }
              >
                My Profile
              </button>
            </>
          ) : (
            <button
              className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
              onClick={() => setView({ name: "create" })}
            >
              Create Profile
            </button>
          )}
          <button
            className="px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="main">
        {view.name === "list" && (
          <ProfilesList
            onOpenProfile={(id) => setView({ name: "profile", id })}
          />
        )}

        {view.name === "create" && (
          <CreateProfile onCreated={handleProfileCreated} />
        )}

        {view.name === "edit" && (
          <EditProfile
            onUpdated={handleProfileUpdated}
            onCancel={() => setView({ name: "list" })}
          />
        )}

        {view.name === "profile" && (
          <ProfileView
            id={view.id}
            onBack={() => setView({ name: "list" })}
            isOwnProfile={view.id === userProfileId}
            onEdit={() => setView({ name: "edit" })}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
