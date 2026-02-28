import z from "zod";
import { createZodDto } from "nestjs-zod";

export const createMessageSchema = z.object({
  type: z.enum(["text", "audio", "video"], "Invalid message type"),
  content: z.string().default(""),
  chatId: z.number("Invalid chat id"),
  senderId: z.number("Invalid sender id")
}).refine(data => (data.type !== "text") || (data.content.length > 0), {
  error: "Text messages must be at least one character long",
  path: ["content"]
});

export class CreateMessageDto extends createZodDto(createMessageSchema) {};