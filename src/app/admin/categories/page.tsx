import { CategoryTable } from "@/components/table/CategoryTable"
import { createClient } from "@/lib/supabase/supabaseAdmin"
import { ICategory } from "@/stores/CategoryStore"
import CategoriesAdmin from "./components/CategoriesAdmin"


export default async function Categories() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.from('categories').select("*")
        if (error) throw error.message

        const categories: ICategory[] = data.map((cat) => {
            return {
                ...cat,
                numOfProducts: cat.num_of_products,
            }
        })

        return <CategoriesAdmin categories={categories} />
    } catch (err) {
        throw err
        return null
    }
}