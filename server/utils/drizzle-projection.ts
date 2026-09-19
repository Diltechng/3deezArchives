import { DBQueryConfig, getTableColumns, Table } from "drizzle-orm";
import { Columns, Prettify } from "./types";
import { DbRelationalSchema } from "../db/schema";

type RelationalProjection<
  TTableName extends keyof DbRelationalSchema = keyof DbRelationalSchema,
  TRelationType extends "one" | "many" = "one" | "many",
> = DBQueryConfig<
  TRelationType,
  true,
  DbRelationalSchema,
  DbRelationalSchema[TTableName]
>;

/**
 * Conditional type that infers the return type for `buildCoreProjection`.
 * Generates a `{ [columnName]: [drizzleColumn] }` map for drizzle core queries.
 */
type InferCoreProjection<
  TTable extends Table,
  TInclude extends readonly (keyof Columns<TTable>)[] | undefined,
  TExclude extends readonly (keyof Columns<TTable>)[] | undefined,
> = [TInclude] extends [readonly (keyof Columns<TTable>)[]]
  ? [TExclude] extends [readonly (keyof Columns<TTable>)[]]
    ? Prettify<Omit<
        Pick<Columns<TTable>, TInclude[number]>,
        TExclude[number]
      >>
    : Prettify<Pick<Columns<TTable>, TInclude[number]>>
  : [TExclude] extends [readonly (keyof Columns<TTable>)[]]
    ? Prettify<Omit<Columns<TTable>, TExclude[number]>>
    : Columns<TTable>;

/**
 * Conditional type that infers the return type for `buildRelationalProjection`.
 * Generates a `{ [columnName]: true }` boolean map for drizzle relational queries.
 */
type InferRelationalProjection<
  TTable extends Table,
  TInclude extends readonly (keyof Columns<TTable>)[] | undefined,
  TExclude extends readonly (keyof Columns<TTable>)[] | undefined,
> = [TInclude] extends [readonly (keyof Columns<TTable>)[]]
  ? [TExclude] extends [readonly (keyof Columns<TTable>)[]]
    ? { [K in Exclude<TInclude[number], TExclude[number]>]: true }
    : { [K in TInclude[number]]: true }
  : [TExclude] extends [readonly (keyof Columns<TTable>)[]]
    ? { [K in Exclude<keyof Columns<TTable>, TExclude[number]>]: true }
    : { [K in keyof Columns<TTable>]: true }

/**
 * Builds a dynamic column projection map for Drizzle Core API (`db.select`).
 * 
 * Enforces defense-in-depth where `exclude` filters take absolute precedence over `include` whitelists.
 *
 * @template TTable - Drizzle table schema type extending `Table`.
 * @template TIncludeColumns - Array of column keys to include in the query.
 * @template TExcludeColumns - Array of column keys to redact from the query.
 *
 * @param table - The target Drizzle table schema instance.
 * @param fields - Filter criteria options containing optional `include` and `exclude` arrays.
 * @param fields.include - Whitelisted column names to select.
 * @param fields.exclude - Blacklisted column names to strip out (overrides include).
 *
 * @returns Filtered column map object ready for direct use inside `db.select(...)`.
 *
 * @example
 * const projection = buildCoreProjection(users, {
 *   include: ['id', 'email', 'createdAt', 'passwordHash'],
 *   exclude: ['passwordHash'], // Overrides include for security
 * });
 * const userList = await db.select(projection).from(users);
 */
function buildCoreProjection<
  TTable extends Table,
  const TIncludeColumns extends readonly (keyof Columns<TTable>)[] | undefined,
  const TExcludeColumns extends readonly (keyof Columns<TTable>)[] | undefined,
>(
  table: TTable,
  fields: {
    include?: TIncludeColumns,
    exclude?: TExcludeColumns,
  }
) {
  const allColumns = getTableColumns(table);

  const includeSet = fields.include ? new Set(fields.include) : null;
  const excludeSet = fields.exclude ? new Set(fields.exclude) : null;
  
  const result: Record<string, any> = {};

  for (const [key, col] of Object.entries(allColumns)) {
    if (includeSet && !includeSet.has(key)) continue;
    if (excludeSet && excludeSet.has(key)) continue;

    result[key] = col;
  }

  return result as InferCoreProjection<
    TTable,
    TIncludeColumns,
    TExcludeColumns
  >;
}

/**
 * Builds a dynamic boolean projection object (`{ [column]: true }`) for Drizzle Relational API (`db.query`).
 * 
 * Enforces defense-in-depth where `exclude` filters take absolute precedence over `include` whitelists.
 *
 * @template TTable - Drizzle table schema type extending `Table`.
 * @template TIncludeColumns - Array of column keys to include in the query.
 * @template TExcludeColumns - Array of column keys to redact from the query.
 *
 * @param table - The target Drizzle table schema instance.
 * @param fields - Filter criteria options containing optional `include` and `exclude` arrays.
 * @param fields.include - Whitelisted column names to select.
 * @param fields.exclude - Blacklisted column names to strip out (overrides include).
 *
 * @returns Boolean flag map ready for use inside `db.query.tableName.findMany({ columns })`.
 *
 * @example
 * const columns = buildRelationalProjection(media, {
 *   include: ['id', 'secureUrl', 'bytes', 'uploadedBy'],
 *   exclude: ['internalSecretKey'],
 * });
 * const mediaList = await db.query.media.findMany({ columns });
 */
function buildRelationalProjection<
  TTable extends Table,
  const TIncludeColumns extends readonly (keyof Columns<TTable>)[] | undefined,
  const TExcludeColumns extends readonly (keyof Columns<TTable>)[] | undefined,
>(
  table: TTable,
  fields: {
    include?: TIncludeColumns,
    exclude?: TExcludeColumns,
  }
) {
  const allColumns = getTableColumns(table);

  const includeSet = fields.include ? new Set(fields.include) : null;
  const excludeSet = fields.exclude ? new Set(fields.exclude) : null;

  const result: Record<string, boolean> = {};

  for (const key of Object.keys(allColumns)) {
    if (includeSet && !includeSet.has(key)) continue;
    if (excludeSet && excludeSet.has(key)) continue;

    result[key] = true;
  }

  return result as InferRelationalProjection<
    TTable,
    TIncludeColumns,
    TExcludeColumns
  >;
}

export {
  type RelationalProjection,
  type InferCoreProjection,
  type InferRelationalProjection,
  buildCoreProjection,
  buildRelationalProjection,
};