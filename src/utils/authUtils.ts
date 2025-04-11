import { toast } from "@/hooks/use-toast"

/**
 * Rate limiter for authentication actions
 * @param actionType The type of action being rate limited
 * @param timeWindow Time window in milliseconds
 * @returns Boolean indicating if the action is allowed
 */
export const isRateLimited = (actionType: string, timeWindow = 120000): boolean => {
  const lastActionKey = `last_${actionType}_timestamp`
  const lastAction = localStorage.getItem(lastActionKey)
  const now = Date.now()

  if (lastAction && now - Number.parseInt(lastAction) < timeWindow) {
    toast({
      title: `Please wait ${timeWindow / 60000} minutes before trying again`,
      variant: "destructive",
    })
    return true
  }

  // Update timestamp
  localStorage.setItem(lastActionKey, now.toString())
  return false
}

/**
 * Validate email format
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
}

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: "Password is required" }
  }

  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" }
  }

  return { valid: true }
}

/**
 * Mock API call with simulated delay
 * @param success Whether the call should succeed
 * @param data Data to return
 * @param delay Delay in milliseconds
 * @returns Promise that resolves to the response
 */
export const mockApiCall = async <T>(
  success: boolean = true, 
  data: T, 
  delay: number = 1500
)
: Promise<T> =>
{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!success) {
        reject(new Error("API call failed"));
      }
      resolve(data);
    }, delay);
  });
}
