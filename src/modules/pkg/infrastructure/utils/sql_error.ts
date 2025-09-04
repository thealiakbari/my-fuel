import { QueryFailedError } from 'typeorm';

interface DuplicateErrorDetail {
	code: string;
	constraint: string;
}

export type DuplicateError = DuplicateErrorDetail & QueryFailedError;

export function isDuplicateError(err: unknown): err is DuplicateError {
	return (
		err != undefined &&
		typeof err === 'object' &&
		err instanceof QueryFailedError &&
		'code' in err &&
		'constraint' in err
	);
}
