import { SelectProps } from "antd";

export const materialsImages: { [key: string]: string } = {
  gold: "https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fcustomise-gold.jpg?alt=media&token=b62f8e93-61a3-4a56-9d3a-7e4eab5dd39a",
  silver:
    "https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fcustomise-silver.jpg?alt=media&token=f61b0350-e46f-4c78-b3a7-6620c5401800",
  diamond:
    "https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fcustomise-diamond.jpg?alt=media&token=2905190e-da3b-4b9f-9166-35d81fabb269",
  platinum:
    "https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fcustomise-platinum.jpg?alt=media&token=6d81030d-6a0a-454d-aac8-9b13928f58d3",
  all: "https://firebasestorage.googleapis.com/v0/b/roberto-jewerly.firebasestorage.app/o/app-images%2Fall-products.jpg?alt=media&token=0859f3fe-6fdf-4ac7-b5a5-23a3e1bd1435",
};

export const sortBy: SelectProps["options"] = [
  { value: "highest-to-lowest", label: "Highest to lowest" },
  { value: "lowest-to-highest", label: "Lowest to highest" },
];
