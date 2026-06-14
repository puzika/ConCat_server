import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { type JwtPayload } from "../types";
import type { Request } from "express";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor (){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['Access'] || null;
        }
      ]),
      secretOrKey: process.env.AT_KEY ?? "access-key",
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}