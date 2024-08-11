import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RoleService } from 'src/common/auth/role.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const id = request.query.id;
    if (!user || !id) throw new ForbiddenException();

    const flag = await this.roleService.validate(
      context.getClass().toString(),
      user,
      id,
    );
    if (flag) return true;
    else throw new ForbiddenException();
  }
}
