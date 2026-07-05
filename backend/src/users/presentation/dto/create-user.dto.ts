import { Type } from 'class-transformer';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 20 })
  @Min(0)
  viniCoins: number;
}
