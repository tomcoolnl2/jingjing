import mongoose from "mongoose";


const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL is not defined");
    }
    return mongoose.connect(dbUrl, {
    });
}

export default dbConnect;