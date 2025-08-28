import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton";
import { useRouter } from "next/navigation";

const MembershipSuccessPage = () => {

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-16 h-16 text-green-500"
                    />
                </div>

                {/* Success Message */}
                <h1 className="text-2xl font-bold text-center mt-4">
                    Membership Purchase Successful!
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    Thank you for joining us. Your membership has been successfully
                    activated.
                </p>

                {/* Membership Details */}
                <div className="mt-6 border-t border-b py-4">
                    <h2 className="text-lg font-semibold">Membership Details</h2>
                    <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Plan Name:</span>
                            <span className="font-semibold">
                                Premium Package
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold">
                                Life Time
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold">
                                $100
                            </span>
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <CustomizedButton
                    onClick={() => router.push("/")}
                    title="Continue Browsing"
                />
            </div>
        </div>
    );
}

export default MembershipSuccessPage