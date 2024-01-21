import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses";
import {prop} from "@typegoose/typegoose";

export interface UserModel extends Base {   // Model with the same name will extend this interface, this interface extends base for set '_id' field to collection from model
}

export class UserModel extends TimeStamps { // This model extends interface above and TimeStamps
    @prop({unique: true})   // Ability to set settings for a value in a collection
    email: string;

    @prop()
    name: string;

    @prop()
    password: string;

    @prop({default: false})
    isAdmin?: boolean

    @prop({default: []})
    favorites?: [];
}