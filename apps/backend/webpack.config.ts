import { composePlugins, withNx } from "@nx/webpack";

// Nx plugins for webpack.
export default composePlugins(
	withNx({
		target: "node",
	}),
	config => {
		// Update the webpack config as needed here.
		// e.g. `config.plugins.push(new MyPlugin())`
		return config;
	},
);
