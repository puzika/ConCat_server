import z from "zod";
import { createZodDto } from "nestjs-zod";

const messageUpdateSchema = z.object({
  content: z.string().optional(),
});

export class MessageUpdateDto extends createZodDto(messageUpdateSchema) {};