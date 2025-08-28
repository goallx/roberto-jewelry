import { CartStore } from "./CartStore";
import { CategoryStore } from "./CategoryStore";
import { NewsLetterStore } from "./NewsLetterStore";
import { OrderStore } from "./OrderStore";
import { ProductStore } from "./ProductStore";
import { ProfileStore } from "./ProfileStore";

export class RootStore {
  profileStore: ProfileStore | null = null;
  categoryStore: CategoryStore | null = null;
  productStore: ProductStore | null = null;
  cartStore: CartStore | null = null;
  orderStore: OrderStore | null = null;
  newsLetterStore: NewsLetterStore | null = null;

  constructor() {
    this.categoryStore = new CategoryStore();
    this.productStore = new ProductStore();
  }

  initStores() {
    this.profileStore = new ProfileStore();
    this.cartStore = new CartStore();
    this.orderStore = new OrderStore();
    this.newsLetterStore = new NewsLetterStore();
  }
}

export const rootStore = new RootStore();
