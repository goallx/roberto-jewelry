import { Input } from "antd"
import { ChangeEvent, ChangeEventHandler } from "react"

interface CustomizedInputProps {
    label: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    value?: string
    defaultValue?: string
    disabled?: boolean
    placeholder?: string,
    maxLength?: number
}

const CustomizedInput: React.FC<CustomizedInputProps> = ({ label, onChange, value, defaultValue, disabled, placeholder, maxLength }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="font-light">{label}</label>}
            <Input maxLength={maxLength ?? -1} placeholder={placeholder} disabled={disabled} value={value} onChange={onChange} defaultValue={defaultValue} style={{ height: 40, borderRadius: 0,color:'black' }} />
        </div>
    )
}

export default CustomizedInput