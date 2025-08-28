'use client'

import { PageLoader } from "@/components/loader/PageLoader"
import { useStores } from "@/context/StoreContext"
import { rootStore } from "@/stores/RootStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const AdminPage = () => {
    const router = useRouter()
    const { productStore, categoryStore, newsLetterStore, orderStore, initStores } = useStores()
    const [storesInitialized, setStoresInitialized] = useState(false)

    useEffect(() => {
        if (productStore && categoryStore && newsLetterStore && orderStore) {
            setStoresInitialized(true)
        } else {
            setStoresInitialized(false)
            rootStore.initStores()
        }
    }, [productStore, categoryStore, newsLetterStore, orderStore])

    useEffect(() => {
        if (storesInitialized) {
            router.push('/admin/orders')
        }
    }, [storesInitialized, router])

    return (
        <div className="h-screen flex justify-center items-center">
            <PageLoader />
        </div>
    )
}

export default AdminPage
