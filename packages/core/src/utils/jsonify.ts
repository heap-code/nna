import { Jsonify } from "type-fest";

/**
 * Serializes an object to JSON
 *
 * @param object the value to serialize
 * @returns object serialized
 */
export function jsonify<T>(object: T): Jsonify<T> {
	return JSON.parse(JSON.stringify(object)) as never;
}
