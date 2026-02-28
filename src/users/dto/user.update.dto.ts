import { createZodDto } from "nestjs-zod";
import { userCreateSchema } from "./users.create.dto";

const userUpdateSchema = userCreateSchema.partial();

export class UserUpdateDto extends createZodDto(userUpdateSchema) {}