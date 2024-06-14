import { UserCreateDto, userCreateDtoSchema } from "./user.create.dto";
import { UserUpdateDto, userUpdateDtoSchema } from "./user.update.dto";

describe("User DTOs", () => {
	describe("UserCreateDto schema", () => {
		it("should validate input", () => {
			for (const test of [{}] satisfies UserCreateDto) {
				expect(userCreateDtoSchema.safeParse(test).success).toBe(true);
			}
		});
	});

	describe("UserUpdateDto schema", () => {
		it("should validate input", () => {
			for (const test of [{}] satisfies UserUpdateDto) {
				expect(userUpdateDtoSchema.safeParse(test).success).toBe(true);
			}
		});
	});
});
