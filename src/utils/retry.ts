/**
 * Options for configuring the retry behavior
 */
type RetryOptions = {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in milliseconds before the first retry (default: 1_000) */
  initialDelay?: number;
  /** Factor by which the delay increases with each retry (default: 2) */
  backoffFactor?: number;
  /** Maximum delay in milliseconds (default: 30_000) */
  maxDelay?: number;
};

/**
 * Default retry options
 */
const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1_000,
  backoffFactor: 2,
  maxDelay: 30_000,
};

/**
 * Calculates the delay for the next retry attempt using exponential backoff
 */
const calculateDelay = (attempt: number, options: RetryOptions): number => {
  const {
    initialDelay = defaultRetryOptions.initialDelay,
    backoffFactor = defaultRetryOptions.backoffFactor,
    maxDelay = defaultRetryOptions.maxDelay,
  } = options;

  const delay = initialDelay * Math.pow(backoffFactor, attempt - 1);

  return Math.min(delay, maxDelay);
};

/**
 * Executes an async function with retry capability
 *
 * @param fn - The async function to execute
 * @param options - Retry configuration options
 * @returns A promise that resolves with the result of the function or rejects if all retries fail
 *
 * @example
 * ```typescript
 * const result = await retry(
 *   async () => {
 *     const response = await fetch('https://api.example.com/data');
 *     if (!response.ok) throw new Error('API request failed');
 *     return response.json();
 *   },
 *   {
 *     maxRetries: 5,
 *   }
 * );
 * ```
 */
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = defaultRetryOptions.maxRetries } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If this was the last attempt, throw the error
      if (attempt > maxRetries) {
        throw error;
      }

      console.error(`❌ Error on ${fn.name}:`, error);
      console.error("🔄 Retrying...");

      const delay = calculateDelay(attempt, options);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached due to the throw in the loop,
  // but TypeScript requires a return statement
  throw lastError;
}
