import { SortDirection } from "mongodb";
import { getDb } from "../db";
import { OrderI } from "../types/models";
import { GetOrdersRequestPayload } from "../types/payloads";


export class Order implements OrderI {

    order_id: string;
    order_item_id: number;
    product_id: string;
    shipping_limit_date: Date;
    seller_id: string;
    price: number;
    freight_value: number;

    constructor(order_id: string, order_item_id: number, product_id: string, shipping_limit_date: Date, seller_id: string, price: number, freight_value: number) {
        this.order_id = order_id;
        this.order_item_id = order_item_id;
        this.product_id = product_id;
        this.shipping_limit_date = shipping_limit_date;
        this.seller_id = seller_id;
        this.price = price;
        this.freight_value = freight_value;
    }





    static async findById(orderId: string): Promise<Order | undefined> {
        const db = getDb();
        try {
            const order = await db.collection('orders').findOne({ order_id: orderId });
            if (order) {
                return new Order(
                    order.order_id,
                    order.order_item_id,
                    order.product_id,
                    order.shipping_limit_date,
                    order.seller_id,
                    order.price,
                    order.freight_value
                );
            }
            return undefined;
        } catch (err) {
            console.log(err);
        }
    }

    static async getOrdersBySellerId(getOrdersPayload: GetOrdersRequestPayload): Promise<{ data: Array<Order>, total: number, limit: number, offset: number } | undefined> {
        const db = getDb();
        const { sellerId,
            sortBy,
            limit,
            offset } = getOrdersPayload;
        try {
            const query = { seller_id: sellerId };
            const sort: { [key: string]: SortDirection } = { [sortBy]: 1 };

            const totalOrders = await db.collection('orders').countDocuments(query);

            const orders = await db
                .collection('orders')
                .find(query)
                .sort(sort)
                .skip(offset)
                .limit(limit)
                .toArray();
            const mappedOrders = orders.map(order => ({
                order_id: order.order_id.toString(),
                order_item_id: order.order_item_id,
                product_id: order.product_id,
                shipping_limit_date: order.shipping_limit_date,
                seller_id: order.seller_id,
                price: order.price,
                freight_value: order.freight_value,
            })) as Array<Order>;

            return { data: mappedOrders, total: totalOrders, limit: limit, offset: offset };

        } catch (err) {
            console.error(err);
        }
    }

    static async deleteById(orderId: string): Promise<{ deleted: boolean, message: string }> {
        const db = getDb();
        let message: string;
        try {
            const result = await db.collection('orders').deleteOne({ order_id: orderId });

            if (result.deletedCount > 0) {
                message = 'Order deleted successfully';
                return {
                    deleted: true,
                    message
                };
            } else {
                message = 'Order not found';
                console.log(message);
            }
            return { deleted: false, message };
        } catch (err) {
            message = `Error deleting order ${err}`;
            console.error(message);
            return { deleted: false, message };
        }
    }

   
}

