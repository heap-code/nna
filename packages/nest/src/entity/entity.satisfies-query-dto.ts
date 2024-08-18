import { FilterQuery } from "@mikro-orm/core";
import { QueryFilterObject } from "@nna/core";

/**
 * Type-checks thats a given entity type can satisfy a DTO (by its Query representation)
 *
 * This function does nothing.
 * Use it to more quickly verify a type compatibility
 *
 * @param _ Should not be set
 * @template ENTITY to check
 * @template DTO to satisfy
 */
export function checkEntitySatisfiesQueryDto<ENTITY, DTO>(
	..._: QueryFilterObject<DTO> extends FilterQuery<ENTITY>
		? []
		: ["Entity does not satisfy Dto"]
	// eslint-disable-next-line @typescript-eslint/no-empty-function -- Only used for typechecking
): void {}
