import { IOrderItem, Order } from "@/models/Order";
import { makeAutoObservable } from "mobx";
import { IProduct } from "./ProductStore";
import { IProfile } from "./ProfileStore";

export type IOrderItemWithProduct = Omit<IOrderItem, "productId"> & {
  product: IProduct;
};
export type IOrderWithProduct = Omit<Order, "items" | "customerId"> & {
  items: IOrderItemWithProduct[];
  createdAt: string;
  customerId: Partial<IProfile>;
};

export interface IBillingInfo {
  firstName: string;
  lastName: string;
  country: string;
  zip: string;
  city: string;
  street: string;
  cardHolderName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export class OrderStore {
  userOrders: IOrderWithProduct[] | null = null;
  allOrders: IOrderWithProduct[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAllOrders(): Promise<IOrderWithProduct[] | null> {
    try {
      const response = await fetch("/api/order/admin", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        this.allOrders = data.orders;
      }
      return this.allOrders ?? null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async fetchUserOrders(): Promise<IOrderWithProduct[] | null> {
    if (this.userOrders) return this.userOrders;
    try {
      const response = await fetch("/api/order", {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        this.userOrders = data.orders;
        return data.orders;
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async submitOrder(
    billingInfo: IBillingInfo,
    onFailure: (errors: string[]) => void,
    onSuccess: (transactionId: string, orderId: string) => void
  ): Promise<void> {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(billingInfo),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        const { transactionId, order } = data;
        this.userOrders?.push(order);
        try {
          const paymentSuccessRes = await fetch(
            `/api/payment-success?orderId=${order._id}&transaction_uid=${transactionId}`
          );
          if (paymentSuccessRes.ok) {
            onSuccess(transactionId, order._id);
          } else {
            console.log("@@ error in payment success route");
            onFailure([
              "Something went wrong, please try again or contact us!",
            ]);
          }
        } catch (err: any) {
          console.log("@@err in payment success", err.message || err);
          onFailure(["Something went wrong, please try again or contact us!"]);
        }
        return;
      } else {
        const errors = await fetch("/api/transaction");
        const errorsData = await errors.json();
        onFailure(
          errorsData ?? data.errors ?? ["Something wrong with payment!"]
        );
        return;
      }
    } catch (err: any) {
      onFailure(["Something went wrong, please try again or contact us!"]);
    }
  }
}
