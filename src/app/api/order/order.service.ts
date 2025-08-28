import { dbConnect } from "@/lib/dbConnect";
import { ICartItem } from "@/models/Cart";
import CategoryModel from "@/models/Category";
import OrderModel, { IOrderItem, Order, OrderStatus } from "@/models/Order";
import Product from "@/models/Product";

class OrderService {
  private static instance: OrderService | null = null;

  constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  public async getOrderById(orderId: string): Promise<Order | null> {
    await dbConnect();
    return await OrderModel.findById(orderId).populate({
      path: "customerId",
      model: "User",
      select: "firstName lastName email phoneNumber",
    });
  }

  public async prepareOrder(items: ICartItem[]): Promise<{
    totalPriceForOrder: number;
    orderItems: IOrderItem[];
    errors: string[];
  }> {
    let totalPriceForOrder = 0;
    const orderItems: IOrderItem[] = [];
    const errors: string[] = [];

    await Promise.all(
      items.map(async (item) => {
        const { productId, quantity } = item;
        try {
          const product = await Product.findById(productId);
          if (!product) {
            errors.push(`Product with ID ${productId} not found.`);
            return;
          }
          if (product.stock < quantity) {
            errors.push(
              `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
            );
            return;
          }
          totalPriceForOrder += quantity * product.price;
          orderItems.push({
            productId: product._id,
            quantity,
            price: product.price,
          });
        } catch (err: any) {
          errors.push(
            `Error processing product with ID ${productId}: ${err.message}`
          );
        }
      })
    );

    return { totalPriceForOrder, orderItems, errors };
  }

  public async updateProductQuantities(items: IOrderItem[]): Promise<void> {
    await Promise.all(
      items.map(async (item) => {
        const { productId, quantity } = item;
        const product = await Product.findById(productId);
        const category = await CategoryModel.findById(product.category);
        product.stock -= quantity;
        product.soldUnits += quantity;
        category.numOfProducts -= quantity;
        await category.save();
        await product.save();
      })
    );
  }

  public async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<boolean> {
    await dbConnect();
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      { _id: orderId },
      {
        orderStatus: status,
      },
    );
    if (!updatedOrder) return false;
    return true;
  }
}

export default OrderService;
