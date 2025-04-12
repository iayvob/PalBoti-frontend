// ────────────────────────────────────────────────────────────────
// Register User Schema
// ────────────────────────────────────────────────────────────────

export type RegisterUserSchema = {
    name: string,
    email: string,
    password: string
    dontRememberMe: boolean,
};

// ────────────────────────────────────────────────────────────────
// Login Schema
// ────────────────────────────────────────────────────────────────

export type LoginSchema = {
    email: string,
    password?: string,
};

// ────────────────────────────────────────────────────────────────
// Forgot Password Schema
// ────────────────────────────────────────────────────────────────

export type ForgotPasswordSchema = {
    email: string,
};

// ────────────────────────────────────────────────────────────────
// Reset Password Schema
// ────────────────────────────────────────────────────────────────

export type resetPasswordSchema = {
    token: string
    password: string
};