import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsNotEmpty({
        message: 'Refresh token не может быть пуст',
    })
    @IsString({
        message: 'Refresh token должен быть строкой',
    })
    refreshToken: string;
}
