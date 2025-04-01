import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 20,
        },
        description: {
            type: String,
            default: '',
        },
    },
    { timestamps: true },
);

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
