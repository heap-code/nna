import { ParamsToObject, ParamsToValidationSchema } from "./param";
import { ExtractSegmentParams, Segment } from "./segment";
import { AnyFunction, UnshiftParameters } from "../../types";
import { HttpMethod } from "../http.method";

/** Definition for a Http Route */
export interface Definition<
	HANDLER extends AnyFunction,
	S extends readonly Segment[],
> {
	// Type helper only

	/** Type expected for its HTTP handler */
	readonly _handler_: this["segmentsParams"] extends []
		? HANDLER
		: UnshiftParameters<HANDLER, [params: this["_params_"]]>;
	/** The inferred param interface */
	readonly _params_: ParamsToObject<this["segmentsParams"]>;

	/** return a schema (singleton) that can validate the parameters */
	getParamSchema: () => ParamsToValidationSchema<this["segmentsParams"]>;
	/** The method for this route definition */
	method: HttpMethod;
	/** Constructs the HTTP path (with an initial `/` and no final `/`) */
	path: (params: this["_params_"]) => string;
	/** The segments used for this definition */
	segments: S;
	/** Extract parameters from the segments */
	segmentsParams: ExtractSegmentParams<S>;
}

/** Any Route Definition */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Need for type inference
export type AnyDefinition = Definition<AnyFunction, any>;

/** Extract the handler type from the Route definition */
export type ExtractDefinitionHandler<T extends AnyDefinition> = T["_handler_"];
/** Extract the params type from the Route definition */
export type ExtractDefinitionParams<T extends AnyDefinition> = T["_params_"];
