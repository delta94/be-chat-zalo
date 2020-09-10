import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  theaterId: string;

  @IsNotEmpty()
  content: string;
}
