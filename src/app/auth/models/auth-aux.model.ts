export interface RefreshTokenRequest {
  refreshToken: string;
  deviceInfo: string;
  userAgent: string;
}

export interface ForgotPasswordRequest {
  email: string;
  deviceInfo: string;
  userAgent: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  newPasswordConfirmed: boolean;
}
