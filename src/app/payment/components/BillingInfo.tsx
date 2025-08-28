'use client'

import { Loader } from "@/components/loader/Loader"
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton"
import CustomizedInput from "@/components/ui/input/CustomizedInput"
import { useStores } from "@/context/StoreContext"
import { CartStore } from "@/stores/CartStore"
import { IBillingInfo } from "@/stores/OrderStore"
import { ProfileStore } from "@/stores/ProfileStore"
import { observer } from "mobx-react-lite"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useMemo } from "react"

interface BillingInfoProps {
    forMembership?: boolean,
    handlePayment?: (info: IBillingInfo) => void
}

const BillingInfo: React.FC<BillingInfoProps> = observer(({ forMembership, handlePayment }) => {
    let { orderStore, cartStore, profileStore } = useStores()
    const router = useRouter()

    const [billingInfo, setBillingInfo] = useState({
        firstName: "",
        lastName: "",
        city: "",
        zip: "",
        country: "",
        street: ""
    })

    const [cardInfo, setCardInfo] = useState({
        cardHolderName: "",
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvv: ""
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)
    const [errors, setErrors] = useState<string[]>([])

    useEffect(() => {
        if (!profileStore) profileStore = new ProfileStore()
        const loadProfile = async () => {
            await profileStore?.fetchProfile()
            setBillingInfo({
                firstName: profileStore?.profile?.firstName ?? "",
                lastName: profileStore?.profile?.lastName ?? "",
                city: profileStore?.profile?.address?.city ?? "",
                zip: profileStore?.profile?.address?.zip ?? "",
                country: profileStore?.profile?.address?.country ?? "",
                street: profileStore?.profile?.address?.street ?? ""
            })
            setIsLoaded(true)
        }
        loadProfile()
    }, [profileStore])

    const validateCardInputs = useCallback(() => {
        const errors: string[] = []
        const currentYear = new Date().getFullYear()

        if (!cardInfo.cardHolderName.trim()) {
            errors.push("Card holder name is required")
        }

        if (!/^\d{16}$/.test(cardInfo.cardNumber.replace(/\s/g, ""))) {
            errors.push("Card number must be 16 digits")
        }

        if (!/^(0[1-9]|1[0-2])$/.test(cardInfo.expMonth)) {
            errors.push("Expiration month must be in MM format (01-12)")
        }

        if (!/^\d{2}$/.test(cardInfo.expYear)) {
            errors.push("Expiration year must be a 2-digit number")
        } else {
            const expYearFull = 2000 + parseInt(cardInfo.expYear)
            if (expYearFull < currentYear) {
                errors.push("Expiration year must be a valid future year")
            }
        }

        if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
            errors.push("CVV must be 3 or 4 digits")
        }

        return errors
    }, [cardInfo])

    // Validate fields on change
    useEffect(() => {
        const isBillingFilled = Object.values(billingInfo).every(field => !!field)
        const isCardFilled = Object.values(cardInfo).every(field => !!field)
        const cardErrors = validateCardInputs()
        setErrors(cardErrors)
        setBtnDisabled(!(isBillingFilled && isCardFilled && cardErrors.length === 0))
    }, [billingInfo, cardInfo, validateCardInputs])

    const onFailure = (errors: string[]) => {
        setErrors(errors)
        router.push(`/payment-failure`)
    }

    const onSuccess = (transactionId: string, orderId: string) => {
        router.push(`/payment-success?transaction_uid=${transactionId}&order_id=${orderId}`)
        if (!cartStore) cartStore = new CartStore()
        cartStore?.clearCart()
    }

    const handleOrderSubmission = async () => {
        setErrors([])
        setIsLoading(true)
        const cardErrors = validateCardInputs()
        if (cardErrors.length > 0) {
            setErrors(cardErrors)
            setIsLoading(false)
            return
        }
        const info: IBillingInfo = { ...billingInfo, ...cardInfo }
        await orderStore?.submitOrder(info, onFailure, onSuccess)
        setIsLoading(false)
    }

    const handleMembershipPayment = () => {
        const info: IBillingInfo = { ...billingInfo, ...cardInfo }
        handlePayment && handlePayment(info)
    }

    if (!isLoaded || profileStore?.isLoading) {
        return (
            <div className="flex-1 flex justify-center items-center min-h-full">
                <Loader />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Billing Information */}
            <div className="bg-white rounded-lg p-6 shadow-md">
                <h1 className="text-2xl font-semibold mb-6">Billing info</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                            type="text"
                            value={billingInfo.firstName}
                            onChange={(e) => setBillingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Second Name</label>
                        <input
                            type="text"
                            value={billingInfo.lastName}
                            onChange={(e) => setBillingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            value={billingInfo.city}
                            onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                            type="text"
                            value={billingInfo.zip}
                            onChange={(e) => setBillingInfo(prev => ({ ...prev, zip: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                        value={billingInfo.country}
                        onChange={(e) => setBillingInfo(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">Choose country</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Israel">Israel</option>
                    </select>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                    <input
                        type="text"
                        value={billingInfo.street}
                        onChange={(e) => setBillingInfo(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            </div>

            {/* Credit Card Information */}
            <div className="bg-white rounded-lg p-6 shadow-md">
                <h1 className="text-2xl font-semibold mb-6">Credit Card Info</h1>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                    <input
                        type="text"
                        value={cardInfo.cardHolderName}
                        onChange={(e) => setCardInfo(prev => ({ ...prev, cardHolderName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="John Doe"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Exp. Month</label>
                        <input
                            type="text"
                            value={cardInfo.expMonth}
                            onChange={(e) => setCardInfo(prev => ({ ...prev, expMonth: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="MM"
                            maxLength={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Exp. Year</label>
                        <input
                            type="text"
                            value={cardInfo.expYear}
                            onChange={(e) => setCardInfo(prev => ({ ...prev, expYear: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="YY"
                            maxLength={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                            type="text"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo(prev => ({ ...prev, cvv: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="123"
                            maxLength={4}
                        />
                    </div>
                </div>
                
                <button
                    disabled={(forMembership ? false : !cartStore?.cart) || btnDisabled}
                    onClick={forMembership ? handleMembershipPayment : handleOrderSubmission}
                    className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
                >
                    {isLoading ? "Processing..." : "Confirm Your Order"}
                </button>
                
                <div className="flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">Or Pay With</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <button className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Pay
                    </button>
                    <button className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Pay
                    </button>
                </div>

                {errors.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {errors.map((err, index) => (
                            <p key={index} className="text-red-500 text-sm text-center">{err}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
})

export default BillingInfo