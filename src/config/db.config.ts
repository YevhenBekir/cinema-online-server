import {ConfigService} from "@nestjs/config";
import {TypegooseModuleOptions} from "nestjs-typegoose";

export const getDatabaseConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => ({
    uri: configService.get('DB_URL')
});