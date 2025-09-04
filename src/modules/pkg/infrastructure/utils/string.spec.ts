import { titleCase } from './string';

describe('titleCase', () => {
	it('converts PascalCase to title case', () => {
		expect(titleCase('PascalCase')).toBe('PascalCase'); // unchanged, but goot to observer
	});

	it('converts snake_case to title case', () => {
		expect(titleCase('snake_case_example')).toBe('Snake Case Example');
		expect(titleCase('_leading_snake')).toBe('Leading Snake');
	});

	it('converts kebab-case to title case', () => {
		expect(titleCase('kebab-case-example')).toBe('Kebab Case Example');
		expect(titleCase('-leading-kebab')).toBe('Leading Kebab');
	});

	it('handles mixed separators', () => {
		expect(titleCase('mixed_case-kebab')).toBe('Mixed Case Kebab');
	});

	it('handles empty string', () => {
		expect(titleCase('')).toBe('');
	});

	it('handles single word', () => {
		expect(titleCase('word')).toBe('Word');
	});
});
