import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { initializeCompanies } from "./utils/initializeCompanies";
import { useEffect } from "react";

import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import Footer from "./components/Footer";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ProjectsAndDigs from "./components/ProjectsAndDigs";
import Reporting from "./components/Reporting";
import Calculations from "./components/Calculations";
import Inventory from "./components/Inventory";
import TimeSheets from "./components/TimeSheets";
import NewDig from "./components/NewDig";
import CompanyDirectory from "./components/CompanyDirectory";
import DigDetails from "./components/DigDetails";
import EditDig from "./components/EditDig";
import CompanyDetails from "./components/CompanyDetails";

// Calculators
import AbsEsCalculator from "./components/AbsEsCalculator";
import TimeClockCalculator from "./components/TimeClockCalculator";
import PitDepthCalculator from "./components/PitDepthCalculator";

function AppContent() {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize companies data
    initializeCompanies().catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {user && <TopNav />}
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/projectsanddigs" element={
              <ProtectedRoute>
                <ProjectsAndDigs />
              </ProtectedRoute>
            } />
            <Route path="/reporting" element={
              <ProtectedRoute>
                <Reporting />
              </ProtectedRoute>
            } />
            <Route path="/calculations" element={
              <ProtectedRoute>
                <Calculations />
              </ProtectedRoute>
            } />
            <Route path="/newdig" element={
              <ProtectedRoute>
                <NewDig />
              </ProtectedRoute>
            } />
            <Route path="/companydirectory" element={
              <ProtectedRoute>
                <CompanyDirectory />
              </ProtectedRoute>
            } />
            <Route path="/reporting/dig/:id" element={
              <ProtectedRoute>
                <DigDetails />
              </ProtectedRoute>
            } />
            <Route path="/reporting/edit/:id" element={
              <ProtectedRoute>
                <EditDig />
              </ProtectedRoute>
            } />
            <Route path="/calculations/abs-es" element={
              <ProtectedRoute>
                <AbsEsCalculator />
              </ProtectedRoute>
            } />
            <Route path="/calculations/timeclockcalculator" element={
              <ProtectedRoute>
                <TimeClockCalculator />
              </ProtectedRoute>
            } />
            <Route path="/calculations/pitdepthcalculator" element={
              <ProtectedRoute>
                <PitDepthCalculator />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/timesheets" element={
              <ProtectedRoute>
                <TimeSheets />
              </ProtectedRoute>
            } />
            <Route path="/company/:companyId" element={
              <ProtectedRoute>
                <CompanyDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
      {user && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
