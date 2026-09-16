import z from "zod"

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  FRONTEND_URL: z.url().default("http://localhost:3000"),

  SUPER_ADMIN_NAME: z.string().min(1).default("Super Admin"),
  SUPER_ADMIN_EMAIL: z.email().default("super@admin.com"),
  SUPER_ADMIN_PASSWORD: z.string().min(1).default("admin123"),

  DATABASE_URL: z.url(),

  GOOGLE_MAIL_USER: z.email(),
  GOOGLE_APP_PASSWORD: z.string().min(1).optional(),

  JWT_SECRET: z.string().min(1).optional(),
  INVITATION_JWT_SECRET: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  CLOUDINARY_UPLOAD_FOLDER: z.string().min(1).optional(),
});

export const env = EnvSchema.parse(process.env);