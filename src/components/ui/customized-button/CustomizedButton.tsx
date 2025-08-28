import { Loader } from "@/components/loader/Loader";
import { Button } from "antd"

interface CustomizedButtonProps {
    title: string;
    width?: string
    height?: string
    loading?: boolean
    disabled?: boolean
    backgroundColor?: string
    onClick?: () => void,
    color?: string
}

export const CustomizedButton: React.FC<CustomizedButtonProps> = ({ title, width, height, backgroundColor = "black", loading = false, onClick, disabled = false, color }) => {
    return (
        <Button disabled={disabled} className="hover:bg-gray-900 transition duration-300" style={{ width: width ?? '100%', borderRadius: 0, height: height ?? "40px", fontSize: '1rem', background: backgroundColor ?? 'black', color: color ?? (backgroundColor === "black" ? 'white' : 'black') }} onClick={onClick}>
            {
                loading ?
                    <Loader />
                    :
                    title
            }
        </Button>
    )
}