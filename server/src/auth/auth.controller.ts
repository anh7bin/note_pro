import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDTO } from '../user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleAuth(
    @Body() body: UserDTO,
    @Headers('x-internal-auth-secret') internalAuthSecret?: string,
  ): Promise<{
    token: string;
  }> {
    const expectedSecret = process.env.INTERNAL_AUTH_SECRET;

    if (!expectedSecret || internalAuthSecret !== expectedSecret) {
      throw new UnauthorizedException('Invalid internal authentication');
    }

    try {
      return await this.authService.handleGoogleAuth(body);
    } catch (error) {
      console.error('Google auth error:', error);
      throw new Error(
        `Failed to authenticate with Google: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
