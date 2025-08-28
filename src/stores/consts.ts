import { SelectProps } from "antd";

export const genderOptions: SelectProps["options"] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

export const materialOptions: SelectProps["options"] = [
  { value: "gold", label: "Gold" },
  { value: "diamond", label: "Diamond" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  { value: "yellow gold", label: "Yellow gold" },
  { value: "white gold", label: "White gold" },
];

export const sortBy: SelectProps["options"] = [
  { value: "highest-to-lowest", label: "highest to lowest" },
  { value: "lowest-to-highest", label: "Lowest to highest" },
];
