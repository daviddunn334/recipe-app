import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./supabase";

import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import Footer from "./components/Footer";

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

// Calculators
import AbsEsCalculator from "./components/AbsEsCalculator";
import TimeClockCalculator from "./components/TimeClockCalculator";
import PitDepthCalculator from "./components/PitDepthCalculator";

// Auth Pages
import Login from "./components/Login";
import Signup from "./components/Signup";

const isDevelopment = import.meta.env.MODE === "development"; // Check if in development mode

function App() {
  const [session, setSession] = useState(isDevelopment ? { user: { id: "dev-user" } } : null);

  useEffect(() => {
    if (!isDevelopment) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }
  }, []);

  return (
    <Router>
      {session && <TopNav />}
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          {session && <Sidebar />}
          <main className="flex-1 p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes (Require Authentication) */}
              <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/projectsanddigs" element={session ? <ProjectsAndDigs /> : <Navigate to="/login" />} />
              <Route path="/reporting" element={session ? <Reporting /> : <Navigate to="/login" />} />
              
              <Route path="/calculations" element={session ? <Calculations /> : <Navigate to="/login" />} />
              <Route path="/newdig" element={session ? <NewDig /> : <Navigate to="/login" />} />
              <Route path="/companydirectory" element={session ? <CompanyDirectory /> : <Navigate to="/login" />} />
              <Route path="/reporting/dig/:id" element={<DigDetails />} /> {/* Add this route */}
              <Route path="/reporting/edit/:id" element={<EditDig />} />

              
              
              {/* Individual Calculators */}
              <Route path="/calculations/abs-es" element={session ? <AbsEsCalculator /> : <Navigate to="/login" />} />
              <Route path="/calculations/timeclockcalculator" element={session ? <TimeClockCalculator /> : <Navigate to="/login" />} />
              <Route path="/calculations/pitdepthcalculator" element={session ? <PitDepthCalculator /> : <Navigate to="/login" />} />
              
              <Route path="/inventory" element={session ? <Inventory /> : <Navigate to="/login" />} />
              <Route path="/timesheets" element={session ? <TimeSheets /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
        {session && <Footer />}
      </div>
    </Router>
  );
}

export default App;
