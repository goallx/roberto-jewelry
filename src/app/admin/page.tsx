import { createClient } from "@/lib/supabase/supabaseAdmin"
import { redirect } from "next/navigation"

export default async function AdminPage() {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.getSession()

    if (error || !data.session) {
        redirect('/')
    } else {
        redirect('/admin/orders')
    }
}