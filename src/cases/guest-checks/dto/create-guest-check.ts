import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateGuestCheckDto {
  @IsUUID()
  SpotId: string;
}
