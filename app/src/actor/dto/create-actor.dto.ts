import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActorDto {
    @IsNotEmpty()
    @IsString({ message: 'Поле name должно быть строкой' })
    name: string;

    @IsNotEmpty()
    @IsString({ message: 'Поле slug должно быть строкой' })
    slug: string;

    @IsString({ message: 'Поле photo должно быть строкой' })
    photo: string;
}
