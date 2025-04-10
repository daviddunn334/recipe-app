import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./supabase";
import { initializeCompanies } from "./utils/initializeCompanies";

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
import CompanyDetails from "./components/CompanyDetails";

// Calculators
import AbsEsCalculator from "./components/AbsEsCalculator";
import TimeClockCalculator from "./components/TimeClockCalculator";
import PitDepthCalculator from "./components/PitDepthCalculator";

function App() {
  // Always set session as truthy to bypass authentication
  const [session, setSession] = useState({ user: { id: "bypass-auth" } });

  useEffect(() => {
    // Initialize companies data
    initializeCompanies().catch(console.error);

    // Optionally, if you still want to handle auth state changes (for future use),
    // you can keep this, but it won't affect the bypassed auth.
    supabase.auth.onAuthStateChange((_event, session) => {
      //setSession(session);
    });
  }, []);

  return (
    <Router>
      <TopNav />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/projectsanddigs" element={<ProjectsAndDigs />} />
              <Route path="/reporting" element={<Reporting />} />
              <Route path="/calculations" element={<Calculations />} />
              <Route path="/newdig" element={<NewDig />} />
              <Route path="/companydirectory" element={<CompanyDirectory />} />
              <Route path="/reporting/dig/:id" element={<DigDetails />} />
              <Route path="/reporting/edit/:id" element={<EditDig />} />
              <Route
                path="/calculations/abs-es"
                element={<AbsEsCalculator />}
              />
              <Route
                path="/calculations/timeclockcalculator"
                element={<TimeClockCalculator />}
              />
              <Route
                path="/calculations/pitdepthcalculator"
                element={<PitDepthCalculator />}
              />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/timesheets" element={<TimeSheets />} />
              <Route path="/company/:companyId" element={<CompanyDetails />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
