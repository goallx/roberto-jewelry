import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";
import { makeAutoObservable } from "mobx";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ICategory {
  name: string;
  date?: string;
  numOfProducts?: number;
  description?: string;
  images: Array<UploadedImagesResponse>;
  _id: string;
}

export interface INewCategory {
  name: string;
  images?: Array<UploadedImagesResponse>;
}

export interface IUpdateCategory extends ICategory {}

export class CategoryStore {
  categories: Array<ICategory> | null = null;
  categoryToUpdate: ICategory | null = null;
  openUpdateCategoryModal: boolean = false;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async updateCategoryNumberOfProducts(categoryName: string, quantity: number) {
    try {
      if (!this.categories) {
        await this.fetchCategories();
      }

      const category = this.categories?.find(
        (cat) => cat.name.toLowerCase() === categoryName?.toLowerCase()
      );

      if (!category) {
        console.warn(`Category "${categoryName}" not found.`);
        return;
      }

      if (typeof category.numOfProducts !== "number") {
        console.error(
          `Category "${categoryName}" has an invalid numOfProducts value.`
        );
        return;
      }

      category.numOfProducts = (category.numOfProducts || 0) + quantity;
    } catch (error) {
      console.error(
        `Failed to update category "${categoryName}" with quantity ${quantity}:`,
        error
      );
    }
  }

  async getCategoryByName(catName: string): Promise<ICategory | null> {
    if (!this.categories) await this.fetchCategories();
    return (
      this.categories?.find(
        (cat) =>
          cat.name?.toLocaleLowerCase().trim() ===
          catName?.toLocaleLowerCase().trim()
      ) || null
    );
  }

  async categoryNameById(catId: string): Promise<string> {
    if (!this.categories) await this.fetchCategories();
    const categoryName = this.categories?.find(
      (category: ICategory) => category._id.toString() === catId
    );
    return categoryName?.name ?? "";
  }

  async refetchCategories(): Promise<void> {
    this.categories = null;
    await this.fetchCategories();
    return;
  }

  async getCategoriesNames(): Promise<string[]> {
    if (!this.categories) await this.fetchCategories();
    return this.categories?.map((cat) => cat.name) || [];
  }

  async fetchCategories(): Promise<void> {
    this.isLoading = true;
    if (this.categories) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/category`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        this.categories = data.categories;
      } else {
        this.categories = null;
      }
      return;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  async addCategory(
    newCategory: INewCategory,
    onSuccess: () => void,
    onFailure: (err?: string) => void
  ): Promise<void> {
    this.isLoading = true;
    try {
      const response = await fetch("/api/category/add", {
        method: "POST",
        body: JSON.stringify(newCategory),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        this.categories?.push(data.newCategory);
        onSuccess();
      } else {
        const errorData = await response.json();
        onFailure(errorData);
      }
    } catch (error) {
      onFailure();
    } finally {
      this.isLoading = false;
    }
  }

  async updateCategory(
    category: (INewCategory | ICategory) & { imagesToDelete: string[] },
    onFailure: (msg: string) => void
  ) {
    try {
      const response = await fetch("/api/category/update", {
        method: "PUT",
        body: JSON.stringify(category),
        credentials: "include",
        headers: {},
      });
      const data = await response.json();
      if (response.ok) {
        const { updatedCategory: updatedData } = data;
        if (!this.categories) {
          await this.fetchCategories();
          return;
        }
        const index = this.categories?.findIndex(
          (cat) => cat._id === updatedData._id
        );
        if (index > -1) {
          this.categories[index] = updatedData;
        }
        this.openUpdateCategoryModal = false;
        return;
      } else {
        onFailure("Something went wrong");
      }
    } catch (err: any) {
      onFailure(err.message || err);
    }
  }

  async deleteCategory(
    categoryId: string,
    onFailure: (message: string) => void
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/category/delete?id=${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        if (data.status === 204) {
          if (!this.categories) {
            await this.fetchCategories();
            return true;
          } else {
            this.categories = this.categories?.filter(
              (cat: ICategory) => cat._id !== categoryId
            );
            return true;
          }
        }
        return false;
      } else {
        console.log("@@here!!");
        onFailure(data.message ?? "Something went wrong!");
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  setCategoryToUpdate(category: ICategory) {
    this.categoryToUpdate = category;
  }

  setOpenUpdateCategoryModal(status: boolean) {
    this.openUpdateCategoryModal = status;
  }
}
