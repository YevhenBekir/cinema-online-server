import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {TypegooseModule} from "nestjs-typegoose";

import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModel} from "../user/user.model";

@Module({
    imports: [
        TypegooseModule.forFeature([{   // Import model using Typegoose and naming it collection
            typegooseClass: UserModel,
            schemaOptions: {
                collection: "User"
            }
        }]),
        ConfigModule    // Import config module
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {
}
