import { IsNotEmpty, IsNumber } from 'class-validator';

export class SetRatingDto {
    @IsNotEmpty()
    @IsNumber({}, { message: 'Поле movieId должно быть числом' })
    movieId: number;

    @IsNotEmpty()
    @IsNumber({}, { message: 'Поле rating должно быть числом' })
    rating: number;
}
