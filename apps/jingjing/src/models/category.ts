import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export enum CategoryUpsertType {
    CREATE = 'create',
    EDIT = 'edit',
}

export interface CategoryCreate {
    name: string;
    description: string;
    slug?: string;
}

export interface CategoryEdit extends CategoryCreate {
    id: string;
}

export type CategoryUpsert = CategoryCreate | CategoryEdit;

export interface CategoryResponse extends mongoose.Document {
    name: string;
    description: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

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

categorySchema.plugin(uniqueValidator);

export default mongoose.models?.Category || mongoose.model('Category', categorySchema);
