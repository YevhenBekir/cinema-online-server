import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { DataType } from '../../user/user.interface';

export const User = createParamDecorator((data: DataType, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user = request.user;

  return data ? user[data] : user;
});

// This is custom decorator which help in get http request data (like a param) in method in controller, for example:
// This -> 'async getById(@Param('id') id: string)' will be equal to this -> 'async getById(@User('_id') id: string)'
// But i can get '_id', 'email', 'name' and each of all keys from UserModel
