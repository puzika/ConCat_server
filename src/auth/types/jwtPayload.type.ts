export type JwtPayload = {
  sub: number,
  jti?: string,
  refreshToken?: string,
}