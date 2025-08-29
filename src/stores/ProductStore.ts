import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";
import { makeAutoObservable } from "mobx";
import { supabase } from "@/lib/supabaseClient";

export interface IProduct {
  name: string;
  category: string;
  categoryName?: string;
  material: string;
  price: number;
  description: string;
  stock: number;
  images: UploadedImagesResponse[];
  status?: string;
  date?: string;
  gender: string;
  size: number;
  created_at?: string;
  id: string;
}

export interface INewProduct {
  name: string;
  category: string;
  images: UploadedImagesResponse[];
  price: number;
  quantity: number;
  size: number;
  material: string;
  description: string;
  gender: string;
}

export class ProductStore {
  products: IProduct[] | null = null;
  bestSellingProducts: IProduct[] = [];
  productToUpdate: IProduct | null = null;
  openUpdateProductModal: boolean = false;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProducts(): Promise<void> {
    this.isLoading = true;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("createdAt", { ascending: false });
      console.log("@@products", data);
      if (error) {
        console.error("Error fetching products:", error.message);
        this.products = null;
      } else {
        this.products = data || [];
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchProductsByCategory(
    categoryId: string
  ): Promise<IProduct[] | null> {
    this.isLoading = true;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", categoryId)
        .order("createdAt", { ascending: false });

      if (error) throw error;
      this.products = data || [];
      return data || [];
    } catch (err) {
      console.error("Error fetching products by category:", err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async fetchBestSellingProducts(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("soldUnits", { ascending: false })
        .limit(10);

      if (error) throw error;
      this.bestSellingProducts = data || [];
    } catch (err) {
      console.error(err);
    }
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("_id", productId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async addProduct(
    newProduct: INewProduct,
    onSuccess: () => void,
    onFailure: (err?: string) => void
  ) {
    this.isLoading = true;
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            ...newProduct,
            stock: newProduct.quantity,
            createdAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error inserting product:", error.message);
        onFailure(error.message);
      } else if (data) {
        this.products?.push(data);
        onSuccess();
      }
    } catch (err: any) {
      onFailure(err.message);
    } finally {
      this.isLoading = false;
    }
  }

  async updateProduct(
    product: IProduct & { imagesToDelete?: string[] },
    onSuccess: () => void,
    onFailure: (err?: string) => void
  ) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ ...product })
        .eq("_id", product.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating product:", error.message);
        onFailure(error.message);
      } else if (data && this.products) {
        const index = this.products.findIndex((p) => p.id === data.id);
        if (index > -1) this.products[index] = data;
        onSuccess();
        this.openUpdateProductModal = false;
      }
    } catch (err: any) {
      onFailure(err.message);
    }
  }

  async deleteProduct(
    productId: string,
    onSuccess?: () => void,
    onFailure?: (err?: string) => void
  ) {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("_id", productId);

      if (error) {
        console.error("Error deleting product:", error.message);
        onFailure?.(error.message);
      } else {
        this.products = this.products?.filter((p) => p.id !== productId) || [];
        onSuccess?.();
      }
    } catch (err: any) {
      console.error(err);
      onFailure?.(err.message);
    }
  }

  setOpenUpdateProductModal(status: boolean) {
    this.openUpdateProductModal = status;
  }

  setProductToUpdate(product: IProduct) {
    this.productToUpdate = product;
  }
}
