import { Category, CategoryResponse, CategoryCreate, CategoryEdit } from '@/models/category';
import { StatusCodes } from 'http-status-codes';

/**
 * The `CategoriesApiResponseStatus` enum represents the possible statuses of the categories API response.
 * It can either be a success or an error.
 *
 * @enum {string}
 * @property {string} SUCCESS - Indicates a successful response from the API.
 * @property {string} ERROR - Indicates an error response from the API.
 */
export enum CategoriesApiResponseStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}

/**
 * The `CategoriesApiResponseSuccess` type represents a successful response from the categories API.
 * It includes a status indicating success and the data returned from the API.
 *
 * @template T - The type of data returned in the success response.
 * @property {CategoriesApiResponseStatus.SUCCESS} status - Indicates a successful response.
 * @property {T} data - The data returned in the response.
 */
interface CategoriesApiResponseSuccess<T> {
    status: CategoriesApiResponseStatus.SUCCESS;
    data: T;
}

/**
 * The `CategoriesApiResponseError` type represents an error response from the categories API.
 * It includes a status indicating the error and a message describing the error.
 *
 * @property {CategoriesApiResponseStatus.ERROR} status - Indicates an error response.
 * @property {string} message - The error message returned in the response.
 */
interface CategoriesApiResponseError {
    status: CategoriesApiResponseStatus.ERROR;
    message: string;
}

/**
 * The `CategoriesApiResponse` type represents the possible responses from the categories API.
 * It can either be a success response containing the data or an error response with a message.
 *
 * @template T - The type of data returned in the success response.
 * @property {CategoriesApiResponseStatus.SUCCESS} status - Indicates a successful response.
 * @property {T} data - The data returned in the response.
 * @property {CategoriesApiResponseStatus.ERROR} status - Indicates an error response.
 * @property {string} message - The error message returned in the response.
 *
 * @example
 * const response: CategoriesApiResponse<Category[]> = {
 *     status: CategoriesApiResponseStatus.SUCCESS,
 *     data: [
 *         { id: '1', name: 'Category 1', description: 'Description 1' },
 *         { id: '2', name: 'Category 2', description: 'Description 2' },
 *     ],
 * };
 *
 * const errorResponse: CategoriesApiResponse<null> = {
 *     status: CategoriesApiResponseStatus.ERROR,
 *     message: 'An error occurred while fetching categories.',
 * };
 */
export type CategoriesApiResponse<T> = CategoriesApiResponseSuccess<T> | CategoriesApiResponseError;

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
export class CategoriesApi {
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
     * Handles the API response and returns a structured response object.
     * It checks the response status and parses the JSON data accordingly.
     * If the response is successful, it returns the data; otherwise, it returns an error message.
     *
     * @param response - The response object from the fetch request.
     * @returns {Promise<CategoriesApiResponse<T>>} A promise that resolves to a structured response object.
     * @throws {Error} If the response status is unexpected or if the JSON parsing fails.
     */
    private async handleApiResponse<T>(response: Response): Promise<CategoriesApiResponse<T>> {
        const data = await response.json().catch(() => null);
        const errorMessage = `${response.status} - ${data?.error || response.statusText || 'An unknown error occurred'}`;

        switch (response.status) {
            case StatusCodes.NO_CONTENT:
                return {} as CategoriesApiResponse<T>;

            case StatusCodes.OK:
            case StatusCodes.CREATED:
                return {
                    status: CategoriesApiResponseStatus.SUCCESS,
                    data: Array.isArray(data)
                        ? data.map(this.normalizeCategoryResponse)
                        : this.normalizeCategoryResponse(data),
                } as CategoriesApiResponse<T>;

            case StatusCodes.BAD_REQUEST:
            case StatusCodes.UNAUTHORIZED:
            case StatusCodes.FORBIDDEN:
            case StatusCodes.NOT_FOUND:
                return {
                    status: CategoriesApiResponseStatus.ERROR,
                    message: errorMessage,
                } as CategoriesApiResponse<T>;

            default:
                throw new Error(`Unexpected response status: ${errorMessage}`);
        }
    }

    /**
     * Normalizes the category response.
     *
     * @param {CategoryResponse} category - The category response object from the API.
     * @returns {Category} The normalized category object with the `id` field.
     */
    private normalizeCategoryResponse({ _id, ...category }: CategoryResponse): Category {
        return {
            id: _id,
            ...category,
        };
    }

    /**
     * Fetches the list of categories from the API.
     *
     * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
     * @throws {Error} If the API request fails or returns a non-OK response.
     */
    public async getCategories(): Promise<CategoriesApiResponse<Category[]>> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category`, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
        });
        return this.handleApiResponse(response);
    }

    /**
     * Fetches a category by its unique identifier.
     *
     * @param id - The unique identifier of the category to retrieve.
     * @returns A promise that resolves to the `Category` object.
     * @throws An error if the fetch operation fails or the response is not OK.
     */
    public async getCategoryById(id: string): Promise<CategoriesApiResponse<Category>> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${id}`, {
            method: 'GET',
            cache: 'no-store',
        });
        return this.handleApiResponse<Category>(response);
    }

    /**
     * Creates a new category by sending a POST request to the API.
     *
     * @param data - The category data to create, excluding the `id` field.
     * @returns A promise that resolves to the created category object.
     * @throws An error if the API request fails.
     */
    public async createCategory(data: CategoryCreate): Promise<CategoriesApiResponse<Category>> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await this.handleApiResponse(response);
    }

    /**
     * Updates an existing category with the specified data.
     *
     * @param data - A partial object containing the properties of the category to update.
     * @returns A promise that resolves to the updated category object.
     * @throws An error if the update operation fails.
     */
    public async updateCategory(category: Partial<CategoryEdit>): Promise<CategoriesApiResponse<Category>> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${category.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });
        return this.handleApiResponse(response);
    }

    /**
     * Deletes a category by its ID.
     *
     * @param id - The unique identifier of the category to delete.
     * @returns A promise that resolves when the category is successfully deleted.
     * @throws An error if the deletion request fails.
     */
    public async deleteCategory(id: string): Promise<CategoriesApiResponse<void>> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${id}`, {
            method: 'DELETE',
        });
        return this.handleApiResponse(response);
    }

    /**
     * Replaces an existing category with new data.
     *
     * @param id - The unique identifier of the category to be replaced.
     * @param data - A partial object containing the updated properties of the category.
     * @returns A promise that resolves to the updated category object.
     * @throws An error if the request to replace the category fails.
     */
    public async replaceCategory(id: string, data: CategoryEdit): Promise<CategoriesApiResponse<Category>> {
        const response = await fetch(`${CategoriesApi.API_URL}/admin/category/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return this.handleApiResponse(response);
    }
}
