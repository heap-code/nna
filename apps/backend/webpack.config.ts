import { composePlugins, withNx } from "@nx/webpack";
import { deepmerge } from "deepmerge-ts";
import * as GeneratePackageJsonPlugin from "generate-package-json-webpack-plugin";
import type * as handlebars from "handlebars";
import { minify } from "html-minifier";
import { DefinePlugin } from "webpack";

// eslint-disable-next-line @nx/enforce-module-boundaries -- The bundler is not "part" of the app
import { name, version } from "../../package.json";

// Nx plugins for webpack.
export default composePlugins(withNx({ target: "node" }), (config, ctx) =>
	deepmerge(config, {
		module: {
			rules: [
				{
					test: [/\.handlebars$/, /\.hbs$/],
					use: [
						{
							loader: "handlebars-loader",
							options: {
								// https://www.npmjs.com/package/handlebars-loader#details
								debug: false,
								precompileOptions: {
									preventIndent: true,
									// Raise error on non-production build
									//	prefer incomplete emails over no email sent or 500 errors
									strict: ctx.configuration !== "production",
								} satisfies Parameters<
									typeof handlebars.precompile
								>[1],
							},
						},
						{
							loader: "string-replace-loader",
							options: {
								flags: "gm",
								replace: content =>
									minify(content, {
										collapseWhitespace: true,
										minifyCSS: true,
										minifyJS: true,
										minifyURLs: true,
										removeComments: true,
										sortAttributes: true,
									}),
								search: /((.|\s)*)/gm,
							},
						},
					],
				},
			],
		},
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
