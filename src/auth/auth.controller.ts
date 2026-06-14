import { 
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { SignupDto, SigninDto } from './dto';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import type { Tokens } from './types';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService){}

  private setCookies(response: Response, tokens: Tokens) {
    const { accessToken, refreshToken } = tokens;

    response.cookie('Access', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 10,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body(ZodValidationPipe) signupDto: SignupDto
  ) {
    const refreshToken = request.cookies?.['Refresh'] ?? undefined;
    const { tokens, user } = await this.authService.signup(signupDto, refreshToken);
    const { password, ...userData } = user;

    this.setCookies(response, tokens);

    return userData;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body(ZodValidationPipe) signinDto: SigninDto
  ) {
    const refreshToken = request.cookies?.['Refresh'] ?? undefined;
    const { tokens, user } = await this.authService.signin(signinDto, refreshToken);
    const { password, ...userData} = user;

    this.setCookies(response, tokens);

    return userData;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @GetCurrentUser('sub') id: number
  ) {
    await this.authService.logout(id);

    response.clearCookie('Access', { path: '/' });
    response.clearCookie('Refresh', { path: '/auth/refresh' });
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @GetCurrentUser('sub') id: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ) {
    const tokens = await this.authService.refresh(id, refreshToken);
    this.setCookies(response, tokens);
  }
}
