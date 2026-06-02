import { 
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { SignupDto, SigninDto } from './dto';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { Tokens } from './types';
import { RtGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService){}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body(ZodValidationPipe) signupDto: SignupDto): Promise<Tokens> {
    return await this.authService.signup(signupDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body(ZodValidationPipe) signinDto: SigninDto): Promise<Tokens> {
    return await this.authService.signin(signinDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@GetCurrentUser('sub') id: number) {
    return await this.authService.logout(id);
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @GetCurrentUser('sub') id: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ) {
    return await this.authService.refresh(id, refreshToken);
  }
}
