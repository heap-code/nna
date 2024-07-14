function generate(context: object): string;

/* eslint-disable import/no-default-export -- Type for handlebars imports */
declare module "*.handlebars" {
	export default generate;
}
declare module "*.hbs" {
	export default generate;
}
/* eslint-enable */
