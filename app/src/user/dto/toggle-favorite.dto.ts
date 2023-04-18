import { IsNotEmpty, IsNumber } from 'class-validator';

export class ToggleFavoriteDto {
    @IsNotEmpty()
    @IsNumber()
    movieId: number;
}
