import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { type JwtPayload } from "../types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor (){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AT_KEY ?? "access-key",
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}