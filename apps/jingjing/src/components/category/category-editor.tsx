'use client';
import React from 'react';
import { CategoryEdit, CategoryUpsert, CategoryUpsertType } from '@/models/category';
import { CategoriesApi } from '@/utils/api/api-categories';

interface CreateCategoryEditorProps {
    type: CategoryUpsertType.CREATE;
}

interface EditCategoryEditorProps {
    type: CategoryUpsertType.EDIT;
    category: CategoryEdit;
}

export type CategoryEditorProps = (CreateCategoryEditorProps | EditCategoryEditorProps) & {
    handleUpsertCategorySubmit: () => Promise<void>;
    handleResetEditingCategory: () => void;
};

const placeholderCategory: CategoryUpsert = {
    name: '',
    description: '',
};

export const CategoryEditor: React.FC<CategoryEditorProps> = (props) => {
    const { type } = props;
    const { current: categoriesApi } = React.useRef(CategoriesApi.getInstance());

    const category = React.useMemo(
        () => (type === CategoryUpsertType.EDIT ? props.category : placeholderCategory),
        [type],
    );
    console.log('CategoryEditor', { type, category });

    const [upsertCategory, dispatch] = React.useReducer(
        (state: CategoryUpsert, action: { type: string; payload: any }) => {
            switch (action.type) {
                case 'SET_NAME':
                    return { ...state, name: action.payload };
                case 'SET_DESCRIPTION':
                    return { ...state, description: action.payload };
                default:
                    return state;
            }
        },
        category,
    );

    React.useEffect(() => {
        dispatch({ type: 'SET_NAME', payload: category.name });
        dispatch({ type: 'SET_DESCRIPTION', payload: category.description });
    }, [category]);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
    }, []);

    const handleSubmit = React.useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            switch (type) {
                case CategoryUpsertType.CREATE:
                    await categoriesApi.createCategory(upsertCategory);
                    break;
                case CategoryUpsertType.EDIT:
                    await categoriesApi.updateCategory({ ...category, ...upsertCategory });
                    break;
            }
            await props.handleUpsertCategorySubmit();
        },
        [category, upsertCategory, type],
    );

    const text = React.useMemo(() => (type === CategoryUpsertType.CREATE ? 'Create' : 'Update'), [type]);

    return (
        <div>
            <h2>{`${text} Category`}</h2>
            <form className="mb-4" onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="text"
                    name="name"
                    value={upsertCategory.name}
                    onChange={handleChange}
                    placeholder="Category Name"
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="description"
                    value={upsertCategory.description}
                    onChange={handleChange}
                    placeholder="Category Description"
                    className="form-control mb-2"
                />
                <button type="submit" className="btn btn-primary btn-raised w-100">
                    {text}
                </button>
                {type === CategoryUpsertType.EDIT ? (
                    <button
                        type="button"
                        className="btn btn-danger btn-raised w-100 mt-2"
                        onClick={props.handleResetEditingCategory}
                    >
                        Cancel
                    </button>
                ) : null}
            </form>
        </div>
    );
};
