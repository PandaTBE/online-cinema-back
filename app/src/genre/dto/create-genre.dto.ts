import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
    @IsNotEmpty()
    @IsString({ message: 'Поле name должно быть строкой' })
    name: string;

    @IsNotEmpty()
    @IsString({ message: 'Поле slug должно быть строкой' })
    slug: string;

    @IsNotEmpty()
    @IsString({ message: 'Поле description должно быть строкой' })
    description: string;

    @IsNotEmpty()
    @IsString({ message: 'Поле icon должно быть строкой' })
    icon: string;
}
