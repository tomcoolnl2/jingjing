import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 20,
        },
        email: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
            unique: true,
            minLength: 5,
            maxLength: 20,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        image: {
            type: String,
            default: 'https://via.placeholder.com/150',
        },
        resetCode: {
            data: String,
            expiresAt: {
                type: Date,
                default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 mins
            },
        },
    },
    { timestamps: true },
);

userSchema.plugin(uniqueValidator);

export default mongoose.models?.User || mongoose.model('User', userSchema);
