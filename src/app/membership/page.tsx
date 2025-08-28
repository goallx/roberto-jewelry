'use client'

import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton"
import Image from "next/image"
import BillingInfo from "../payment/components/BillingInfo"
import { useEffect, useState } from "react"
import { Loader } from "@/components/loader/Loader"
import MembershipSuccessPage from "./MembershipSuccessPage"
import MembershipFailurePage from "./MembershipFailPage"
import { IBillingInfo } from "@/stores/OrderStore"
import { useStores } from "@/context/StoreContext"
import { useAlert } from "@/context/AlertsContext"

const Membership = () => {
    const { profileStore } = useStores()
    const [showPayment, setShowPayment] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPaymentSuccess, setShowPaymentSuccess] = useState<boolean>(false)
    const [showPaymentFail, setShowPaymentFail] = useState<boolean>(false)
    const { showAlert } = useAlert()

    useEffect(() => {
        return () => {
            setShowPayment(false)
        }
    }, [])

    const handleMembershipOrder = async (paymentBody: IBillingInfo) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/membership', {
                method: "POST",
                credentials: "include",
                cache: 'no-cache',
                body: JSON.stringify(paymentBody)
            })
            const data = await response.json()
            if (response.ok) {
                const { membership } = data
                if (!membership) {
                    showAlert('Something wrong happened, please contact us', 'error')
                }
                setShowPaymentSuccess(true)
                await profileStore?.updateProfileMembership(membership)
            } else {
                setShowPaymentFail(true)
            }
            return
        } catch (err: any) {
            setShowPaymentFail(true)
            throw new Error('Error while subscribing to membership', err.message || err)
        } finally {
            setIsLoading(false)
        }
    }

    if (showPaymentFail) {
        return <MembershipFailurePage close={() => setShowPaymentFail(false)} />
    }

    if (showPaymentSuccess) {
        return <MembershipSuccessPage />
    }


    return (
        <div className="w-[90%] md:w-[80%] h-auto mt-44 mb-20 m-auto flex flex-col justify-start items-center md:flex-row ">
            <section className="flex flex-col justify-start items-center gap-8 w-[70%] m-auto">
                <h2 className="font-amandine text-4xl text-center">Join the Roberto Membership</h2>
                <div className="w-full flex flex-col md:flex-row gap-3">
                    <div className="flex-[0.3] flex flex-col justify-center items-center">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2FVector-r-logo.png?alt=media&token=7912cfa6-c322-40de-aff7-0255a40ec2a6"
                            width={158}
                            height={90}
                            alt="R-logo img"
                        />
                        <p className="font-amandine text-4xl">Member</p>
                    </div>
                    <div className="flex-[0.7] font-xl font-extralight items-center">
                        Become part of the Roberto family and enjoy a lifetime of elegance and savings. For a one-time payment of $100, you'll receive 10% off all future purchases—forever.
                        <br />
                        <br />
                        Here’s the twist: if your purchase exceeds $1,000, we’ll gift you the membership for free! It’s our way of saying thank you for choosing Roberto Jewelry.
                    </div>
                </div>
                <p className="text-center font-xl font-extralight">Start your journey with timeless craftsmanship and<br /> exclusive benefits today.</p>
                <CustomizedButton width="250px" title="Become a Member!" onClick={() => setShowPayment(true)} />
                <p className="text-center font-xl font-extralight">100$ One Time Payment </p>
            </section>
            {
                showPayment &&
                <section>
                    {
                        isLoading ?
                            <Loader />
                            :
                            <BillingInfo forMembership handlePayment={handleMembershipOrder} />

                    }
                </section>
            }
        </div>
    )

}

export default Membership
