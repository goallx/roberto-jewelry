import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { IProduct } from "@/stores/ProductStore";

type ProductFilters = {
  category_id?: number;
  category_name?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

export async function getProducts(
  filters?: ProductFilters
): Promise<IProduct[]> {
  const supabase = supabaseAdmin;

  let query = supabase.from("products").select("*, categories!inner(name)");

  if (filters?.category_id) {
    query = query.eq("category", filters.category_id);
  }

  if (filters?.category_name) {
    query = query.eq("categories.name", filters.category_name);
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}
