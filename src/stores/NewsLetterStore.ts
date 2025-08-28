import { NewsLetterSubscription } from "@/models/Newsletter";
import { makeObservable } from "mobx";

export class NewsLetterStore {
  subscribers: NewsLetterSubscription[] = [];
  isLoading: boolean = false;
  constructor() {
    makeObservable(this);
  }

  async subscribe(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    this.isLoading = true;
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          ContentType: "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      return { success: false, message: err.message || err };
    } finally {
      this.isLoading = false;
    }
  }

  async unSubscribe(email: string) {
    this.isLoading = true;
    try {
      const response = await fetch("/api/newsletter", {
        method: "PUT",
        body: JSON.stringify({ email }),
        headers: {
          ContentType: "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      return { success: false, message: err.message || err };
    } finally {
      this.isLoading = false;
    }
  }
}
