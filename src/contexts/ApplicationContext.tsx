import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ApplicationData {
  loanAmount: number;
  loanPurpose: string;
  loanTerm: string;
  employmentStatus: string;
  monthlyIncome: number;
  savingsRatio: string;
  incomeStability: string;
  missedPayments: string;
  debtToIncomeRatio: string;
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
    // ========================================
    // EXACT FORMULA FROM SPECIFICATION:
    // CLI = 100 × (0.10×L + 0.10×P + 0.10×T + 0.15×E + 0.15×I + 0.10×S + 0.10×ST + 0.15×M + 0.05×D)
    // ========================================

    // 1. Requested Loan Amount (L) - normalized 0-1 (10% weight)
    const L_norm = Math.min(data.loanAmount / 50000, 1.0); // Normalize: $50k+ = 1.0

    // 2. Loan Purpose (P) - categorical 0-1 (10% weight)
    const P_norm = 
      data.loanPurpose === "debt" ? 0.90 :
      data.loanPurpose === "home" ? 0.85 :
      data.loanPurpose === "education" ? 0.80 :
      data.loanPurpose === "business" ? 0.75 :
      data.loanPurpose === "medical" ? 0.70 :
      0.60; // emergency/other

    // 3. Term (T) - normalized 0-1 (10% weight)
    const termMonths = parseInt(data.loanTerm) || 12;
    const T_norm = Math.min(termMonths / 36, 1.0); // Normalize: 36mo+ = 1.0

    // 4. Employment Status (E) - categorical 0-1 (15% weight)
    const E = 
      data.employmentStatus === "fulltime" ? 1.00 :
      data.employmentStatus === "selfemployed" ? 0.85 :
      data.employmentStatus === "parttime" ? 0.70 :
      data.employmentStatus === "student" ? 0.50 :
      0.30; // unemployed

    // 5. Monthly Income (I) - normalized 0-1 (15% weight)
    const I_norm = Math.min(data.monthlyIncome / 15000, 1.0); // Normalize: $15k+ = 1.0

    // 6. Percent Saved (S) - categorical 0-1 (10% weight)
    const S = 
      data.savingsRatio === "50+" ? 1.00 :
      data.savingsRatio === "25-50" ? 0.85 :
      data.savingsRatio === "10-25" ? 0.70 :
      0.50; // 0-10%

    // 7. Income Stability (ST) - categorical 0-1 (10% weight)
    const ST = 
      data.incomeStability === "consistent" ? 1.00 :
      data.incomeStability === "fluctuation" ? 0.70 :
      0.40; // variable

    // 8. Missed Payments (M) - categorical 0-1 INVERSE (15% weight)
    const M_norm = 
      data.missedPayments === "0" ? 1.00 :
      data.missedPayments === "1-2" ? 0.70 :
      data.missedPayments === "3-5" ? 0.40 :
      0.10; // 6+

    // 9. Debt-to-Income Ratio (D) - categorical 0-1 INVERSE (5% weight)
    const D = 
      data.debtToIncomeRatio === "0-20" ? 1.00 :
      data.debtToIncomeRatio === "21-40" ? 0.80 :
      data.debtToIncomeRatio === "41-60" ? 0.50 :
      0.20; // 61+%

    // Calculate CLI using exact formula
    const CLI = 100 * (
      0.10 * L_norm +
      0.10 * P_norm +
      0.10 * T_norm +
      0.15 * E +
      0.15 * I_norm +
      0.10 * S +
      0.10 * ST +
      0.15 * M_norm +
      0.05 * D
    );

    const credibilityScore = Math.round(CLI);

    // Calculate individual metric scores for display
    const calculatedMetrics: CalculatedMetrics = {
      credibilityScore,
      incomeStability: ST,
      employmentTenure: E,
      debtToIncome: D,
      paymentHistory: M_norm,
      financialBehavior: S,
    };

    console.log("CLI Calculation Breakdown:", {
      L_norm: L_norm.toFixed(2),
      P_norm: P_norm.toFixed(2),
      T_norm: T_norm.toFixed(2),
      E: E.toFixed(2),
      I_norm: I_norm.toFixed(2),
      S: S.toFixed(2),
      ST: ST.toFixed(2),
      M_norm: M_norm.toFixed(2),
      D: D.toFixed(2),
      CLI: credibilityScore
    });

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

