import { Schema, Model, model } from "mongoose";

export interface GroupModel {
    name: string;
}

const groupsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
});

export const GroupsModel: Model<GroupModel> = model('Groups', groupsSchema);