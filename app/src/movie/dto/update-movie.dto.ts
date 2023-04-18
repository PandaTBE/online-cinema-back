import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { MovieParameters } from './create-movie.dto';

export class UpdateMovieDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString({ message: 'Поле slug должно быть строкой' })
    slug: string;

    @IsOptional()
    @IsString({ message: 'Поле poster должно быть строкой' })
    poster: string;

    @IsOptional()
    @IsString({ message: 'Поле bigPoster должно быть строкой' })
    bigPoster: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString({ message: 'Поле title должно быть строкой' })
    title: string;

    @IsOptional()
    @IsString({ message: 'Поле videoUrl должно быть строкой' })
    videoUrl: string;

    @IsOptional()
    @IsObject({ message: 'Поле parameters должно быть объектом' })
    parameters: MovieParameters;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    actors: number[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    genres: number[];
}
