'use client';
import React from 'react';
import { CategoryEdit, CategoryUpset, CategoryUpsetType } from '@/models/category';
import { CategoriesApi } from '@/utils/api/api-categories';

interface CreateCategoryEditorProps {
    type: CategoryUpsetType.CREATE;
}

interface EditCategoryEditorProps {
    type: CategoryUpsetType.EDIT;
    category: CategoryEdit;
}

export type CategoryEditorProps = (CreateCategoryEditorProps | EditCategoryEditorProps) & {
    handleUpsetCategory: () => Promise<void>
};

const placeholder: CategoryUpset = { 
    name: 'New Category', 
    description: 'New Category Description'
}

export const CategoryEditor: React.FC<CategoryEditorProps> = (props) => {

    const { type } = props;
    const category: CategoryUpset = type === CategoryUpsetType.EDIT 
        ? props.category 
        : placeholder;

    const { current: categoriesApi } = React.useRef(CategoriesApi.getInstance());

    const [formattedCategory, dispatch] = React.useReducer((state: CategoryUpset, action: { type: string; payload: any }) => {
        switch (action.type) {
            case 'SET_NAME':
                return { ...state, name: action.payload };
            case 'SET_DESCRIPTION':
                return { ...state, description: action.payload };
            default:
                return state;
        }
    }, category);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
    };

    const handleSubmit = React.useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            switch (type) {
                case CategoryUpsetType.CREATE:
                    await categoriesApi.createCategory(formattedCategory);
                    break;
                case CategoryUpsetType.EDIT:
                    await categoriesApi.updateCategory(formattedCategory);
                    break;
            }
            await props.handleUpsetCategory();
        },
        [formattedCategory, type],
    );

    return (
        <div>
            <h2>{`${type === 'create' ? 'Create a' : 'Update'} Category`}</h2>
            <form className="mb-4" onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="text"
                    name="name"
                    value={category.name}
                    onChange={handleChange}
                    placeholder="Category Name"
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="description"
                    value={category.description}
                    onChange={handleChange}
                    placeholder="Category Description"
                    className="form-control mb-2"
                />
                <button type="submit" className="btn btn-primary btn-raised w-100">
                    {`${type === 'create' ? 'Create' : 'Update'} Category`}
                </button>
            </form>
        </div>
    );
};
