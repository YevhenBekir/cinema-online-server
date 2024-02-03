import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export class IdValidationPipe implements PipeTransform {
  // This pipe will validate '_userId' parameter when admin will update user's profile. Validate for ObjectId by MongoDB
  // Custom pipe must be implemented by PipeTransform and contain transform(value: string, metadata: ArgumentMetadata) {...}

  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value; // If '_userId !== param - return value to back

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid id format !'); // If value !== Types.ObjectId in MongoDB - throw exception
    }

    return value;
  }
}
