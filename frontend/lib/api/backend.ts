/**
 * Backend API Client
 * Handles all communication with the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rag-pdf-ai31.onrender.com";

export interface AdviceRequest {
  category: "buy" | "loan" | "tax" | "big-goal" | "festival" | "reduce-expense" | "invest" | "side-income";
  message: string;
  monthly_income_npr: number;
  monthly_expenses_npr: Record<string, number>;
  current_savings_npr?: number;
  location?: string;
  mode: "simple" | "indepth"; // Required field, must be exactly "simple" or "indepth"
  is_premium?: boolean;
  user_id?: string;
  extra_profile?: Record<string, any>;
}

export interface AdviceResponse {
  response_np: string;
  response_en: string;
  months_needed: number;
  target_amount_npr: number;
  realistic_monthly_savings_npr: number;
  progress_percent: number;
  tips: string[];
  alternatives: Array<{
    name: string;
    price_npr: number;
    months_needed: number;
  }>;
  visualization?: {
    chart_type: string;
    description: string;
    data: Record<string, any>;
  };
  simulation?: Array<{
    month: number;
    total_value: number;
    fd_value: number;
    shares_value: number;
    mutual_funds_value: number;
    gold_value: number;
    company_investment_value?: number;
    startup_value?: number;
  }>;
  is_premium: boolean;
}

export interface FeedbackRequest {
  user_id: string;
  month: string; // Format: "YYYY-MM"
  expenses: Record<string, number>;
}

export interface FeedbackResponse {
  month: string;
  total_expenses: number;
  rights: Array<{
    title: string;
    amount: number;
    description: string;
    solution?: string;
  }>;
  wrongs: Array<{
    title: string;
    amount: number;
    description: string;
    solution?: string;
  }>;
  suggestions: string[];
  is_premium: boolean;
}

/**
 * Convert JSON response to readable text format
 */
export function formatAdviceAsText(data: AdviceResponse): string {
  let text = `${data.response_en}\n\n`;
  
  text += `📊 Summary:\n`;
  text += `- Months Needed: ${data.months_needed}\n`;
  text += `- Target Amount: NPR ${data.target_amount_npr.toLocaleString()}\n`;
  text += `- Monthly Savings: NPR ${data.realistic_monthly_savings_npr.toLocaleString()}\n`;
  text += `- Progress: ${data.progress_percent}%\n\n`;
  
  if (data.tips && data.tips.length > 0) {
    text += `💡 Tips:\n`;
    data.tips.forEach((tip, index) => {
      text += `${index + 1}. ${tip}\n`;
    });
    text += `\n`;
  }
  
  if (data.alternatives && data.alternatives.length > 0) {
    text += `🔄 Alternatives:\n`;
    data.alternatives.forEach((alt) => {
      text += `- ${alt.name}: NPR ${alt.price_npr.toLocaleString()} (${alt.months_needed} months)\n`;
    });
  }
  
  return text;
}

export function formatFeedbackAsText(data: FeedbackResponse): string {
  let text = `📊 Monthly Feedback for ${data.month}\n\n`;
  text += `Total Expenses: NPR ${data.total_expenses.toLocaleString()}\n\n`;
  
  if (data.rights && data.rights.length > 0) {
    text += `✅ What You Did Right:\n`;
    data.rights.forEach((item) => {
      text += `- ${item.title}: NPR ${item.amount.toLocaleString()}\n`;
      text += `  ${item.description}\n`;
      if (item.solution) {
        text += `  💡 ${item.solution}\n`;
      }
      text += `\n`;
    });
  }
  
  if (data.wrongs && data.wrongs.length > 0) {
    text += `❌ What You Did Wrong:\n`;
    data.wrongs.forEach((item) => {
      text += `- ${item.title}: NPR ${item.amount.toLocaleString()} wasted\n`;
      text += `  ${item.description}\n`;
      if (item.solution) {
        text += `  💡 ${item.solution}\n`;
      }
      text += `\n`;
    });
  }
  
  if (data.suggestions && data.suggestions.length > 0) {
    text += `💡 Suggestions:\n`;
    data.suggestions.forEach((suggestion) => {
      text += `- ${suggestion}\n`;
    });
  }
  
  return text;
}

/**
 * Get financial advice from backend
 */
export async function getAdvice(request: AdviceRequest): Promise<AdviceResponse> {
  try {
    // Ensure mode is always valid
    const validatedRequest = {
      ...request,
      mode: (request.mode === "simple" || request.mode === "indepth") ? request.mode : "simple" as "simple" | "indepth"
    };
    
    const response = await fetch(`${API_BASE_URL}/api/v1/advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedRequest),
    });

    if (!response.ok) {
      let errorMessage = "Failed to get advice";
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Failed to connect to backend API");
  }
}

/**
 * Get monthly feedback from backend
 */
export async function getFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let errorMessage = "Failed to get feedback";
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Failed to connect to backend API");
  }
}

/**
 * Health check - verify backend is accessible
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}

