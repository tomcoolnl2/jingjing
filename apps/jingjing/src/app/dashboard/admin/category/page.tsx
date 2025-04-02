import { CategoryList, CategoryEditor } from '@/components';
import CategoriesApi from '@/utils/api/api-categories';

export default async function AdminCategoriesPage() {
    const categories = await CategoriesApi.getInstance().getCategories();
    return (
        <div className="container">
            <h1>Admin Categories Page</h1>
            <br />
            <br />
            <CategoryEditor type="create" />
            <br />
            <br />
            <CategoryList categories={categories} />
        </div>
    );
}
