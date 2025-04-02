import { Category, CategoryEdit } from '@/models/category';

export interface Props {
    categories: Category[];
    handleSetEditingCategory: (category: CategoryEdit) => void;
    handleDeleteCategory: (id: string) => Promise<void>;
}

export const CategoryList: React.FC<Props> = ({ categories, handleSetEditingCategory, handleDeleteCategory }) => {
    return (
        <div className="">
            <h2>Categories</h2>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="card mb-2">
                        <div className="card-body">
                            <h5 className="card-title">{category.name}</h5>
                            <p className="card-text">{category.description}</p>
                            <button onClick={() => handleSetEditingCategory(category)} className="btn btn-primary">
                                Edit
                            </button>
                            <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-danger">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
