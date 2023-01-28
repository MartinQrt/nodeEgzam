import mongoose from "mongoose";

const mongoDB = process.env.DB_CONNECTION_STRING;
mongoose.set('strictQuery', false);

export const connectToDb = async () => {
    await mongoose.connect(mongoDB).then(async () =>{ 
        console.log('Connected to database')
    });
}