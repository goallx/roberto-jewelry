import { makeAutoObservable } from "mobx";
import { supabase } from "@/lib/supabaseClient";
import { IProduct } from "./ProductStore";

export interface IWishlistItem {
  id: string;
  product: IProduct;
  product_id: string;
  added_at: string;
}

export class WishlistStore {
  items: IWishlistItem[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchWishlist();
  }

  async fetchWishlist() {
    this.isLoading = true;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("wishlist_items")
        .select("id, product_id, added_at, products(*)")
        .eq("user_id", user.id);

      if (error) throw error;

      this.items = data.map((i: any) => ({
        id: i.id,
        product_id: i.product_id,
        added_at: i.added_at,
        product: i.products,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async addToWishlist(productId: string) {
    console.log("@@productid", productId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("wishlist_items")
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;

      await this.fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  }

  async removeFromWishlist(productId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;

      await this.fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  }

  isInWishlist(productId: string) {
    return this.items.some((i) => i.product_id === productId);
  }
}
