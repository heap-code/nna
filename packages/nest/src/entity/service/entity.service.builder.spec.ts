import { ModelBase } from "@nna/core";

import {
	EntityServiceWithCreate,
	EntityServiceWithDelete,
	EntityServiceWithUpdate,
	entityServiceBuilder,
} from "./entity.service";

describe("entityServiceBuilder", () => {
	type ServiceKeys = keyof (EntityServiceWithCreate<ModelBase> &
		EntityServiceWithDelete<ModelBase> &
		EntityServiceWithUpdate<ModelBase>);
	type MaybeService = Record<ServiceKeys, unknown>;

	it("should have a `create` method", () => {
		class Service extends entityServiceBuilder().withCreate().getClass() {
			protected override transformToCreate(): never {
				throw new Error("Method not implemented.");
			}
		}

		const service = new Service(
			{} as unknown as never,
		) as unknown as MaybeService;

		expect(service.create).toBeDefined();
		expect(service.updateById).toBeUndefined();
		expect(service.deleteById).toBeUndefined();
	});

	it("should have a `updateById` method", () => {
		class Service extends entityServiceBuilder().withUpdate().getClass() {
			protected override transformToUpdate(): never {
				throw new Error("Method not implemented.");
			}
		}

		const service = new Service(
			{} as unknown as never,
		) as unknown as MaybeService;

		expect(service.create).toBeUndefined();
		expect(service.updateById).toBeDefined();
		expect(service.deleteById).toBeUndefined();
	});

	it("should have a `deleteById` method", () => {
		class Service extends entityServiceBuilder().withDelete().getClass() {}

		const service = new Service(
			{} as unknown as never,
		) as unknown as MaybeService;

		expect(service.create).toBeUndefined();
		expect(service.updateById).toBeUndefined();
		expect(service.deleteById).toBeDefined();
	});

	it("should have CRUD methods", () => {
		class Service extends entityServiceBuilder().withCUD().getClass() {
			protected override transformToCreate(): never {
				throw new Error("Method not implemented.");
			}
			protected override transformToUpdate(): never {
				throw new Error("Method not implemented.");
			}
		}

		const service = new Service(
			{} as unknown as never,
		) as unknown as MaybeService;

		expect(service.create).toBeDefined();
		expect(service.updateById).toBeDefined();
		expect(service.deleteById).toBeDefined();
	});
});
