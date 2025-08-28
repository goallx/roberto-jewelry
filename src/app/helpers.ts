export const buildCartResponse = (cart: any) => {
    const updatedItems = cart.items.map((item: any) => {
      let cartItem = {
        ...item.toObject(),
        product: item.productId,
      };
      delete cartItem["productId"];
      return cartItem;
    });
    return { ...cart.toObject(), items: updatedItems };
  };