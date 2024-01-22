import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypegooseModule} from "nestjs-typegoose";

import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModel} from "../user/user.model";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";

import {getJwtConfig} from "../config/jwt.config";

@Module({
    imports: [
        TypegooseModule.forFeature([{   // Import model using Typegoose and naming it collection
            typegooseClass: UserModel,
            schemaOptions: {
                collection: "User"
            }
        }]),
        ConfigModule,    // Import config module
        JwtModule.registerAsync({   // Import JwtModule for setup jwt auth
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJwtConfig
        })
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {
}
