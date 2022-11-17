// React
import { useEffect } from 'react';

// React Router
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Layouts
import PageLayout from './components/LayoutContainer/MainLayout';
import DashboardLayout from './components/LayoutContainer/DashboardLayout';
import AuthLayout from './components/LayoutContainer/AuthLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Reset from './pages/Auth/Reset';

// Main Pages
import Home from './pages/Main/Home';
import Garages from './pages/Main/Garages';
import Garage from './pages/Main/Garage';
import Item from './pages/Main/Item';

// Dashboard Pages
import DashboardHome from './pages/Dashboard/Home';
import Account from './pages/Dashboard/Account';
import DashboardGarage from './pages/Dashboard/Garage';
import DashboardItems from './pages/Dashboard/Items';
import NewItem from './pages/Dashboard/New-Item';
import Upgrade from './pages/Dashboard/Upgrade';
import Favorites from './pages/Dashboard/Favorites';

// Admin Pages
import AdminHome from './pages/Dashboard/Admin/Home';
import Database from './pages/Dashboard/Admin/Database';
import AdminAnalytics from './pages/Dashboard/Admin/Analytics';

// Context
import {
  AppControllerProvider,
  AuthControllerProvider,
  useAuthController,
  login,
  setProfile,
  setLocked,
  setAdmin,
} from './context';

// Firebase
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { toast } from 'react-toastify';

function RoutesList() {
  const [authController, authDispatch] = useAuthController();
  const { user, admin, locked } = authController;

  // Get user profile from database
  const getProfile = async (UID) => {
    const docRef = doc(db, 'profile', UID);
    const docSnap = await getDoc(docRef);

    // If user profile exist, return data. If not then create a new document
    if (docSnap.exists()) {
      const profile = docSnap.data();
      if (profile.locked) {
        toast.error("Account is locked, limited functionalities available");
        setLocked(authDispatch, true);
      }
      return profile;
    } else {
      // Create user profile document
      const profileRef = collection(db, 'profile');
      await setDoc(doc(profileRef, UID), {
        UID,
        role: 'User',
        admin: false,
        locked: false,
        dt: serverTimestamp(),
      });

      return {
        UID,
        role: 'User',
        admin: false,
        locked: false,
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userObserver) => {
      if (userObserver && !user) {
        getProfile(userObserver.uid).then((r) => {
          login(authDispatch, userObserver);
          setProfile(authDispatch, r);
          setAdmin(authDispatch, r.admin);
        });
      }
      return () => unsubscribe();
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Routes>
      <Route
        path="home"
        element={
          <PageLayout>
            <Home />
          </PageLayout>
        }
      />
      <Route
        path="garages"
        element={
          <PageLayout>
            <Garages />
          </PageLayout>
        }
      />
      <Route
        path="garage"
        element={
          <PageLayout>
            <Garage />
          </PageLayout>
        }
      />
      <Route
        path="item"
        element={
          <PageLayout>
            <Item />
          </PageLayout>
        }
      />
      {!user && (
        <Route path="auth/*">
          <Route
            path="login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="reset"
            element={
              <AuthLayout>
                <Reset />
              </AuthLayout>
            }
          />
          <Route path="*" element={<Navigate replace to="/auth/login" />} />
        </Route>
      )}
      {user && !locked && (
        <Route path="dashboard/*">
          <Route
            path="home"
            element={
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            }
          />
          <Route
            path="account"
            element={
              <DashboardLayout>
                <Account />
              </DashboardLayout>
            }
          />
          <Route
            path="garage"
            element={
              <DashboardLayout>
                <DashboardGarage />
              </DashboardLayout>
            }
          />
          <Route
            path="favorites"
            element={
              <DashboardLayout>
                <Favorites />
              </DashboardLayout>
            }
          />
          <Route
            path="items"
            element={
              <DashboardLayout>
                <DashboardItems />
              </DashboardLayout>
            }
          />
          <Route
            path="new-item"
            element={
              <DashboardLayout>
                <NewItem />
              </DashboardLayout>
            }
          />
          <Route
            path="upgrade"
            element={
              <DashboardLayout>
                <Upgrade />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<Navigate replace to="/dashboard/home" />} />
        </Route>
      )}
      {user && admin && (
        <Route path="admin/*">
          <Route
            path="home"
            element={
              <DashboardLayout>
                <AdminHome />
              </DashboardLayout>
            }
          />
          <Route
            path="database"
            element={
              <DashboardLayout>
                <Database />
              </DashboardLayout>
            }
          />
          <Route
            path="analytics"
            element={
              <DashboardLayout>
                <AdminAnalytics />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<Navigate replace to="/admin/home" />} />
        </Route>
      )}
      <Route path="*" element={<Navigate replace to="/home" />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AppControllerProvider>
        <AuthControllerProvider>
          <RoutesList />
          <Outlet />
        </AuthControllerProvider>
      </AppControllerProvider>
    </div>
  );
}

export default App;
