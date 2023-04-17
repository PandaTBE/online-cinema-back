import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNumberOfViewsDto {
    @IsNotEmpty()
    @IsString({ message: 'Поле slug должно быть строкой' })
    slug: string;
}
