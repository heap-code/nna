import { composePlugins } from "@nx/webpack";
import { NxAppWebpackPlugin } from "@nx/webpack/app-plugin";
import { deepmerge } from "deepmerge-ts";
import * as GeneratePackageJsonPlugin from "generate-package-json-webpack-plugin";
import type * as handlebars from "handlebars";
import { minify } from "html-minifier";
import * as path from "path";
import * as WebpackStringReplaceLoader from "string-replace-loader";
import { DefinePlugin, RuleSetRule } from "webpack";

// eslint-disable-next-line @nx/enforce-module-boundaries -- The bundler is not "part" of the app
import * as packageJson from "../../package.json";

const { name, version } = packageJson;

// Nx plugins for webpack.
export default composePlugins(
	(config, { options }) => ({
		...config,
		plugins: [
			...(config.plugins ?? []),
			// Typechecking is not run on build (run on serve/watch and verified on CI)
			new NxAppWebpackPlugin({
				compiler: "swc",
				/** The {@link GeneratePackageJsonPlugin} plugin is a bit better => it takes what is bundled (even devDep for e2e) */
				generatePackageJson: false,
				outputHashing: false,
				skipTypeChecking: !options.watch,
				target: "node",
			}),
		],
		watch: options.watch,
	}),
	(config, { configuration }) => {
		const everythingRegExp = /(\s|\S)+$/gm;
		const hbsRules = [
			{
				// Make the content "handlebars-usable"
				loader: "handlebars-loader",
				options: {
					// https://www.npmjs.com/package/handlebars-loader#details
					debug: false,
					precompileOptions: {
						preventIndent: true,
						// Raise error on non-production build
						//	prefer incomplete emails over no email sent or 500 errors
						strict: configuration !== "production",
					} satisfies Parameters<typeof handlebars.precompile>[1],
				},
			},
			{
				// Minify HTML content
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
					search: everythingRegExp,
				} satisfies WebpackStringReplaceLoader.Options,
			},
		] as const satisfies RuleSetRule[];

		/** Wrap the content inside a 'style' tag */
		const wrapStyleRule = {
			loader: "string-replace-loader",
			options: {
				replace: content => `<style>${content}</style>`,
				search: everythingRegExp,
			} satisfies WebpackStringReplaceLoader.Options,
		} as const satisfies RuleSetRule;

		/** Path of the handlebars templates */
		const hbsTemplates = path.resolve(__dirname, "src/mail/templates");

		return deepmerge(config, {
			module: {
				rules: [
					{
						include: [hbsTemplates],
						test: [/\.css$/i],
						use: [...hbsRules, wrapStyleRule],
					},
					{
						include: [hbsTemplates],
						test: [/\.scss$/i, /\.sass$/i],
						use: [...hbsRules, wrapStyleRule, "sass-loader"],
					},
					{
						include: [hbsTemplates],
						test: [/\.handlebars$/i, /\.hbs$/i],
						use: hbsRules,
					},
				],
			},
			plugins: [
				new DefinePlugin({
					__APP_NAME__: JSON.stringify(name),
					__APP_VERSION__: JSON.stringify(version),
				}),
				new GeneratePackageJsonPlugin(
					{ name, version } satisfies Partial<typeof packageJson>,
					{ useInstalledVersions: true },
				) as never,
			],
		} satisfies typeof config);
	},
);
