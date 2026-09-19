import z from "zod";

export const DateFilterV2Schema = z.object({
  startDate: z.iso.date("Please enter a valid date")
    .transform(val => new Date(val))
    .optional(),

  endDate: z.iso.date("Please enter a valid date")
    .transform(val => new Date(val))
    .optional()
});

export type DateFilter = z.infer<typeof DateFilterV2Schema>;