import { ApiErrorCode } from "../errors/error-codes";
import { SerializeDates } from "../types/api";


export type EntityId = string;

export type ISODateString = string;


export class TApiError {
  constructor (
    public readonly message: string,
    public readonly code: ApiErrorCode,
    public readonly details?: any,
  ) {}
}

export class TPagination {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly total: number,
    public readonly totalPages: number,
    public readonly hasNextPage: boolean,
    public readonly hasPreviousPage: boolean,
  ) {}
}

export class TResponse<Data = unknown, Meta extends object = Record<string, unknown>> {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data: SerializeDates<Data>,
    public readonly meta?: Meta,
    public readonly error?: TApiError,
  ) {}
};