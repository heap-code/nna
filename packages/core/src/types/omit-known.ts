/* Omit known keys from a type.
 *
 * Identical to the `Omit` in ts lib, but with the constraint on the key
 *
 * @see Omit
 */
export type OmitKnown<T, K extends keyof T> = Omit<T, K>;
