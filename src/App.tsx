import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { DashboardPage } from "./components/DashboardPage";
import { ApplyPage } from "./components/ApplyPage";
import { InsightsPage } from "./components/InsightsPage";
import { CrediBotPage } from "./components/CrediBotPage";
import { ProfilePage } from "./components/ProfilePage";
import { Toaster } from "sonner";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  const [currentTab, setCurrentTab] = useState("Dashboard");

  const renderContent = () => {
    switch (currentTab) {
      case "Dashboard":
        return <DashboardPage />;
      case "Apply":
        return <ApplyPage />;
      case "Insights":
        return <InsightsPage />;
      case "Mr. LoanLy":
        return <CrediBotPage />;
      case "Profile":
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-background-light">
        <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {renderContent()}
        </main>

        <Footer />
        <Toaster position="top-right" richColors />
      </div>
    </UserProvider>
  );
}
