import { Collection } from "@mikro-orm/core";

import { checkEntitySatisfiesQueryDto } from "./entity.satisfies-query-dto";

interface TestDto {
	a: number;
	b: string;
	c: TestDto[];
}

class TestEntity1 {
	public a!: number;
	public b!: string;
	public readonly c = new Collection<TestEntity1>(this);
}
class TestEntity2 {
	public a!: number;
	public b!: string;
	public c!: Date;
}

describe("checkEntitySatisfiesQueryDto", () => {
	it("should satisfy", () => {
		checkEntitySatisfiesQueryDto<TestEntity1, TestDto>();
		expect(true).toBe(true);
	});

	it("should not satisfy", () => {
		checkEntitySatisfiesQueryDto<TestEntity2, TestDto>(
			"Entity does not satisfy Dto",
		);
		expect(true).toBe(true);
	});
});
