import { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  employer: string;
  position: string;
  startDate: string;
}

export interface LoanApplication {
  credibilityIndex: number;
  approvedAmount: number;
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  term: number;
  requestedAmount: number;
  appliedDate: string;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  loanApplication: LoanApplication | null;
  updateLoanApplication: (application: LoanApplication) => void;
}

const defaultProfile: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, City, ST 12345",
  employer: "Tech Company Inc.",
  position: "Software Engineer",
  startDate: "January 2022"
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loanApplication, setLoanApplication] = useState<LoanApplication | null>(null);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const updateLoanApplication = (application: LoanApplication) => {
    setLoanApplication(application);
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, loanApplication, updateLoanApplication }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
