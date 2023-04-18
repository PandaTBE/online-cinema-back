import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
    @IsEmail(
        {},
        {
            message: 'Вы ввели некорректный email',
        },
    )
    email: string;

    @MinLength(6, {
        message: 'Минимальная длина пароля должны быть 6 символов',
    })
    @IsString({
        message: 'Пароль должен быть строкой',
    })
    password: string;
}
