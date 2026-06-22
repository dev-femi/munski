import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getOrdersByCustomer = async (customerId: string) => {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: { include: { inventory: true } } },
  });
};

export const createOrder = async (data: any) => {
  return prisma.order.create({
    data: {
      customerId: data.customer_id,
      deliveryDate: data.delivery_date,
      items: {
        create: data.items.map((item: any) => ({
          inventoryId: item.inventory_id,
          quantityLbs: item.quantity_lbs,
          unitPrice: 0, // Should be calculated based on inventory/pricing
        })),
      },
    },
    include: { items: { include: { inventory: true } } },
  });
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { inventory: true } } },
  });
  if (!order) {
    throw new AppError(404, 'Order not found');
  }
  return order;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await getOrderById(orderId);
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: { include: { inventory: true } } },
  });
};
