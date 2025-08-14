// API Utilities
// This file contains utilities for making API calls and handling responses
const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

const API_BASE_URL = "https://judge0-ce.p.rapidapi.com";

/**
 * API configuration and utilities
 */
class ApiManager {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": RAPID_API_KEY || "",
    };
  }

  /**
   * Make HTTP request with error handling
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options
   * @returns {Promise<object>} Response data
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config = {
        headers: { ...this.defaultHeaders, ...options.headers },
        ...options,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request was cancelled");
      }
      console.error("API request error:", error);
      throw error;
    }
  }

  /**
   * Submit code for execution
   * @param {object} submission - Code submission data
   * @returns {Promise<object>} Submission response
   */
  async submitCode(submission) {
    const { language_id, source_code, stdin = "", signal } = submission;

    const payload = {
      language_id,
      source_code: source_code,
      stdin: stdin ? stdin : "",
    };

    return this.request("/submissions", {
      method: "POST",
      body: JSON.stringify(payload),
      signal,
    });
  }

  /**
   * Get submission result
   * @param {string} token - Submission token
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise<object>} Submission result
   */
  async getSubmission(token, signal = null) {
    return this.request(`/submissions/${token}`, { signal });
  }

  /**
   * Submit code and wait for result
   * @param {object} submission - Code submission data
   * @param {number} maxAttempts - Maximum polling attempts
   * @param {number} pollInterval - Polling interval in ms
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise<object>} Final submission result
   */
  async submitAndWait(
    submission,
    maxAttempts = 3,
    pollInterval = 1000,
    signal = null
  ) {
    try {
      // Submit code
      const submitResponse = await this.submitCode({
        ...submission,
        signal,
      });
      const { token } = submitResponse;

      if (!token) {
        throw new Error("No submission token received");
      }

      // Poll for result
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Check if cancelled before delay
        if (signal?.aborted) {
          throw new Error("Request was cancelled");
        }

        await this.delay(pollInterval);

        // Check if cancelled after delay
        if (signal?.aborted) {
          throw new Error("Request was cancelled");
        }

        const result = await this.getSubmission(token, signal);

        // Check if processing is complete
        if (result.status && result.status.id > 2) {
          return result;
        }
      }

      throw new Error("Submission timed out");
    } catch (error) {
      console.error("Submit and wait error:", error);
      throw error;
    }
  }

  /**
   * Get available languages
   * @returns {Promise<Array>} Array of supported languages
   */
  async getLanguages() {
    return this.request("/languages");
  }

  /**
   * Get system information
   * @returns {Promise<object>} System information
   */
  async getSystemInfo() {
    return this.request("/system_info");
  }

  /**
   * Utility delay function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - Error object
   * @returns {object} Formatted error response
   */
  handleError(error) {
    const errorResponse = {
      success: false,
      message: "An unexpected error occurred",
      details: error.message,
    };

    if (error.message.includes("401")) {
      errorResponse.message =
        "API authentication failed. Please check your API key.";
    } else if (error.message.includes("429")) {
      errorResponse.message = "Rate limit exceeded. Please try again later.";
    } else if (error.message.includes("500")) {
      errorResponse.message = "Server error. Please try again later.";
    } else if (error.message.includes("Network")) {
      errorResponse.message = "Network error. Please check your connection.";
    }

    return errorResponse;
  }
}

// Create default API manager instance
const api = new ApiManager();

// Specific API utilities for the application
export const codeExecutionApi = {
  /**
   * Execute code with input
   * @param {string} code - Source code
   * @param {number} languageId - Language ID
   * @param {string} input - Input data
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise<object>} Execution result
   */
  async executeCode(code, languageId, input = "", signal = null) {
    try {
      const submission = {
        language_id: languageId,
        source_code: code,
        stdin: input,
        signal,
      };

      const result = await api.submitAndWait(submission, 3, 1000, signal);

      return {
        success: true,
        output: result.stdout || "",
        error: result.stderr || result.message || "",
        status: result.status,
        time: result.time,
        memory: result.memory,
      };
    } catch (error) {
      if (error.message === "Request was cancelled") {
        return {
          success: false,
          cancelled: true,
          message: "Code execution was cancelled",
        };
      }
      return api.handleError(error);
    }
  },

  /**
   * Validate code syntax
   * @param {string} code - Source code
   * @param {number} languageId - Language ID
   * @returns {Promise<object>} Validation result
   */
  async validateCode(code, languageId) {
    try {
      const submission = {
        language_id: languageId,
        source_code: code,
        stdin: "",
      };

      const result = await api.submitAndWait(submission, 5, 500);

      return {
        success: !result.compile_output && !result.stderr,
        errors: result.compile_output || result.stderr || "",
        status: result.status,
      };
    } catch (error) {
      return api.handleError(error);
    }
  },
};

export { ApiManager, api };
export default api;
