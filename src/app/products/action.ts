import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { IProduct } from "@/stores/ProductStore";

type ProductFilters = {
  category_id?: number;
  category_name?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  material?: string;
  gender?: string;
};

export async function getMostSellingProducts(
  limit: number = 4
): Promise<IProduct[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("sold_units", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data ?? [];
  } catch (err: any) {
    console.error("Error fetching most selling products:", err.message || err);
    return [];
  }
}

export async function getProductsByCategory(
  catId: string
): Promise<IProduct[] | null> {
  try {
    if (!catId) throw new Error("Category id is required");

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("category", catId);

    if (error) throw error;

    return data ?? null;
  } catch (err: any) {
    console.error("Error fetching product by ID:", err.message || err);
    return null;
  }
}

export async function getProductById(id: string): Promise<IProduct | null> {
  try {
    if (!id) throw new Error("Product ID is required");
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, categories!inner(name)") // include category and images
      .eq("id", id)
      .single();

    if (error) throw error;

    return data ?? null;
  } catch (err: any) {
    console.error("Error fetching product by ID:", err.message || err);
    return null;
  }
}

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

  if (filters?.material) {
    query = query.eq("material", filters.category_name);
  }

  if (filters?.gender) {
    query = query.eq("gender", filters.gender);
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
