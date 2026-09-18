import z from "zod";

export const DateFilterV2Schema = z.object({
  dateFrom: z.iso.date("Please enter a valid date")
    .transform(val => new Date(val))
    .optional(),

  dateTo: z.iso.date("Please enter a valid date")
    .transform(val => new Date(val))
    .optional()
});

export type DateFilter = z.infer<typeof DateFilterV2Schema>;