/**
 * Style Library governance schema version — independent from STYLE_SCHEMA_VERSION.
 * @see docs/architecture/style-library-storage.md
 */

export const STYLE_LIBRARY_SCHEMA_VERSION = 1 as const;

export type StyleLibrarySchemaVersion = typeof STYLE_LIBRARY_SCHEMA_VERSION;

export const STYLE_LIBRARY_ID = "qingpian-style-library-v0" as const;
