import { Breadcrumb } from "@/components/breadcrumbs/Breadcrumb"
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton"
import { useStores } from "@/context/StoreContext"
import { CategoryStore, ICategory } from "@/stores/CategoryStore"
import { IProduct } from "@/stores/ProductStore"
import { Select } from "antd"
import { useEffect, useState } from "react"
import { EmptyStateSVG } from "../[catName]/components/emptySvg"
import { PageLoader } from "@/components/loader/PageLoader"
import { sortBy } from "./consts"

interface ProductsDisplayProps {
  material: string
}

// Define the correct interface for your categories
interface CorrectedCategory extends Omit<ICategory, 'id'> {
  _id: string;
}

// Define the correct interface for your products - use intersection type instead of extends
type CorrectedProduct = Omit<IProduct, 'id' | 'images'> & {
  _id: string;
  images?: string[]; // Override with the correct type you expect from API
  image?: string;
  imageUrl?: string;
  mainImage?: string;
};

// Simple ProductCard component since the import is missing
const ProductCard: React.FC<{ product: CorrectedProduct }> = ({ product }) => {
  // Get the first available image from various possible properties
  const getProductImage = () => {
    if (product.image) return product.image;
    if (product.imageUrl) return product.imageUrl;
    if (product.images && product.images.length > 0) {
      // Handle both string array and complex object array
      const firstImage = product.images[0];
      return typeof firstImage === 'string' ? firstImage : '/placeholder-image.jpg';
    }
    if (product.mainImage) return product.mainImage;
    return "/placeholder-image.jpg";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <img 
        src={getProductImage()} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <p className="text-blue-600 font-bold">${product.price}</p>
        {product.stock === 0 && (
          <p className="text-red-500 text-sm mt-1">Out of Stock</p>
        )}
      </div>
    </div>
  );
};

export const ProductsDisplay: React.FC<ProductsDisplayProps> = ({ material }) => {
  const { categoryStore } = useStores()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [allProducts, setAllProducts] = useState<CorrectedProduct[]>([])
  const [categories, setCategories] = useState<CorrectedCategory[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch categories once
  useEffect(() => {
    const loadCategories = async () => {
      if (!categoryStore) {
        setError("Category store is not available")
        return
      }
      try {
        await categoryStore.fetchCategories()
        // Cast the categories to the corrected type
        setCategories((categoryStore.categories || []) as unknown as CorrectedCategory[])
      } catch (err: any) {
        console.error("Failed to load categories", err)
        setError("Failed to load categories")
      }
    }

    loadCategories()
  }, [categoryStore])

  // Fetch products on material or category change
  useEffect(() => {
    if (!material) return
    if (!categoryStore) {
      setError("Category store is not available")
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      setError("")

      try {
        const params = new URLSearchParams({ material })
        if (selectedCategory) params.append("category", selectedCategory)

        const response = await fetch(`/api/product?${params.toString()}`, {
          cache: "no-cache",
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products")
        }

        // Log the first product to see actual structure
        console.log('First product:', data.products[0]);
        
        // Cast the products to the corrected type
        const availableProducts = data.products.filter((p: CorrectedProduct) => p.stock > 0)
        setAllProducts(availableProducts)
      } catch (err: any) {
        setError(err.message || "Something went wrong.")
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [material, selectedCategory, categoryStore])

  // Sort products client-side
  const sortedProducts = [...allProducts].sort((a, b) => {
    if (selectedFilter === "highest-to-lowest") return b.price - a.price
    if (selectedFilter === "lowest-to-highest") return a.price - b.price
    return 0
  })

  const handleResetFilters = () => {
    setSelectedCategory(null)
    setSelectedFilter(null)
  }

  return (
    <div className="px-8 mt-6">
      <Breadcrumb />
      <div className="mt-8 mb-8 flex items-center flex-wrap gap-4">
        <Select
          allowClear
          style={{ minWidth: "140px" }}
          placeholder="Category"
          onClear={() => setSelectedCategory(null)}
          onChange={(value) => setSelectedCategory(value || null)}
          value={selectedCategory || undefined}
          options={categories.map((cat: CorrectedCategory) => ({
            value: cat._id,
            label: cat.name,
          }))}
        />
        <Select
          allowClear
          style={{ minWidth: "140px" }}
          placeholder="Sort By"
          onChange={(value) => setSelectedFilter(value || null)}
          value={selectedFilter || undefined}
          options={sortBy}
        />
        <CustomizedButton
          title="Reset"
          width="100px"
          height="36px"
          onClick={handleResetFilters}
        />
      </div>

      {loading ? (
        <div className="mt-11 min-h-[80vh]">
          <PageLoader />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center my-10">{error}</div>
      ) : sortedProducts.length > 0 ? (
        <div className="px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 justify-items-center">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-xl min-h-[20vh] flex flex-col items-center justify-center mb-10">
          <EmptyStateSVG />
          <p className="font-light text-gray-600">
            No products found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  )
}