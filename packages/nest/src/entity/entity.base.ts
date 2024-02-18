import { PrimaryKey, Property } from "@mikro-orm/core";
import { Model } from "@nna/core";

export abstract class EntityBase implements Model.Type {
	/** The unique ID of the entity */
	@PrimaryKey({ autoincrement: true })
	public readonly _id!: number;

	/** The date when this entity has been created */
	@Property({ defaultRaw: "NOW()" })
	public readonly create_at!: Date;
	/** The date when this entity has been updated */
	@Property({ defaultRaw: "NOW()", onUpdate: () => new Date() })
	public readonly updatedAt!: Date;
}
