import z from "zod";
import { createZodDto } from "nestjs-zod";

const newMessageSchema = z.object({
  message: z.string().trim().min(1, { message: "Message cannot be empty" }),
  chatId: z.number(),
});

export class NewMessageDto extends createZodDto(newMessageSchema) {};