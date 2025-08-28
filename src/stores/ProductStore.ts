import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";
import { message } from "antd";
import { makeAutoObservable } from "mobx";

export interface IProduct {
  name: string;
  category: string;
  categoryName: string;
  material: string;
  price: number;
  description: string;
  stock: number;
  images: Array<UploadedImagesResponse>;
  status: string;
  date: string;
  gender: string;
  size: number;
  createdAt?: string;
  _id: string;
}

export interface INewProduct {
  name: string;
  category: string;
  images: Array<UploadedImagesResponse>;
  price: number;
  quantity: number;
  size: number;
  material: string;
  description: string;
  gender: string;
}

export class ProductStore {
  products: Array<IProduct> | null = null;
  bestSellingProducts: Array<IProduct> = [];
  productToUpdate: IProduct | null = null;
  openUpdateProductModal: boolean = false;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: "GET",
        cache: "no-cache",
      });
      const data = await response.json();
      if (response.ok) {
        const { product } = data;
        return product;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async fetchBestSellingProducts(): Promise<void> {
  
    try {
      const response = await fetch("/api/product/best-selling", {
        method: "GET",
        cache: "no-cache",
      });
      const data = await response.json();
      if (response.ok) {
        const { data: bestSellingProducts } = data;
        this.bestSellingProducts = bestSellingProducts;
      } else {
        this.bestSellingProducts = [];
      }
    } catch (err: any) {
      console.log(err.message || err);
    }
  }

  async fetchProductsByCategory(catId: string): Promise<IProduct[] | null> {
    this.isLoading = true;
    try {
      const response = await fetch(`/api/product?categoryId=${catId}`, {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      this.products = data.products;
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async fetchProducts(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await fetch("/api/product", {
        method: "GET",
        cache: "no-cache",
      });
      const data = await response.json();
      if (response.ok) {
        this.products = data.products;
      } else {
        this.products = null;
      }
      return;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  async getProductsForTable(): Promise<any> {
    if (!this.products) await this.fetchProducts();
  }

  async fetchProductByMaterial(material: string): Promise<IProduct[] | null> {
    try {
      const response = await fetch(`/api/product?material=${material}`, {
        cache: "no-cache",
      });
      const data = await response.json();
      if (response.ok) {
        const { products } = data;
        return products;
      }
      return null;
    } catch (err: any) {
      console.log("Error fetching products by material", err.message || err);
      return null;
    }
  }

  async updateProduct(
    product: IProduct & { imagesToDelete: string[] },
    onFailure: (err?: string) => void,
    onSuccess: () => void
  ) {
    try {
      const response = await fetch("/api/product/update", {
        method: "PUT",
        body: JSON.stringify(product),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const { updatedProduct } = data;
        if (!this.products) {
          await this.fetchProducts();
          return;
        }
        const index = this.products?.findIndex(
          (product) => product._id === updatedProduct._id
        );
        if (index > -1) {
          this.products[index] = updatedProduct;
        }
        onSuccess();
        this.openUpdateProductModal = false;
        return;
      } else {
        onFailure("Something went wrong");
      }
    } catch (err: any) {
      onFailure(err.message || err);
    }
  }

  async addProduct(
    newProduct: INewProduct,
    onSuccess: () => void,
    onFailure: (err?: string) => void
  ): Promise<void> {
    this.isLoading = true;
    try {
      const response = await fetch("/api/product/add", {
        method: "POST",
        body: JSON.stringify(newProduct),
        credentials: "include",
        headers: {},
      });
      const data = await response.json();

      if (response.ok) {
        this.products?.push(data.newProduct);
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

  async deleteProduct(productId: string): Promise<void> {
    try {
      const response = await fetch(`/api/product?id=${productId}`, {
        method: "DELETE",
        headers: {},
      });

      if (response.ok) {
        this.products =
          this.products?.filter(
            (product: IProduct) => product._id !== productId
          ) || [];
        message.success("Product deleted Successfully");
      } else {
        message.error("Something went wrong");
      }
    } catch (err) {
      message.error("Something went wrong");
    }
  }

  setOpenUpdateProductModal(status: boolean) {
    this.openUpdateProductModal = status;
  }

  setProductToUpdate(product: IProduct) {
    if (product) {
      this.productToUpdate = product;
    }
  }
}
