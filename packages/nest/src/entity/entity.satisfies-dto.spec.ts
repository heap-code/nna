import { Collection, LoadedCollection, Ref } from "@mikro-orm/core";

import { checkEntitySatisfiesDto } from "./entity.satisfies-dto";

interface TestDto {
	a: number;
	b: string;
	c: TestDto[];
}

class TestEntity1 {
	public a!: number;
	public b!: string;
	public readonly c = new Collection<TestEntity1>(
		this,
	) as LoadedCollection<TestEntity1>;
}
class TestEntity2 {
	public a!: number;
	public b!: string;
	public c!: Ref<TestEntity1>;
}

describe("checkEntitySatisfiesDto", () => {
	it("should satisfy", () => {
		checkEntitySatisfiesDto<TestEntity1, TestDto>();
		expect(true).toBe(true);
	});

	it("should not satisfy", () => {
		checkEntitySatisfiesDto<TestEntity2, TestDto>(
			"Entity does not satisfy Dto",
		);
		expect(true).toBe(true);
	});
});
