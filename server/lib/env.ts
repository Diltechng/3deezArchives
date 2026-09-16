import z from "zod"

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  FRONTEND_URL: z.url().default("http://localhost:3000"),

  SUPER_ADMIN_NAME: z.string().min(1).default("Super Admin"),
  SUPER_ADMIN_EMAIL: z.email().default("super@admin.com"),
  SUPER_ADMIN_PASSWORD: z.string().min(1).default("admin123"),
  ADMIN_DEFAULT_PASSWORD: z.string().min(1),

  DATABASE_URL: z.url(),

  GOOGLE_MAIL_USER: z.email(),
  GOOGLE_APP_PASSWORD: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  INVITATION_JWT_SECRET: z.string().min(1),
  CRON_SECRET: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_UPLOAD_FOLDER: z.string().min(1),
});

export const {
  ADMIN_DEFAULT_PASSWORD,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_FOLDER,
  CRON_SECRET,
  DATABASE_URL,
  FRONTEND_URL,
  GOOGLE_APP_PASSWORD,
  GOOGLE_MAIL_USER,
  INVITATION_JWT_SECRET,
  JWT_SECRET,
  NODE_ENV,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_NAME,
  SUPER_ADMIN_PASSWORD,
} = EnvSchema.parse(process.env);