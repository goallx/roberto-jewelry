import { makeAutoObservable } from "mobx";

export interface IMembership {
  joinDate?: string;
  membershipId?: string;
  memberKind: "Paid" | "First Order";
}

export interface IProfile {
  _id: string;
  firstName: string;
  lastName: string;
  numOfOrders: string;
  createdAt: string;
  role: string;
  email: string;
  phoneNumber: string;
  membership: IMembership | null;
  address: {
    city: string;
    zip: string;
    country: string;
    street: string;
  } | null;
  birthday: string;
}

export class ProfileStore {
  profile: IProfile | null = null;
  profileUpdateObject: Partial<IProfile> | null = null;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async updateProfileMembership(membership: IMembership): Promise<void> {
    if (!this.profile) await this.fetchProfile();
    if (this.profile) this.profile.membership = membership;
    return;
  }

  async fetchProfile(): Promise<void> {
    if (this.profile !== null) return;

    this.isLoading = true;
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        this.profile = data.user;
      } else {
        this.profile = null;
      }
      return;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile(updates: Partial<IProfile>) {
    console.log("updates", updates);
    this.isLoading = true;
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      const data = await response.json();

      if (response.ok) {
        this.profile = { ...this.profile, ...data.data };
      }
      return;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return;
    } finally {
      setTimeout(() => (this.isLoading = false), 3000);
    }
  }
}
