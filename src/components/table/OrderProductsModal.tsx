import Modal from "../modal/Modal"
import { IOrderItemWithProduct } from "@/stores/OrderStore"

interface OrderProductsModalProps {
    onClose: () => void,
    products: IOrderItemWithProduct[]
}

export const OrderProductsModal: React.FC<OrderProductsModalProps> = ({ onClose, products }) => {

    return (
        <Modal onClose={onClose}>
            <h1 className="text-xl mb-5 text-black">Products in order</h1>
            <div className="h-auto p-4 flex flex-col justify-start gap-4">
                {
                    products.map((product, index) => (
                        <div
                            key={index}
                            className="text-black  flex flex-start justify-between gap-4 p-4 bg-white rounded-lg shadow-sm transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
                        >
                            <img
                                src={product?.product?.images[0].imgUrl}
                                alt={`image ${index}`}
                                key={index}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="flex flex-col gap-2 justify-center text-base">
                                <p className="font-semibold text-gray-800">{product.product?.name ?? "Product"}</p>
                                <p className="text-gray-600">${product.product?.price ?? 0} <span className="text-xs">per unit</span></p>
                                <p className="text-sm text-gray-500 truncate">
                                    {product.product?.material
                                        ? product.product.material.charAt(0).toUpperCase() + product.product.material.slice(1)
                                        : ""}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center text-lg font-semibold text-gray-700">
                                <span className="bg-gray-100 px-2 py-1 rounded-lg">x {product.quantity}</span>
                            </div>
                        </div>

                    ))
                }
            </div>
        </Modal>
    )
}