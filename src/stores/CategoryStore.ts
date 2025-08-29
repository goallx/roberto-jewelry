import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";
import { makeAutoObservable } from "mobx";
import { supabase as supabaseClient } from "@/lib/supabaseClient";

export interface ICategory {
  name: string;
  description?: string;
  numOfProducts?: number;
  images: Array<UploadedImagesResponse>;
  created_at?: string;
  id: string;
}

export interface INewCategory {
  name: string;
  description?: string;
  images?: Array<UploadedImagesResponse>;
}

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
      if (!this.categories) await this.fetchCategories();

      const category = this.categories?.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (!category) return;

      const newCount = (category.numOfProducts || 0) + quantity;

      // Update locally
      category.numOfProducts = newCount;

      // Persist in Supabase
      const { error } = await supabaseClient
        .from("categories")
        .update({ numOfProducts: newCount })
        .eq("name", categoryName);

      if (error)
        console.error("Failed to update category count:", error.message);
    } catch (err) {
      console.error("Error updating category count:", err);
    }
  }
  // -----------------------------
  // FETCH CATEGORIES
  // -----------------------------
  async fetchCategories(): Promise<void> {
    this.isLoading = true;
    try {
      const { data, error } = await supabaseClient
        .from("categories")
        .select("*");
      if (error) {
        console.error("Error fetching categories:", error);
        this.categories = null;
      } else {
        this.categories = data;
      }
    } catch (err) {
      console.error("Unexpected error fetching categories:", err);
      this.categories = null;
    } finally {
      this.isLoading = false;
    }
  }

  // -----------------------------
  // GET CATEGORY BY ID OR NAME
  // -----------------------------
  async getCategoryById(id: string): Promise<ICategory | null> {
    if (!this.categories) await this.fetchCategories();
    return this.categories?.find((c) => c.id === id) || null;
  }

  async getCategoryByName(name: string): Promise<ICategory | null> {
    if (!this.categories) await this.fetchCategories();
    return (
      this.categories?.find(
        (c) => c.name.toLowerCase().trim() === name.toLowerCase().trim()
      ) || null
    );
  }

  async getCategoriesNames(): Promise<string[]> {
    if (!this.categories) await this.fetchCategories();
    return this.categories?.map((c) => c.name) || [];
  }

  // -----------------------------
  // ADD CATEGORY
  // -----------------------------
  async addCategory(
    newCategory: INewCategory,
    onSuccess: () => void,
    onFailure: (err?: string) => void
  ): Promise<void> {
    this.isLoading = true;
    try {
      const { data, error } = await supabaseClient
        .from("categories")
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        onFailure(error.message);
      } else {
        if (!this.categories) this.categories = [];
        this.categories.push(data);
        onSuccess();
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      onFailure(err.message);
    } finally {
      this.isLoading = false;
    }
  }

  // -----------------------------
  // UPDATE CATEGORY
  // -----------------------------
  async updateCategory(
    category: INewCategory & { id: string },
    onFailure: (msg: string) => void
  ) {
    this.isLoading = true;
    try {
      const { data, error } = await supabaseClient
        .from("categories")
        .update(category)
        .eq("id", category.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating category:", error);
        onFailure(error.message);
      } else {
        const index = this.categories?.findIndex((c) => c.id === data.id);
        if (index !== undefined && index > -1 && this.categories) {
          this.categories[index] = data;
        }
        this.openUpdateCategoryModal = false;
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      onFailure(err.message);
    } finally {
      this.isLoading = false;
    }
  }

  // -----------------------------
  // DELETE CATEGORY
  // -----------------------------
  async deleteCategory(
    categoryId: string,
    onFailure: (message: string) => void
  ): Promise<boolean> {
    this.isLoading = true;
    try {
      const { error } = await supabaseClient
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        console.error("Error deleting category:", error);
        onFailure(error.message);
        return false;
      } else {
        this.categories =
          this.categories?.filter((c) => c.id !== categoryId) || null;
        return true;
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      onFailure(err.message);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  // -----------------------------
  // SETTERS
  // -----------------------------
  setCategoryToUpdate(category: ICategory) {
    this.categoryToUpdate = category;
  }

  setOpenUpdateCategoryModal(status: boolean) {
    this.openUpdateCategoryModal = status;
  }
}
