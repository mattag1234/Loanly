import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "../contexts/UserContext";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ currentTab, onTabChange }: NavbarProps) {
  const { profile } = useUser();
  const tabs = ["Dashboard", "Apply", "Insights", "Mr. LoanLy", "Profile"];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <img src="/logo.png" alt="LoanLy Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl text-primary">LoanLy</span>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-1 pt-1 pb-1 transition-colors ${currentTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Profile Avatar */}
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`} />
              <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
