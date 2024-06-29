import { SeedDict } from "./seeds";

type Y<T extends object, K extends string> = keyof T extends never
	? []
	: keyof T extends infer U extends string
		? U extends K
			? [...Y<T, K>]
			: [U, ...Y<T, K | U>]
		: Y<T, K>;

type X = Y<SeedDict, never>;

type A = (a: "abc") => number;
type B = (b: "def") => string;

type AB = A & B;

declare const eeee: AB;

declare const e: X;
const f = eeee("def");

declare const e: Y;
const aaa = e("empty");
console.log(aaaS, f, e);
