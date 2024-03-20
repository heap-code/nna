import { QueryResults, QueryResultsPagination } from "@nna/core";

import { EntityReadonlyRepository } from "./entity.readonly-repository";

describe("EntityReadonlyRepository", () => {
	describe("EntityReadonlyRepository.toQueryResults", () => {
		it("should convert", () => {
			for (const [[data, total, offset], pagination] of [
				[[[], 0, 0], { range: { end: 0, start: 0 }, total: 0 }],
				[[[], 10, 0], { range: { end: 0, start: 0 }, total: 10 }],
				[[[], 5, 3], { range: { end: 3, start: 3 }, total: 5 }],
				[[[1, 2, 3], 5, 1], { range: { end: 4, start: 1 }, total: 5 }],
				[[[1], 5, 4], { range: { end: 5, start: 4 }, total: 5 }],
				[[[], 5, 14], { range: { end: 14, start: 14 }, total: 5 }],
			] satisfies Array<
				[[unknown[], number, number], QueryResultsPagination]
			>) {
				expect(
					EntityReadonlyRepository.toQueryResults(
						[data, total],
						offset,
					),
				).toStrictEqual({
					data,
					pagination,
				} satisfies QueryResults<unknown>);
			}
		});
	});
});
