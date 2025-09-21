// Security utilities for client-side validation and sanitization

export class SecurityUtils {
  // Input validation patterns
  static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static readonly UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  static readonly ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9\s\-_.]+$/;

  // Sanitize user input to prevent XSS
  static sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .substring(0, 5000); // Limit length
  }

  // Validate campaign data
  static validateCampaignData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.length > 100) {
      errors.push('Campaign name must be a string under 100 characters');
    }

    if (!data.location || typeof data.location !== 'string' || data.location.length > 200) {
      errors.push('Location must be a string under 200 characters');
    }

    if (!data.industry || typeof data.industry !== 'string' || data.industry.length > 100) {
      errors.push('Industry must be a string under 100 characters');
    }

    if (!data.seniority || typeof data.seniority !== 'string' || data.seniority.length > 100) {
      errors.push('Seniority must be a string under 100 characters');
    }

    if (!data.companySize || typeof data.companySize !== 'string' || data.companySize.length > 50) {
      errors.push('Company size must be a string under 50 characters');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate UUID format
  static isValidUUID(uuid: string): boolean {
    return typeof uuid === 'string' && this.UUID_PATTERN.test(uuid);
  }

  // Rate limiting for client-side requests
  static rateLimitCache = new Map<string, { count: number; timestamp: number }>();

  static checkClientRateLimit(
    key: string, 
    maxRequests: number = 10, 
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const cached = this.rateLimitCache.get(key);

    if (!cached || now - cached.timestamp > windowMs) {
      this.rateLimitCache.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (cached.count >= maxRequests) {
      return false;
    }

    cached.count++;
    return true;
  }

  // Clean up old rate limit entries
  static cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, value] of this.rateLimitCache.entries()) {
      if (now - value.timestamp > 300000) { // 5 minutes
        this.rateLimitCache.delete(key);
      }
    }
  }

  // Content Security Policy headers
  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://wbhdvskhoetfwkfzxggc.supabase.co",
        "font-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "frame-ancestors 'none'"
      ].join('; ')
    };
  }

  // Generate secure session ID
  static generateSecureSessionId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Clean up rate limit cache periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    SecurityUtils.cleanupRateLimit();
  }, 300000); // Every 5 minutes
}