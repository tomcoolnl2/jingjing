import { Category, CategoryBase } from '@/models/category';

/**
 * The `CategoriesApi` class provides methods to interact with the categories API.
 * It follows the singleton pattern to ensure only one instance of the class exists.
 *
 * This class includes methods for performing CRUD operations on categories, such as:
 * - Fetching all categories
 * - Fetching a category by its ID
 * - Creating a new category
 * - Updating an existing category
 * - Deleting a category
 * - Replacing a category with new data
 *
 * Each method communicates with the API using the `fetch` function and handles
 * errors by throwing exceptions when the API response is not OK.
 *
 * @remarks
 * The API URL is retrieved from the `NEXT_PUBLIC_API_URL` environment variable.
 *
 * @example
 * ```typescript
 * const api = CategoriesApi.getInstance();
 * const categories = await api.getCategories();
 * console.log(categories);
 * ```
 */
class CategoriesApi {
    /**
     * Singleton instance of the `CategoriesApi` class.
     * Ensures that only one instance of the class is created and shared across the application.
     */
    private static instance: CategoriesApi;

    /**
     * The base URL for the API, retrieved from the environment variable `NEXT_PUBLIC_API_URL`.
     * This URL is used to make requests to the backend API.
     */
    private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL;

    /**
     * Private constructor to prevent instantiation of the class.
     * This ensures that the class can only be used as a static utility class.
     */
    private constructor() {}

    /**
     * Retrieves the singleton instance of the `CategoriesApi` class.
     * If the instance does not already exist, it initializes a new one.
     *
     * @returns {CategoriesApi} The singleton instance of the `CategoriesApi` class.
     */
    public static getInstance(): CategoriesApi {
        if (!CategoriesApi.instance) {
            CategoriesApi.instance = new CategoriesApi();
        }
        return CategoriesApi.instance;
    }

    /**
     * Fetches the list of categories from the API.
     *
     * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
     * @throws {Error} If the API request fails or returns a non-OK response.
     */
    public async getCategories(): Promise<Category[]> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category`, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data: Category[] = await response.json();
        return data;
    }

    /**
     * Fetches a category by its unique identifier.
     *
     * @param id - The unique identifier of the category to retrieve.
     * @returns A promise that resolves to the `Category` object.
     * @throws An error if the fetch operation fails or the response is not OK.
     */
    public async getCategoryById(id: string): Promise<Category> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${id}`, {
            method: 'GET',
            cache: 'no-store',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }
        return response.json();
    }

    /**
     * Creates a new category by sending a POST request to the API.
     *
     * @param data - The category data to create, excluding the `id` field.
     * @returns A promise that resolves to the created category object.
     * @throws An error if the API request fails.
     */
    public async createCategory(data: Omit<CategoryBase, 'id'>): Promise<Category> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create category');
        }
        return response.json();
    }

    /**
     * Updates an existing category with the specified data.
     *
     * @param data - A partial object containing the properties of the category to update.
     * @returns A promise that resolves to the updated category object.
     * @throws An error if the update operation fails.
     */
    public async updateCategory(category: Category): Promise<Category> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${category.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });
        if (!response.ok) {
            throw new Error('Failed to create category');
        }
        return response.json();
    }

    /**
     * Deletes a category by its ID.
     *
     * @param id - The unique identifier of the category to delete.
     * @returns A promise that resolves when the category is successfully deleted.
     * @throws An error if the deletion request fails.
     */
    public async deleteCategory(id: string): Promise<void> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete category');
        }
        return response.json();
    }

    /**
     * Replaces an existing category with new data.
     *
     * @param id - The unique identifier of the category to be replaced.
     * @param data - A partial object containing the updated properties of the category.
     * @returns A promise that resolves to the updated category object.
     * @throws An error if the request to replace the category fails.
     */
    public async replaceCategory(id: string, data: Partial<CategoryBase>): Promise<Category> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to replace category');
        }
        return response.json();
    }
}

export default CategoriesApi;
