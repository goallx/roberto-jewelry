import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton";
import { useRouter } from "next/navigation";

interface MembershipFailurePageProps {
    close: () => void
}

const MembershipFailurePage: React.FC<MembershipFailurePageProps> = ({ close }) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                {/* Failure Icon */}
                <div className="flex justify-center">
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="w-16 h-16 text-red-500"
                    />
                </div>

                <h1 className="text-2xl font-bold text-center mt-4">
                    Transaction Failed!
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    We're sorry, but your payment could not be processed. Please try again or contact support.
                </p>

                <div className="mt-6 border-t border-b py-4">
                    <h2 className="text-lg font-semibold">Error Details</h2>
                    <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Error Message:</span>
                            <span className="font-semibold">
                                Payment Declined
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-4">
                    <CustomizedButton
                        onClick={close}
                        title="Retry Payment"
                    />
                    <CustomizedButton
                        onClick={() => router.push("/")}
                        title="Back to Home"
                    />
                </div>
            </div>
        </div>
    );
}

export default MembershipFailurePage;