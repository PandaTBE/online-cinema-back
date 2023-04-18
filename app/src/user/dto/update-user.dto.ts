export class UpdateUserDto {
    email?: string;

    password?: string;
}

export class AdminUpdateUserDto extends UpdateUserDto {
    isAdmin?: boolean;

    roles?: string[];
}
