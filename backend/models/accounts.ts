import { Schema, Model, model, Types } from "mongoose";

export interface AccountModel {
    group: Types.ObjectId;
    user: Types.ObjectId;
}

const accountsShema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Groups',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    }
});

export const AccountsModel: Model<AccountModel> = model('Accounts', accountsShema);