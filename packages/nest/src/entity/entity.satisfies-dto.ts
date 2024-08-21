import { EntityDTO } from "@mikro-orm/core";

/**
 * Type-checks thats a given entity type can satisfy a DTO
 *
 *
 * This function does nothing.
 * Use it to more quickly verify a type compatibility
 *
 * @param _ Should not be set
 * @template ENTITY to check
 * @template DTO to satisfy
 */
export function checkEntitySatisfiesDto<ENTITY, DTO>(
	..._: EntityDTO<ENTITY> extends DTO ? [] : ["Entity does not satisfy Dto"]
	// eslint-disable-next-line @typescript-eslint/no-empty-function -- Only used for typechecking
): void {}
