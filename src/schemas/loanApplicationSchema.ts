import { z } from "zod";

/**
 * Loan Application Form Validation Schema
 * Uses Zod for runtime validation and type inference
 */
export const loanApplicationSchema = z.object({
  // Loan Details
  loanAmount: z
    .number({ required_error: "Loan amount is required" })
    .min(1000, "Loan amount must be at least $1,000")
    .max(1000000, "Loan amount cannot exceed $1,000,000"),

  loanPurpose: z
    .string({ required_error: "Loan purpose is required" })
    .min(1, "Please select a loan purpose"),

  loanTerm: z
    .number({ required_error: "Loan term is required" })
    .min(6, "Loan term must be at least 6 months")
    .max(360, "Loan term cannot exceed 360 months"),

  // Personal Information
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),

  // Employment Information
  employmentStatus: z
    .string({ required_error: "Employment status is required" })
    .min(1, "Please select your employment status"),

  employer: z
    .string({ required_error: "Employer name is required" })
    .min(2, "Employer name must be at least 2 characters")
    .max(100, "Employer name cannot exceed 100 characters"),

  annualIncome: z
    .number({ required_error: "Annual income is required" })
    .min(0, "Annual income must be a positive number")
    .max(10000000, "Annual income seems too high"),

  // Financial Information
  monthlyDebt: z
    .number({ required_error: "Monthly debt is required" })
    .min(0, "Monthly debt must be a positive number")
    .max(1000000, "Monthly debt cannot exceed $1,000,000"),

  creditScore: z
    .number({ required_error: "Credit score is required" })
    .min(300, "Credit score must be at least 300")
    .max(850, "Credit score cannot exceed 850"),
});

// Infer TypeScript type from schema
export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

// Default form values
export const defaultLoanApplicationValues: Partial<LoanApplicationFormData> = {
  loanAmount: undefined,
  loanPurpose: "",
  loanTerm: undefined,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employmentStatus: "",
  employer: "",
  annualIncome: undefined,
  monthlyDebt: undefined,
  creditScore: undefined,
};
