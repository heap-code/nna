import demo from "./templates/demo.hbs";

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
	return demo(context);
}
