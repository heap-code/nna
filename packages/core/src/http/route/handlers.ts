import { AnyDefinition, ExtractDefinitionHandler } from "./definition";

export type Definitions = Record<string, AnyDefinition>;

/**
 * Gets an object type from a record of HttpRouteDefinitions
 *
 * @example
 * type Http1 = Handlers<{a: HttpRoute.AnyDefinition}>;
 * type Http2 = {a: () => void}
 */
export type Handlers<T extends Definitions> = {
	[K in keyof T]: ExtractDefinitionHandler<T[K]>;
};
