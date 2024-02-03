import { Body, Controller, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { SetRatingDto } from './dto/setRating.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { UserModel } from 'src/user/user.model';
import { User } from 'src/user/decorators/user.decorator';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/total')
  async getRating() {
    return await this.ratingService.getRating();
  }

  @Get('/:movieId')
  @Auth()
  async getMovieToUserRating(
    @User() user: UserModel,
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
  ) {
    return await this.ratingService.getMovieToUserRating(user._id, movieId);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  async update(@User() user: UserModel, @Body() dto: SetRatingDto) {
    return await this.ratingService.update(user._id, dto);
  }
}
