import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import TopNav from "./components/TopNav";
import Profile from "./components/Profile";
import ProjectsAndDigs from "./components/ProjectsAndDigs";
import Reporting from "./components/Reporting";
import Calculations from "./components/Calculations";
import Inventory from "./components/Inventory";
import TimeSheets from "./components/TimeSheets";


function App() {
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
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/timesheets" element={<TimeSheets />} />

            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
