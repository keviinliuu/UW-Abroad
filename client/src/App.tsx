import { useEffect, useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfilesList from "./components/ProfilesList.tsx";
import ProfileView from "./components/ProfileView.tsx";
import CreateProfile from "./components/CreateProfile.tsx";
import EditProfile from "./components/EditProfile.tsx";
import Search from "./components/Search.tsx";
import UniversityView from "./components/UniversityView.tsx";
import CourseView from "./components/CourseView.tsx";
import Home from "./components/Home.tsx";
import { api } from "./api";

type View =
  | { name: "home" }
  | { name: "list" }
  | { name: "create" }
  | { name: "edit" }
  | { name: "profile"; id: number }
  | { name: "search" }
  | { name: "university"; id: number }
  | { name: "course"; id: number }
  | { name: "login" }
  | { name: "signup" };

function MainApp() {
  const { user, logout, isLoading } = useAuth();
  const [view, setView] = useState<View>({ name: "home" });
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [userProfileId, setUserProfileId] = useState<number | null>(null);
  const [profileBackView, setProfileBackView] = useState<"list" | "search" | null>(null);

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

  // Redirect from login/signup views after successful login
  useEffect(() => {
    if (user && (view.name === "login" || view.name === "signup")) {
      setView({ name: "home" });
    }
  }, [user, view.name]);

  // If unauthenticated on protected views, send home
  useEffect(() => {
    if (!user && (view.name === "create" || view.name === "edit")) {
      setView({ name: "home" });
    }
  }, [user, view.name]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
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
        <h1
          className="text-2xl font-semibold cursor-pointer hover:text-sky-600 transition-colors"
          onClick={() => setView({ name: "home" })}
        >
          UW Abroad
        </h1>
        <nav className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </span>
              <button
                className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                onClick={() => setView({ name: "search" })}
              >
                Search
              </button>
              <button
                className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
                onClick={() => setView({ name: "list" })}
              >
                Browse Profiles
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
                onClick={() => {
                  logout();
                  setView({ name: "home" });
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                onClick={() => setView({ name: "search" })}
              >
                Search
              </button>
              <button
                className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
                onClick={() => setView({ name: "list" })}
              >
                Browse Profiles
              </button>
              <button
                className="px-3 py-1 rounded border border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100"
                onClick={() => setView({ name: "login" })}
              >
                Login
              </button>
              <button
                className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                onClick={() => setView({ name: "signup" })}
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        {view.name === "home" && (
          <Home
            onNavigate={(viewName: string) => {
              if (viewName === "search") setView({ name: "search" });
              else if (viewName === "list") setView({ name: "list" });
              else if (viewName === "signup") setView({ name: "signup" });
              else if (viewName === "login") setView({ name: "login" });
            }}
          />
        )}

        {view.name === "login" && (
          <Login onShowSignup={() => setView({ name: "signup" })} />
        )}

        {view.name === "signup" && (
          <Signup onShowLogin={() => setView({ name: "login" })} />
        )}

        {view.name === "search" && (
          <Search
            onViewProfile={(id) => {
              setProfileBackView("search");
              setView({ name: "profile", id });
            }}
            onViewUniversity={(id) => setView({ name: "university", id })}
            onViewCourse={(id) => setView({ name: "course", id })}
          />
        )}

        {view.name === "list" && (
          <ProfilesList
            onOpenProfile={(id) => {
              setProfileBackView("list");
              setView({ name: "profile", id });
            }}
          />
        )}

        {view.name === "create" && user && (
          <CreateProfile onCreated={handleProfileCreated} />
        )}

        {view.name === "edit" && user && (
          <EditProfile
            onUpdated={handleProfileUpdated}
            onCancel={() => setView({ name: "list" })}
          />
        )}

        {view.name === "profile" && (
          <ProfileView
            id={view.id}
            onBack={() => {
              if (profileBackView === "list") {
                setView({ name: "list" });
              } else {
                setView({ name: "search" });
              }
            }}
            isOwnProfile={view.id === userProfileId}
            onEdit={() => setView({ name: "edit" })}
          />
        )}

        {view.name === "university" && (
          <UniversityView
            id={view.id}
            onBack={() => setView({ name: "search" })}
            onViewCourse={(id) => setView({ name: "course", id })}
            onRequestLogin={() => setView({ name: "login" })}
          />
        )}

        {view.name === "course" && (
          <CourseView
            id={view.id}
            onBack={() => setView({ name: "search" })}
            onViewUniversity={(id) => setView({ name: "university", id })}
            onRequestLogin={() => setView({ name: "login" })}
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
