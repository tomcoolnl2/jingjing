import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export type UpsetCategory = 'create' | 'update' | 'delete';

export interface CategoryBase {
    id: string;
    name: string;
    description: string;
    slug?: string;
}

export interface Category extends CategoryBase {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const categoriesategorySchema = new mongoose.Schema(
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

categoriesategorySchema.plugin(uniqueValidator);

export default mongoose.models.Category || mongoose.model('Category', categoriesategorySchema);
