export function titleCase(input: string): string {
	return input
		.replace(/^[-_]*(.)/, (_, c: string) => c.toUpperCase())
		.replace(/[-_]+(.)/g, (_, c: string) => ' ' + c.toUpperCase());
}
