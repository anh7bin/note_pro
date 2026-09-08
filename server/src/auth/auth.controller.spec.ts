import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  const originalSecret = process.env.INTERNAL_AUTH_SECRET;
  const user = {
    name: 'Test User',
    email: 'user@example.com',
    avatar_url: 'https://example.com/avatar.png',
  };
  const handleGoogleAuth = jest.fn();
  const authService = { handleGoogleAuth } as unknown as AuthService;
  const controller = new AuthController(authService);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.INTERNAL_AUTH_SECRET = 'test-internal-secret';
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.INTERNAL_AUTH_SECRET;
    } else {
      process.env.INTERNAL_AUTH_SECRET = originalSecret;
    }
  });

  it('rejects requests without the internal secret', async () => {
    await expect(controller.googleAuth(user)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(handleGoogleAuth).not.toHaveBeenCalled();
  });

  it('issues a token for an authenticated internal request', async () => {
    handleGoogleAuth.mockResolvedValue({ token: 'signed-token' });

    await expect(
      controller.googleAuth(user, 'test-internal-secret'),
    ).resolves.toEqual({ token: 'signed-token' });
    expect(handleGoogleAuth).toHaveBeenCalledWith(user);
  });
});
