export type Z_INT = number;

export const Z_MIN = 0; export const Z_MAX = 100000;

export class MathZ { /**

  - Clamps a value within the Z_MIN and Z_MAX bounds. */ public static
    clamp(value: number): Z_INT { if (value <= Z_MIN) return Z_MIN; if (value >=
    Z_MAX) return Z_MAX; return value; }

/**

  - Converts a fixed-point Z_INT into a 0-100 percentage. */ public static
    percent(value: Z_INT): number { return value / (Z_MAX / 100); }

/**

  - Adds a value to a Z_INT and clamps the result. */ public static add(a:
    Z_INT, b: number): Z_INT { return this.clamp(a + b); }

/**

  - Subtracts a value from a Z_INT and clamps the result. */ public static
    subtract(a: Z_INT, b: number): Z_INT { return this.clamp(a - b); } }
