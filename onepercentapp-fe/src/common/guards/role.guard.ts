import {Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {InjectRepository} from "@nestjs/typeorm";
import {Role} from "../../modules/user/entities/role.entity";
import {Repository} from "typeorm";

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(
        private reflector: Reflector,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (user.roleId == 1){return true;}
        const role = await this.roleRepository.findOne({where: {id: user.roleId}});
        if (!role){
            throw new ForbiddenException('The user has not role configured.');
        }
        if (!user || !requiredRoles.includes(role.name)) {
            throw new ForbiddenException('You do not have permission to access this route. (Roles)');
        }
        return true;
    }
}