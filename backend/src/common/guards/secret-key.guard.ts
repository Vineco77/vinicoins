import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      body?: Record<string, unknown>;
      query?: Record<string, unknown>;
    }>();

    const providedSecretKey = this.extractSecretKey(request);
    const expectedSecretKey =
      this.configService.get<string>('SECRET_KEY') ?? 'Vinicius_Ribeiro';

    if (providedSecretKey !== expectedSecretKey) {
      throw new UnauthorizedException('Invalid secret_key');
    }

    return true;
  }

  private extractSecretKey(request: {
    headers: Record<string, string | string[] | undefined>;
    body?: Record<string, unknown>;
    query?: Record<string, unknown>;
  }): string | undefined {
    const headerValue =
      request.headers['x-secret-key'] ?? request.headers.secret_key;
    const bodyValue = request.body?.secret_key;
    const queryValue = request.query?.secret_key;

    return (
      this.normalizeCandidate(headerValue) ??
      this.normalizeCandidate(bodyValue) ??
      this.normalizeCandidate(queryValue)
    );
  }

  private normalizeCandidate(value: unknown): string | undefined {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const firstValue = value[0];

      return typeof firstValue === 'string' ? firstValue : undefined;
    }

    return undefined;
  }
}
