import dotenv from 'dotenv';
import Redis from 'ioredis';
dotenv.config({
    path: './.env'
});
import connectDB from './db/dbConnect.js';
import app from "./app.js"


connectDB().then(()=>{
    app.listen(process.env.PORT , ()=>
       { console.log(`Server is running on the port : ${process.env.PORT}`)}
    )
})
.catch((err)=>{
    console.log("DB connection failed")
})
export const redis = new Redis(process.env.REDIS_URL); // Named export

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (error) => {
    console.error('Redis error:', error)
});

