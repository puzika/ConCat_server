import { UnauthorizedException, Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { type Request } from "express";
import { type JwtPayload } from "../types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor () {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['Refresh'] || null;
        }
      ]),
      secretOrKey: process.env.RT_KEY ?? "refresh-key",
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayload) {
    const refreshToken = request.cookies?.['Refresh'];

    if (!refreshToken) throw new UnauthorizedException('Access unauthorized');

    return {
      ...payload,
      refreshToken
    }
  }
}