import { composePlugins, withNx } from "@nx/webpack";
import { deepmerge } from "deepmerge-ts";
import * as GeneratePackageJsonPlugin from "generate-package-json-webpack-plugin";
import { DefinePlugin } from "webpack";

// eslint-disable-next-line @nx/enforce-module-boundaries -- The bundler is not "part" of the app
import { name, version } from "../../package.json";

// Nx plugins for webpack.
export default composePlugins(withNx({ target: "node" }), config =>
	deepmerge(config, {
		plugins: [
			new DefinePlugin({
				__APP_NAME__: JSON.stringify(name),
				__APP_VERSION__: JSON.stringify(version),
			}),
			new GeneratePackageJsonPlugin(
				{},
				{ useInstalledVersions: true },
			) as never,
		],
	} satisfies typeof config),
);
