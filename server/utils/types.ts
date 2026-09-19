import { Table } from "drizzle-orm";

/**
 * A utility type to extract underlying column objects from drizzle `Table`.
 */
export type Columns<T extends Table> = T["_"]["columns"];

/**
 * Flattens intersection types to optimize IDE hover tooltips and type display.
 */
export type Prettify<T> = { [K in keyof T]: T[K]; } & {};