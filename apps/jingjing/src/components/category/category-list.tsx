import { Category } from '@/models/category';

export interface Props {
    categories: Category[];
}

export const CategoryList: React.FC<Props> = ({ categories }) => {
    return (
        <div className="">
            <h2>Categories</h2>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="card mb-2">
                        <div className="card-body">
                            <h5 className="card-title">{category.name}</h5>
                            <p className="card-text">{category.description}</p>
                            <a href="#" className="btn btn-primary">
                                Edit
                            </a>
                            <a href="#" className="btn btn-danger">
                                Delete
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
