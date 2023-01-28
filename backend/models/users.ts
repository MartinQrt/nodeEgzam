import { Schema, Model, model, Types } from "mongoose";

export interface UserModel {
    full_name: string;
    email: string;
    password: string;
    reg_timestamp: string;
}

const usersSchema = new Schema({
    full_name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: false,
    },
    reg_timestamp: {
        type: String,
        required: true,
    }
});

export const UserModel: Model<UserModel> = model('Users', usersSchema);