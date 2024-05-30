/** Base for any source */
interface PayloadSourceBase<T extends string> {
	/** The discriminated key of a source */
	source: T;
}

/** When the user logged with a local login (known credentials) */
export type PayloadSourceLocal = PayloadSourceBase<"local">;

/** Source of a JWT payload (what was used to login) */
export type PayloadSource = PayloadSourceLocal;
/** Union of possible source types */
export type PayloadSourceType = PayloadSource["source"];
