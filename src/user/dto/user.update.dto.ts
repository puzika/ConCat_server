import { createZodDto } from "nestjs-zod";
import { userCreateSchema } from "./user.create.dto";

const userUpdateSchema = userCreateSchema.partial();

export class UserUpdateDto extends createZodDto(userUpdateSchema) {}