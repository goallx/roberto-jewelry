import { makeAutoObservable, toJS } from "mobx";
import { supabase } from "@/lib/supabase/supabaseClient";
import { IProduct } from "./ProductStore";

export interface ICartItem {
  id: string;
  product: IProduct;
  product_id: string;
  quantity: number;
  price: number;
}

export interface ICart {
  id: string;
  user_id: string;
  status: string;
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

  calculateTotalPrice() {
    if (this.cart) {
      const totalPrice =
        this.cart?.items?.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ) || 0;
      this.totalPrice = totalPrice;
      return totalPrice;
    } else {
      this.totalPrice = 0;
      return 0;
    }
  }

  /**
   * Fetch the current user's active cart with items
   */
  async fetchUserCart(): Promise<ICart | null> {
    this.isLoading = true;
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("User not authenticated");

      const { data: cart, error: cartError } = await supabase
        .from("carts")
        .select(
          "id, user_id, status, cart_items(id, product_id, quantity, products(*))"
        )
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (cartError && cartError.code !== "PGRST116") throw cartError;

      if (cart) {
        this.cart = {
          id: cart.id,
          user_id: cart.user_id,
          status: cart.status,
          items: cart.cart_items.map((ci: any) => ({
            id: ci.id,
            product_id: ci.product_id,
            quantity: ci.quantity,
            price: ci.price,
            product: ci.products,
          })),
        };
        this.numOfCartItems = this.cart.items.reduce(
          (acc, i) => acc + i.quantity,
          0
        );
        this.calculateTotalPrice();
      } else {
        this.clearCart();
      }

      return this.cart;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Add product to cart (or increase quantity if exists)
   */
  async addToCart(productId: string) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");

      // Fetch user's active cart (take first one if multiple)
      let { data: carts, error: cartError } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1);

      if (cartError) throw cartError;
      let cart = carts?.[0];

      if (!cart) {
        const { data: newCart, error: createError } = await supabase
          .from("carts")
          .insert({ user_id: user.id, status: "active" })
          .select("id")
          .limit(1)
          .single();
        if (createError) throw createError;
        cart = newCart;
      }

      // Check if product already exists in cart
      const { data: existingItem, error: existingError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cart.id)
        .eq("product_id", productId)
        .maybeSingle(); // returns null if not exists
      if (existingError) throw existingError;
      if (existingItem) {
        // Increase quantity
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);
        if (updateError) throw updateError;
      } else {
        // Insert new cart item
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert({
            cart_id: cart.id,
            product_id: productId,
            quantity: 1,
          });
        if (insertError) throw insertError;
      }

      await this.fetchUserCart();
    } catch (err) {
      console.error("Error in addToCart:", err);
    }
  }

  /**
   * Decrease quantity of a product (or remove if quantity=1)
   */
  async deleteProductQuantity(productId: string) {
    try {
      if (!this.cart) return;

      const item = this.cart.items.find((i) => i.product_id === productId);
      if (!item) return;

      if (item.quantity > 1) {
        await supabase
          .from("cart_items")
          .update({ quantity: item.quantity - 1 })
          .eq("id", item.id);
      } else {
        await supabase.from("cart_items").delete().eq("id", item.id);
      }

      await this.fetchUserCart();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Remove product entirely from cart
   */
  async deleteProductFromCart(productId: string) {
    try {
      if (!this.cart) return;
      const item = this.cart.items.find((i) => i.product_id === productId);
      if (!item) return;

      await supabase.from("cart_items").delete().eq("id", item.id);

      await this.fetchUserCart();
    } catch (err) {
      console.error(err);
    }
  }
}
