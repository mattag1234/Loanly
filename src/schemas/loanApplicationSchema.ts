import { z } from "zod";

/**
 * Loan Application Form Validation Schema
 * Uses Zod for runtime validation and type inference
 */

export const loanApplicationSchema = z.object({
  // Loan Details
  loanAmount: z
    .string()
    .min(1, "Loan amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num);
    }, "Loan amount must be a valid number")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 1000;
    }, "Loan amount must be at least $1,000")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 1000000;
    }, "Loan amount cannot exceed $1,000,000"),

  loanPurpose: z
    .string({ message: "Loan purpose is required" })
    .min(1, "Please select a loan purpose"),

  loanTerm: z
    .string()
    .min(1, "Loan term is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num);
    }, "Loan term must be a valid number")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 6;
    }, "Loan term must be at least 6 months")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 360;
    }, "Loan term cannot exceed 360 months"),

  // Personal Information
  firstName: z
    .string({ message: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string({ message: "Last name is required" })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  email: z
    .string({ message: "Email is required" })
    .email("Please enter a valid email address"),

  phone: z
    .string({ message: "Phone number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),

  // Employment Information
  employmentStatus: z
    .string({ message: "Employment status is required" })
    .min(1, "Please select your employment status"),

  employer: z
    .string({ message: "Employer name is required" })
    .min(2, "Employer name must be at least 2 characters")
    .max(100, "Employer name cannot exceed 100 characters"),

  annualIncome: z
    .string()
    .min(1, "Annual income is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num);
    }, "Annual income must be a valid number")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0;
    }, "Annual income must be a positive number")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 10000000;
    }, "Annual income seems too high"),

  // Financial Information
  monthlyDebt: z
    .string()
    .min(1, "Monthly debt is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num);
    }, "Monthly debt must be a valid number")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0;
    }, "Monthly debt must be a positive number")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 1000000;
    }, "Monthly debt cannot exceed $1,000,000"),

  creditScore: z
    .string()
    .min(1, "Credit score is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num);
    }, "Credit score must be a valid number")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 300;
    }, "Credit score must be at least 300")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 850;
    }, "Credit score cannot exceed 850"),
});

// Infer TypeScript type from schema - all fields remain as strings
export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

// Default form values - use empty strings for fields that will be transformed to numbers
export const defaultLoanApplicationValues = {
  loanAmount: "",
  loanPurpose: "",
  loanTerm: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employmentStatus: "",
  employer: "",
  annualIncome: "",
  monthlyDebt: "",
  creditScore: "",
};