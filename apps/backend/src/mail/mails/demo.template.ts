/** Context for template rendering */
export interface Context {
	user: { age: number; name: string };
}

/**
 * Renders a handlebars template (demo)
 *
 * @param context for template rendering
 * @returns string content
 */
export function render(context: Context) {
	return import("./templates/demo.hbs").then(_ => _.default(context));
}
