'use client';
import React from 'react';
import { CategoryList, CategoryEditor } from '@/components';
import { CategoryUpsertType, Category, CategoryEdit } from '@/models/category';
import { CategoriesApi } from '@/utils/api/api-categories';

export default function AdminCategoriesPage() {
    const { current: categoriesApi } = React.useRef(CategoriesApi.getInstance());
    const [loading, setLoading] = React.useState<boolean>(false);
    // const [error, setError] = React.useState<Error | null>(null);
    const [categoryUpsetType, setCategoryUpsetType] = React.useState(CategoryUpsertType.CREATE);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = React.useState<CategoryEdit | null>(null);

    React.useEffect(() => {
        const abortController = new AbortController();
        fetchCategories();
        return () => {
            abortController.abort();
        };
    }, []);

    const fetchCategories = React.useCallback(async () => {
        setLoading(true);
        const response = await categoriesApi.getCategories().finally(() => setLoading(false));
        if (response.status === 'error') {
            throw new Error(response.message); // TODO: show toast
        }
        setCategories(response.data);
    }, []);

    const handleUpsertCategorySubmit = React.useCallback(async () => {
        await fetchCategories();
        handleResetEditingCategory();
    }, []);

    const handleResetEditingCategory = React.useCallback(() => {
        setCategoryUpsetType(CategoryUpsertType.CREATE);
        setEditingCategory(null);
    }, []);

    const handleSetEditingCategory = React.useCallback((category: CategoryEdit) => {
        setCategoryUpsetType(CategoryUpsertType.EDIT);
        setEditingCategory(category);
    }, []);

    const handleDeleteCategory = React.useCallback(async (id: string) => {
        const response = await categoriesApi.deleteCategory(id);
        if (response.status === 'error') {
            throw new Error(response.message); // TODO: show toast
        }
        handleResetEditingCategory();
        await fetchCategories();
    }, []);

    return (
        <div className="container">
            <h1>Admin Categories Page</h1>
            <br />
            {categoryUpsetType === CategoryUpsertType.EDIT && editingCategory ? (
                <CategoryEditor
                    type={CategoryUpsertType.EDIT}
                    category={editingCategory}
                    handleUpsertCategorySubmit={handleUpsertCategorySubmit}
                    handleResetEditingCategory={handleResetEditingCategory}
                />
            ) : (
                <CategoryEditor
                    type={CategoryUpsertType.CREATE}
                    handleUpsertCategorySubmit={handleUpsertCategorySubmit}
                    handleResetEditingCategory={handleResetEditingCategory}
                />
            )}
            <br />
            <br />
            {loading ? (
                'Loading...'
            ) : (
                <CategoryList
                    categories={categories}
                    handleSetEditingCategory={handleSetEditingCategory}
                    handleDeleteCategory={handleDeleteCategory}
                />
            )}
        </div>
    );
}
