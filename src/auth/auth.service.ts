import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SignupDto, SigninDto } from './dto';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor (
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<Tokens> {
    const { password } = signupDto;
    const hashedPassword = await argon.hash(password);

    const user = await this.databaseService.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
      },
    });

    const tokenId = crypto.randomUUID();
    const tokens = await this.generateTokens(user.id, tokenId);
    await this.createRefreshHash(user.id, tokens.refreshToken, tokenId);

    return tokens;
  }

  async signin(signinDto: SigninDto): Promise<Tokens> {
    const { password, email } = signinDto;
    const user = await this.databaseService.user.findUnique({ where: { email } });

    if (!user) throw new ForbiddenException('Access unauthorized');

    const { password: hashedPassword, id} = user;
    const passwordsMatch = await argon.verify(hashedPassword, password);

    if (!passwordsMatch) throw new ForbiddenException('Access unauthorized');

    const tokenId = crypto.randomUUID();
    const tokens = await this.generateTokens(id, tokenId);
    await this.createRefreshHash(id, tokens.refreshToken, tokenId);

    return tokens;
  }

  async logout(userId: number) {
    await this.databaseService.refresh_token.deleteMany({
      where: { user_id: userId },
    });

    return true;
  }

  async refresh(userId: number, rt: string) {
    const decoded = this.jwtService.decode(rt) as JwtPayload;

    if (!decoded || !decoded.jti) throw new ForbiddenException('Access unauthorized');

    const refreshToken = await this.databaseService.refresh_token.findUnique({
      where: { id: decoded.jti },
    });

    if (!refreshToken) throw new ForbiddenException('Access unauthorized');

    const tokensMatch = await argon.verify(refreshToken.token, rt);

    if (!tokensMatch) throw new ForbiddenException('Access unauthorized');

    if (refreshToken.is_used) {
      await this.logout(userId);
      throw new ForbiddenException('Access unauthorized');
    }

    await this.markRefreshUsed(refreshToken.id);

    const tokenId = crypto.randomUUID();
    const tokens = await this.generateTokens(userId, tokenId);
    
    await this.createRefreshHash(userId, tokens.refreshToken, tokenId);

    return tokens;
  }

  private async markRefreshUsed(tokenId: string) {
    await this.databaseService.refresh_token.update({
      where: { id: tokenId },
      data: {
        is_used: true,
      }
    });

    return true;
  }

  private async createRefreshHash(userId: number, refreshToken: string, tokenId: string) {
    const refreshHash = await argon.hash(refreshToken);

    await this.databaseService.refresh_token.create({
      data: {
        id: tokenId,
        user_id: userId,
        token: refreshHash,
      }
    });
  }

  private async generateTokens(userId: number, tokenId: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId }, { secret: process.env.AT_KEY ?? "", expiresIn: "10m" }),
      this.jwtService.signAsync({ sub: userId, jti: tokenId }, { secret: process.env.RT_KEY ?? "", expiresIn: "7d" })
    ]);

    return { accessToken, refreshToken };
  }
}