import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import SymptomsPage from "./pages/SymptomsPage";
import CycleHistoryPage from "./pages/CycleHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import CycleSetupPage from "./pages/CycleSetupPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<AuthRedirect />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/symptoms" element={<SymptomsPage />} />
            <Route path="/cycle-history" element={<CycleHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cycle-setup" element={<CycleSetupPage />} />
          </Route>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
