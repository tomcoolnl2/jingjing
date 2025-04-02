'use client';
import React from 'react';
import { Category, CategoryBase } from '@/models/category';
import CategoriesApi from '@/utils/api/api-categories';

interface CreateCategoryEditorProps {
    type: 'create';
}

interface EditCategoryEditorProps {
    type: 'edit';
    category: Category;
}

export type CategoryEditorProps = CreateCategoryEditorProps | EditCategoryEditorProps;

export const CategoryEditor: React.FC<CategoryEditorProps> = (props) => {
    const { type } = props;
    const category = type === 'edit' ? props.category : { name: '', description: '', slug: '' };

    const { current: categoriesApi } = React.useRef(CategoriesApi.getInstance());

    const [newCategory, dispatch] = React.useReducer((state: Omit<CategoryBase, 'id'>, action: any) => {
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
                case 'create':
                    await categoriesApi.createCategory(newCategory);
                    break;
                // case 'edit':
                //     await categoriesApi.updateCategory({newCategory);
                //     break;
            }
        },
        [newCategory, type],
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
