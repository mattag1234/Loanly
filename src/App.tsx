import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { DashboardPage } from "./components/DashboardPage";
import { ApplyPage } from "./components/ApplyPage";
import { InsightsPage } from "./components/InsightsPage";
import { CrediBotPage } from "./components/CrediBotPage";
import { ProfilePage } from "./components/ProfilePage";
import { LoanOfferDetailsPage } from "./components/LoanOfferDetailsPage";
import { Toaster } from "sonner";
import { UserProvider } from "./contexts/UserContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";

export default function App() {
  const [currentTab, setCurrentTab] = useState("Dashboard");

  const renderContent = () => {
    switch (currentTab) {
      case "Dashboard":
        return <DashboardPage onNavigateToLoanOffer={() => setCurrentTab("Loan Offer")} />;
      case "Apply":
        return <ApplyPage onNavigateToDashboard={() => setCurrentTab("Dashboard")} />;
      case "Insights":
        return <InsightsPage />;
      case "Mr. LoanLy":
        return <CrediBotPage />;
      case "Profile":
        return <ProfilePage />;
      case "Loan Offer":
        return <LoanOfferDetailsPage onBack={() => setCurrentTab("Dashboard")} />;
      default:
        return <DashboardPage onNavigateToLoanOffer={() => setCurrentTab("Loan Offer")} />;
    }
  };

  return (
    <UserProvider>
      <ApplicationProvider>
        <div className="min-h-screen bg-background-light">
          <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {renderContent()}
          </main>

          <Footer />
          <Toaster position="top-right" richColors />
        </div>
      </ApplicationProvider>
    </UserProvider>
  );
}
