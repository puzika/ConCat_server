import z from "zod";
import { createZodDto } from "nestjs-zod";

const chatsCreateSchema = z.object({
  participant_one_id: z.number('Invalid participant id'),
  participant_two_id: z.number('Invalid participant id'),
});

export class ChatsCreateDto extends createZodDto(chatsCreateSchema) {};