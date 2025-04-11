// ────────────────────────────────────────────────────────────────
// Change Password Form Schema
// ────────────────────────────────────────────────────────────────

export type changePasswordSchema = {
    id: string,
    password: string,
    newPassword: string,
}

// ────────────────────────────────────────────────────────────────
// Update user information Schema
// ────────────────────────────────────────────────────────────────


export type UpdateInfoSchema = {
    id: string,
    name?: string,
    lastLogin?: string,
}

// ────────────────────────────────────────────────────────────────
// Cookies Client User Schema
// ────────────────────────────────────────────────────────────────

export type ClientUserSchema = {
    id: string,
    name: string,
    email: string,
    tokens: {
        access: {
            token: string;
            expires: Date;
        };
        refresh: {
            token: string;
            expires: Date;
        };
    }
}