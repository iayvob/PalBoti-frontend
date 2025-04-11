import { z } from "zod";
import {
    handleZodError,
    stringNonEmpty,
} from "@/utils/zodUtils";

// -------- ENV Schema ---------
export const envSchema = z.object({
    // Environment
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // JWT
    JWT_SECRET: stringNonEmpty(),

    // SMTP Configuration
    GOOGLE_SMTP_USERNAME: stringNonEmpty().email(),
    GOOGLE_SMTP_PASSWORD: stringNonEmpty(),

    // Database (required)
    DATABASE_URL: stringNonEmpty(),

    // NextAuth (required)
    NEXTAUTH_SECRET: stringNonEmpty(),
    NEXTAUTH_URL: stringNonEmpty().url(),

    // Google Gemini Api Keys
    GEMINI_API_KEY: stringNonEmpty(),

    // MQTT & HiveMQ
    MQTT_BROKER_URL: stringNonEmpty(),
    MQTT_USERNAME: stringNonEmpty(),
    MQTT_PASSWORD: stringNonEmpty()
});

// Infer ENV type from the schema
type Env = z.infer<typeof envSchema>;

export let ENV: Env;
try {
    ENV = envSchema.parse(process.env);
} catch (error) {
    console.log(error)
    handleZodError(error);
}