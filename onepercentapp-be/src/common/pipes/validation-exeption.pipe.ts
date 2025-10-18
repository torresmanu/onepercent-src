// common/pipes/validation-exception.pipe.ts
import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class ValidationExceptionPipe extends ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (errors) => {
                const message = errors.map(err => ({
                    field: err.property,
                    errors: err.constraints ? Object.values(err.constraints) : [],
                }));
                return new BadRequestException(message);
            },
        });
    }
}