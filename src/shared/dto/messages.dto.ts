import z from "zod";
import { createZodDto } from "nestjs-zod";

export const messageCreateSchema = z.object({
  type: z.enum(["text", "audio", "video"], "Invalid message type"),
  content: z.string().default(""),
  client_id: z.string().nullable().optional(),
  chat_id: z.number("Invalid chat id"),
  sender_id: z.number("Invalid sender id"),
  parent_message_id: z.number().nullable().optional(),
}).refine(data => (data.type !== "text") || (data.content.length > 0), {
  error: "Text messages must be at least one character long",
  path: ["content"]
});

export class MessageDto extends createZodDto(messageCreateSchema) {};