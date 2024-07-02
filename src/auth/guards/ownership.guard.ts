import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const entityId = request.params.id;
    const entityService = this.reflector.get<any>(
      'entityService',
      context.getHandler(),
    );

    if (!user || !entityId || !entityService) {
      throw new UnauthorizedException();
    }

    const entity = await context
      .switchToHttp()
      .getRequest()
      .app.get(entityService)
      .findOne(Number(entityId));
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.user.id !== user.sub) {
      throw new UnauthorizedException(
        'You are not allowed to access this entity',
      );
    }

    return true;
  }
}
