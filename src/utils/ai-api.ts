import { projectId, publicAnonKey } from "./supabase/info";

export interface LoanFormData {
  income: number;
  debt: number;
  creditHistoryYears: number;
  recentInquiries: number;
  employmentStatus?: string;
  savingsRatio?: number;
}

export interface AIAdviceResponse {
  success: boolean;
  output: string;
  usedLetta: boolean;
  error?: string;
}

export async function getAILoanAdvice(
  formData: LoanFormData,
  useLetta: boolean = false
): Promise<AIAdviceResponse> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-39e3d378/loan-advice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...formData,
          useLetta,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get AI advice");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error getting AI loan advice:", error);
    throw error;
  }
}

export async function sendChatMessage(
  message: string,
  context: Partial<LoanFormData>,
  useLetta: boolean = false
): Promise<string> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-39e3d378/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          message,
          context,
          useLetta,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send chat message");
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}
