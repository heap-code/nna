import { PRIMARY_KEY } from "./model.common";
import * as ModelNumber from "./model.number";
import * as ModelString from "./model.string";

export * as ModelNumber from "./model.number";
export * as ModelString from "./model.string";

export { PRIMARY_KEY as MODEL_PRIMARY_KEY };
// Default model => ModelNumber
export { ModelNumber as Model };

/** A model, with a stringified or numbered primary key */
export type ModelAny = ModelNumber.Type | ModelString.Type;
/** Base of any Model */
export type ModelBase = Pick<ModelAny, ModelPrimaryKey>;
/** Const type for the {@link PRIMARY_KEY} */
export type ModelPrimaryKey = typeof PRIMARY_KEY;
