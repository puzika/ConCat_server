import { ForbiddenException, Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { type Request } from "express";
import { type JwtPayload } from "../types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor () {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RT_KEY ?? "refresh-key",
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayload) {
    const refreshToken = request?.
      get('authorization')?.
      replace('Bearer', '').
      trim();

    if (!refreshToken) throw new ForbiddenException('Access unauthorized');

    return {
      ...payload,
      refreshToken
    }
  }
}