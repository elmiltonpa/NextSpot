import { CredentialsSignin } from "next-auth";

export const AUTH_ERRORS = {
  rate_limit: {
    code: "rate_limit",
    message:
      "Demasiados intentos desde esta conexión. Por favor, espera 15 minutos.",
  },
  account_locked: {
    code: "account_locked",
    message:
      "Tu cuenta ha sido bloqueada temporalmente por demasiados intentos fallidos. Inténtalo en 15 minutos.",
  },
  max_attempts: {
    code: "max_attempts",
    message:
      "Has superado el límite de intentos. Cuenta bloqueada por 15 minutos.",
  },
  social_account: {
    code: "social_account",
    message:
      "Esta cuenta fue registrada con Google. Usa el botón de Google para iniciar sesión.",
  },
  invalid_credentials: {
    code: "invalid_credentials",
    message: "Usuario o contraseña incorrectos.",
  },
} as const;

export class RateLimitError extends CredentialsSignin {
  code = AUTH_ERRORS.rate_limit.code;
  message = AUTH_ERRORS.rate_limit.message;
}

export class AccountLockedError extends CredentialsSignin {
  code = AUTH_ERRORS.account_locked.code;
  message = AUTH_ERRORS.account_locked.message;
}

export class MaxAttemptsError extends CredentialsSignin {
  code = AUTH_ERRORS.max_attempts.code;
  message = AUTH_ERRORS.max_attempts.message;
}

export class SocialAccountError extends CredentialsSignin {
  code = AUTH_ERRORS.social_account.code;
  message = AUTH_ERRORS.social_account.message;
}

export class InvalidCredentialsError extends CredentialsSignin {
  code = AUTH_ERRORS.invalid_credentials.code;
  message = AUTH_ERRORS.invalid_credentials.message;
}

export function getAuthErrorMessage(
  errorCode: string | null | undefined,
): string {
  if (!errorCode) return "Ocurrió un error inesperado. Inténtalo de nuevo.";

  const error = Object.values(AUTH_ERRORS).find((e) => e.code === errorCode);
  if (error) return error.message;

  if (errorCode === "CredentialsSignin") {
    return AUTH_ERRORS.invalid_credentials.message;
  }

  return "Ocurrió un error inesperado. Inténtalo de nuevo.";
}
