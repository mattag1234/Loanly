/**
 * Application color palette
 * Centralized color definitions for consistent theming
 */
export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#1ABC9C',
    dark: '#16A085',
    light: '#48C9B0',
  },

  // Status colors
  success: '#1ABC9C',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  // Neutral colors
  background: {
    light: '#F5F7FA',
    DEFAULT: '#FFFFFF',
    dark: '#E5E7EB',
  },

  // Text colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    muted: '#9CA3AF',
  },

  // Risk tier colors
  risk: {
    low: '#1ABC9C',
    medium: '#F39C12',
    high: '#E74C3C',
  },
} as const;

/**
 * Get color based on percentage value
 * Used for credibility scores and metric values
 */
export function getColorByPercentage(percentage: number): string {
  if (percentage >= 70) return colors.risk.low;
  if (percentage >= 40) return colors.risk.medium;
  return colors.risk.high;
}

// Get risk tier label based on percentage
export function getRiskTier(percentage: number): string {
  if (percentage >= 70) return "Low-Risk Tier";
  if (percentage >= 40) return "Medium-Risk Tier";
  return "High-Risk Tier";
}
