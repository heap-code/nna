import { composePlugins, withNx } from "@nx/webpack";
import { deepmerge } from "deepmerge-ts";
import { DefinePlugin } from "webpack";

// eslint-disable-next-line @nx/enforce-module-boundaries -- The bundler is not "part" of the app
import { name, version } from "../../package.json";

// Nx plugins for webpack.
export default composePlugins(withNx({ target: "node" }), config =>
	deepmerge(config, {
		plugins: [
			new DefinePlugin({
				__NPM_NAME__: JSON.stringify(name),
				__NPM_VERSION__: JSON.stringify(version),
			}),
		],
	} satisfies typeof config),
);
