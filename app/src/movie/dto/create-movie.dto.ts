import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
} from 'class-validator';

export class MovieParameters {
    @IsNumber({}, { message: 'Поле year должно быть числом' })
    year: number;

    @IsNumber({}, { message: 'Поле duration должно быть числом' })
    duration: number;

    @IsString({ message: 'Поле country должно быть строкой' })
    country: string;
}
export class CreateMovieDto {
    @IsNotEmpty()
    @IsString({ message: 'Поле slug должно быть строкой' })
    slug: string;

    @IsString({ message: 'Поле poster должно быть строкой' })
    poster: string;

    @IsString({ message: 'Поле bigPoster должно быть строкой' })
    bigPoster: string;

    @IsNotEmpty()
    @IsString({ message: 'Поле title должно быть строкой' })
    title: string;

    @IsString({ message: 'Поле videoUrl должно быть строкой' })
    videoUrl: string;

    @IsObject({ message: 'Поле parameters должно быть объектом' })
    parameters: MovieParameters;

    @IsArray()
    @IsNumber({}, { each: true })
    actors: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    genres: number[];
}
