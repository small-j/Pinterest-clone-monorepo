import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RoleService } from 'src/common/auth/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.email;
    const id = request.query.id;
    if (!email || !id) throw new ForbiddenException();

    const flag = await this.roleService.validate(
      context.getClass().toString(),
      email,
      id,
    );
    if (flag) return true;
    else throw new ForbiddenException();
  }
}
