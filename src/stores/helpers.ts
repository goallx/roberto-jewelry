import { ICart } from "./CartStore";

export const calculateCartItems = (cart: ICart | undefined): number => {
  if (!cart || !cart.items?.length) return 0;
  let counter = 0;
  for (const item of cart.items) {
    counter += item.quantity;
  }
  return counter;
};
