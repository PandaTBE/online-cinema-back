import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { SetRatingDto } from './dto/set-rating.dto';

@Controller('ratings')
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    @Auth()
    @Get(':movieId')
    async getRatingByMovieAndUser(
        @User('id') userId: number,
        @Param('movieId') movieId: string,
    ) {
        return this.ratingService.getRatingByMovieAndUser(
            userId,
            Number(movieId),
        );
    }

    @UsePipes(new ValidationPipe())
    @Auth()
    @Post()
    async setRating(@User('id') userId: number, @Body() dto: SetRatingDto) {
        return this.ratingService.setRating(userId, dto);
    }
}
