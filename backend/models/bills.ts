import { Schema, Model, model, Types } from "mongoose";

export interface BillModel {
    group: Types.ObjectId;
    amount: number;
    description: string;
}

const billsSchema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Groups',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

export const BillsModel: Model<BillModel> = model('Bills', billsSchema);