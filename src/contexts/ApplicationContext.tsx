import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ApplicationData {
  loanAmount: number;
  monthlyIncome: number;
  debtToIncomeRatio: string;
  employmentStatus: string;
  savingsRatio: string;
  incomeStability: string;
  missedPayments: string;
  submittedAt: Date | null;
}

export interface CalculatedMetrics {
  credibilityScore: number;
  incomeStability: number;
  employmentTenure: number;
  debtToIncome: number;
  paymentHistory: number;
  financialBehavior: number;
}

interface ApplicationContextType {
  application: ApplicationData | null;
  metrics: CalculatedMetrics | null;
  setApplicationData: (data: ApplicationData) => void;
  calculateMetrics: (data: ApplicationData) => CalculatedMetrics;
}

const defaultMetrics: CalculatedMetrics = {
  credibilityScore: 82,
  incomeStability: 0.87,
  employmentTenure: 0.72,
  debtToIncome: 0.65,
  paymentHistory: 0.93,
  financialBehavior: 0.80,
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [metrics, setMetrics] = useState<CalculatedMetrics | null>(defaultMetrics);

  const calculateMetrics = (data: ApplicationData): CalculatedMetrics => {
    // Income Stability Score
    const incomeStabilityScore = 
      data.incomeStability === "consistent" ? 0.95 :
      data.incomeStability === "fluctuation" ? 0.70 :
      0.45;

    // Employment Tenure (estimated from employment status)
    const employmentTenureScore = 
      data.employmentStatus === "fulltime" ? 0.85 :
      data.employmentStatus === "selfemployed" ? 0.70 :
      data.employmentStatus === "parttime" ? 0.60 :
      data.employmentStatus === "student" ? 0.50 :
      0.30;

    // Debt-to-Income Score (inverse - lower is better)
    const dtiScore = 
      data.debtToIncomeRatio === "0-20" ? 0.95 :
      data.debtToIncomeRatio === "21-40" ? 0.75 :
      data.debtToIncomeRatio === "41-60" ? 0.50 :
      0.25;

    // Payment History Score
    const paymentHistoryScore = 
      data.missedPayments === "0" ? 1.00 :
      data.missedPayments === "1-2" ? 0.75 :
      data.missedPayments === "3-5" ? 0.50 :
      0.25;

    // Financial Behavior (based on savings ratio)
    const financialBehaviorScore = 
      data.savingsRatio === "50+" ? 1.00 :
      data.savingsRatio === "25-50" ? 0.85 :
      data.savingsRatio === "10-25" ? 0.65 :
      0.40;

    // Calculate overall credibility score (weighted average)
    const credibilityScore = Math.round(
      (incomeStabilityScore * 0.25 +
       employmentTenureScore * 0.20 +
       dtiScore * 0.25 +
       paymentHistoryScore * 0.20 +
       financialBehaviorScore * 0.10) * 100
    );

    const calculatedMetrics: CalculatedMetrics = {
      credibilityScore,
      incomeStability: incomeStabilityScore,
      employmentTenure: employmentTenureScore,
      debtToIncome: dtiScore,
      paymentHistory: paymentHistoryScore,
      financialBehavior: financialBehaviorScore,
    };

    return calculatedMetrics;
  };

  const setApplicationData = (data: ApplicationData) => {
    setApplication(data);
    const calculatedMetrics = calculateMetrics(data);
    setMetrics(calculatedMetrics);
  };

  return (
    <ApplicationContext.Provider value={{ application, metrics, setApplicationData, calculateMetrics }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error("useApplication must be used within an ApplicationProvider");
  }
  return context;
}

