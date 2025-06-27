export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
  deviceInfo: string;
  userAgent: string;
}

export interface StudentLoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
  deviceInfo: string;
  userAgent: string;
}
