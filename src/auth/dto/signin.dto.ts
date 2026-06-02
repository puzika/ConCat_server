import z from "zod";
import { createZodDto } from "nestjs-zod";

export const signinSchema = z.object({
  email: z
    .email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export class SigninDto extends createZodDto(signinSchema) {};