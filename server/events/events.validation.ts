import { BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { CreateEventSchema, GetEventsQuerySchema, EventIdSchema, UpdateEventSchema } from "@/shared/schemas";
import z from "zod";

export function validateCreateEvent(data: unknown) {
  const result = CreateEventSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid or malformed create event data", {
      code: ApiErrorCode.INVALID_CREATE_EVENT_DATA,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateEventId(data: unknown) {
  const result = EventIdSchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).formErrors;
    
    throw new BadRequestError("Invalid event ID", {
      code: ApiErrorCode.INVALID_EVENT_ID,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateUpdateEvent(data: unknown) {
  const result = UpdateEventSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid or malformed update event data", {
      code: ApiErrorCode.INVALID_UPDATE_EVENT_DATA,
      details: flattenedError
    });
  }

  return result.data;
}


export function validateGetEventsQuery(data: unknown) {
  const result = GetEventsQuerySchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid or malformed get events query", {
      code: ApiErrorCode.INVALID_FETCH_QUERY,
      details: flattenedError
    });
  }

  return result.data;
}