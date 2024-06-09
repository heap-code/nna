import { joinSegments } from "./segment";

describe("HttpRouteSegment", () => {
	it("should join segments", () => {
		expect(
			joinSegments(
				[
					{ path: "users/", type: "path" },
					{ param: "id", type: "param", validation: "number" },
					{ path: "//groups/all", type: "path" },
				],
				({ param }) => `_${param}_`,
			),
		).toBe("/users/_id_/groups/all");
	});
});
