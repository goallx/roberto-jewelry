'use client'

import { PageLoader } from "@/components/loader/PageLoader"
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton"
import CustomizedInput from "@/components/ui/input/CustomizedInput"
import { useStores } from "@/context/StoreContext"
import { IProfile, ProfileStore } from "@/stores/ProfileStore"
import { formatDate } from "@/utils/helpers"
import { useEffect, useState } from "react"

const ProfileForm: React.FC<{ profileData: IProfile | null, isLoading: boolean }> = ({ profileData, isLoading }) => {
    let { profileStore } = useStores()
    const [updateObject, setUpdateObject] = useState<Partial<IProfile>>({})
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (!profileStore) profileStore = new ProfileStore()
    }, [profileStore])


    const handleUpdateObject = (key: string, value: string) => {
        const keys = key.split('.');

        if (keys.length === 1) {

            setUpdateObject((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        } else {
            setUpdateObject((prevState) => ({
                ...prevState,
                [keys[0]]: {
                    ...(prevState?.[keys[0] as keyof IProfile] as object),
                    [keys[1]]: value,
                },
            }));
        }
    };

    if (!profileStore) return null

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center gap-3 m-auto h-[60vh]">
                <PageLoader />
            </div>
        )
    }

    if (!profileData) {
        return (
            <div className="m-auto">
                <p>No profile data available. Please try again later.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 my-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Name and Email */}
                <div className="flex flex-col gap-8">
                    {/* Name Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-lg font-semibold mb-4">Name</h1>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomizedInput
                                    defaultValue={profileData.firstName ?? ''}
                                    label="First Name"
                                    onChange={(e) => handleUpdateObject('firstName', e.target.value)}
                                />
                                <CustomizedInput
                                    defaultValue={profileData.lastName ?? ''}
                                    label="Last Name"
                                    onChange={(e) => handleUpdateObject('lastName', e.target.value)}
                                />
                            </div>
                            <CustomizedButton
                                title="Update"
                                onClick={() => profileStore?.updateProfile(updateObject)}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-300 my-4" />

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-lg font-semibold">Phone Number</h1>
                            <p className="font-extralight">{profileData?.phoneNumber.length ? profileData.phoneNumber : "Not provided"}</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <CustomizedInput
                                defaultValue={profileData.phoneNumber ?? ''}
                                label=""
                                onChange={(e) => handleUpdateObject('phoneNumber', e.target.value)}
                            />
                            <CustomizedButton
                                title="Update"
                                onClick={() => profileStore?.updateProfile(updateObject)}
                            />
                        </div>
                    </div>
                    <div className="border-t border-gray-300 my-4" />
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-lg font-semibold mb-4">Shipping Address</h1>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomizedInput
                                    defaultValue={profileData.firstName ?? ''}
                                    label="First Name"
                                />
                                <CustomizedInput
                                    defaultValue={profileData.lastName ?? ''}
                                    label="Last Name"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomizedInput
                                    defaultValue={profileData.address?.city ?? ''}
                                    label="City"
                                    onChange={(e) => handleUpdateObject('address.city', e.target.value)}
                                />
                                <CustomizedInput
                                    defaultValue={profileData.address?.zip ?? ''}
                                    label="ZIP Code"
                                    onChange={(e) => handleUpdateObject('address.zip', e.target.value)}
                                />
                            </div>
                            <CustomizedInput
                                defaultValue={profileData.address?.country ?? ''}
                                label="Country"
                                onChange={(e) => handleUpdateObject('address.country', e.target.value)}
                            />
                            <CustomizedButton title="Update" />
                        </div>
                    </div>

                </div>

                <div className="flex flex-col gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">Email</h1>
                            <p className="font-extralight">{profileData.email ?? 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">Date of Birth</h1>
                            <p className="font-extralight">
                                {profileData.birthday ? formatDate(profileData.birthday) : 'Not provided'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProfileForm
