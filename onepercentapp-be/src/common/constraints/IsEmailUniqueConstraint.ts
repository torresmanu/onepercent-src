import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import {Inject, Injectable, Logger} from '@nestjs/common';
import {EntityManager} from "typeorm";
import {User} from "../../modules/user/entities/user.entity";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    private readonly logger = new Logger(IsEmailUniqueConstraint.name);
    constructor(
        private entityManager: EntityManager,
    ) {}

    // async validate(email: string): Promise<boolean> {
    //     const user = await this.userService.findOneByEmail(email);
    //     return !user;
    // }

    async validate(email: string) {
        this.logger.debug("constraints: ", email);
        const repository = this.entityManager.getRepository(User);
        const user = await repository.findOne({ where: { email } });
        return !user;
    }

    defaultMessage(): string {
        return 'Email $value is already in use';
    }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUniqueConstraint,
        });
    };
}