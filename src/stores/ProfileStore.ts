import { supabase } from "@/lib/supabase/supabaseClient";
import { makeAutoObservable } from "mobx";

export interface IMembership {
  joinDate?: string;
  membershipId?: string;
  memberKind: "Paid" | "First Order";
}

export interface IProfile {
  id: string;
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
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeProfile();
  }

  private async initializeProfile() {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("profile");
      if (savedProfile) {
        try {
          this.profile = JSON.parse(savedProfile);
        } catch (e) {
          console.error("Error parsing saved profile:", e);
          localStorage.removeItem("profile");
        }
      } else {
        await this.fetchProfile();
      }
    }
  }

  // Save profile to localStorage
  private saveProfileToStorage(profile: IProfile) {
    if (typeof window !== "undefined") {
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }

  // Clear profile from storage
  private clearProfileFromStorage() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("profile");
    }
  }

  async updateProfileMembership(membership: IMembership): Promise<void> {
    if (!this.profile) await this.fetchProfile();
    if (this.profile) {
      this.profile.membership = membership;
      this.saveProfileToStorage(this.profile);
    }
    return;
  }

  async fetchProfile(): Promise<void> {
    // If we already have a profile and it's not stale, return early
    if (this.profile !== null) return;

    this.isLoading = true;
    this.error = null;

    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        this.error = "Not authenticated";
        this.clearProfileFromStorage();
        this.profile = null;
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile from Supabase:", error);
        return;
      }

      if (data) {
        const profile: IProfile = {
          id: data.id,
          email: authUser.email || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phoneNumber: data.phone_number || "",
          birthday: data.birthday || "",
          address: data.address || "",
          membership: data.membership || undefined,
          numOfOrders: data.num_of_orders,
          createdAt: data.created_at,
          role: data.role,
        };

        this.profile = profile;
        this.saveProfileToStorage(profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      this.error = "Failed to fetch profile";
    } finally {
      this.isLoading = false;
    }
  }

  clearProfile() {
    this.profile = null;
    this.profileUpdateObject = null;
    this.clearProfileFromStorage();
  }
}
