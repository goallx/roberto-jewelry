import { makeAutoObservable } from "mobx";
import { calculateCartItems } from "./helpers";
import { IProduct } from "./ProductStore";

export interface ICartItem {
  product: IProduct;
  productId?: string;
  quantity: number;
  _id: string;
}

export interface ICart {
  _id: string;
  userId: string;
  items: Array<ICartItem>;
}

export class CartStore {
  cart: ICart | null = null;
  numOfCartItems: number = 0;
  totalPrice: number = 0;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  updateNumOfCartItems(op: number) {
    this.numOfCartItems += op;
  }

  clearCart(): void {
    this.cart = null;
    this.numOfCartItems = 0;
    this.totalPrice = 0;
  }

  calculateTotalPrice(): void {
    if (this.cart) {
      const totalPrice =
        this.cart?.items?.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ) || 0;
      this.totalPrice = totalPrice;
    } else {
      this.totalPrice = 0;
    }
    return;
  }

  async fetchUserCart(): Promise<ICart | null> {
    this.isLoading = true;
    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        if (Object.entries(data.cart).length) {
          this.cart = data.cart;
          this.numOfCartItems = calculateCartItems(data.cart);
          this.calculateTotalPrice();
        } else {
          this.cart = null;
        }
      }
      return this.cart;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async addToCart(productId: string) {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        this.cart = data.cart;
        this.updateNumOfCartItems(1);
        this.calculateTotalPrice();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProductQuantity(productId: string) {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        this.cart = data.cart;
        this.updateNumOfCartItems(-1);
        this.calculateTotalPrice();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProductFromCart(productId: string) {
    try {
      const response = await fetch("/api/cart/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        this.cart = data.cart;
        this.numOfCartItems = calculateCartItems(data.cart);
        this.calculateTotalPrice();
      }
    } catch (err) {
      console.log(err);
    }
  }
}
