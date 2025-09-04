import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
	constructor(errors: ValidationError[]) {
		super({
			statusCode: 400,
			message: 'Validation failed',
			errors: errors.map((err) => ({
				field: err.property,
				errors: Object.values(err.constraints ?? {}),
			})),
		});
	}
}
