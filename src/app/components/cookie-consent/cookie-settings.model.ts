export interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookieCategory {
  id: keyof CookieSettings;
  name: string;
  description: string;
  required: boolean;
}