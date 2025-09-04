export function thisMonthStartEnd(date?: Date): { start: Date; end: Date } {
	const now = date ?? new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), 1);
	const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	return {
		start,
		end,
	};
}

export function currentDateString(): string {
	return new Date().toISOString().slice(0, 10);
}

export function dateFromStr(dateStr: string): Date {
	return new Date(dateStr);
}
export function dateToStr(date: Date): string {
	return date.toISOString().slice(0, 10);
}
