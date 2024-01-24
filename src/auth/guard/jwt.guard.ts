import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {} // This is guard/middleware for check user to auth. This class is AuthGuard instance.
