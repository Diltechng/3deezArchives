import z from "zod";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const UploadMediaSchema = z.object({
  file: z.instanceof(File, {
    message: "File is required"
  })
  .refine(file =>
    file.size <= MAX_FILE_SIZE,
    "File must be less than 10MB"
  )
  .refine(
    file => ALLOWED_FILE_TYPES.includes(file.type),
    "Unsupported file type"
  ),
});

export type UploadMediaInput = z.infer<typeof UploadMediaSchema>;