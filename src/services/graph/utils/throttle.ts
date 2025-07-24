/**
 * Request throttling and retry utilities for Microsoft Graph API
 */

interface QueuedRequest<T> {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

/**
 * Throttled request queue for Graph API
 * Limits concurrent requests to avoid throttling errors
 */
export class GraphRequestQueue {
  private queue: QueuedRequest<any>[] = [];
  private activeRequests = 0;
  private readonly maxConcurrent: number;
  private readonly requestDelay: number;
  private lastRequestTime = 0;

  constructor(maxConcurrent = 2, requestDelay = 100) {
    this.maxConcurrent = maxConcurrent;
    this.requestDelay = requestDelay;
  }

  /**
   * Add a request to the queue
   */
  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        execute: request,
        resolve,
        reject
      });
      this.processQueue();
    });
  }

  /**
   * Process queued requests
   */
  private async processQueue() {
    if (this.activeRequests >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    // Enforce minimum delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.requestDelay) {
      setTimeout(() => this.processQueue(), this.requestDelay - timeSinceLastRequest);
      return;
    }

    const request = this.queue.shift();
    if (!request) return;

    this.activeRequests++;
    this.lastRequestTime = Date.now();

    try {
      const result = await request.execute();
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.activeRequests--;
      // Process next request after a delay
      setTimeout(() => this.processQueue(), this.requestDelay);
    }
  }
}

/**
 * Retry with exponential backoff for throttled requests
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if error is due to throttling
      const isThrottled = 
        error.statusCode === 429 || // Too Many Requests
        error.code === 'ApplicationThrottled' ||
        error.message?.includes('MailboxConcurrency') ||
        error.message?.includes('throttled');
      
      if (!isThrottled || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      console.warn(`Request throttled, retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Create a throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastCallTime = 0;
  
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    if (timeSinceLastCall >= delay) {
      lastCallTime = now;
      return fn(...args);
    }
    
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      const remainingDelay = delay - timeSinceLastCall;
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        resolve(fn(...args));
      }, remainingDelay);
    });
  };
}

// Global request queue instance
export const graphRequestQueue = new GraphRequestQueue(2, 200); // Max 2 concurrent requests, 200ms between requests