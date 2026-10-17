import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if(!DB_URI) {
    throw new Error('Please define the DB_URI environment variable inside your .env.<environment>.local file or hosting dashboard (e.g., Render/Vercel)');
}

//Connect to DB

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);

        console.log(`Connected to database in ${NODE_ENV} mode`)
    }
    catch(error){
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
}

export default connectToDatabase