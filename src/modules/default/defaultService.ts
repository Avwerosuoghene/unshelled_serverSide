import { Order } from "../../database/models/order";
import { Seller } from "../../database/models/seller";
import {

  isAuthSuccessI,
  ModError,
} from "../../database/types/handlers";
import {
  AuthPayload,
  GetOrdersRequestPayload,
  SortyBy,
  UpdateSellerPayload,

} from "../../database/types/payloads";
import { comparePassword } from "../../helpers/auth";

export class DefaultService {
  static async authenticate(authenticationPayload: AuthPayload): Promise<isAuthSuccessI> {
    const { userName, password } = authenticationPayload
    const seller = await Seller.findById(userName);

    if (!seller) {
      const error = new ModError("Seller not found");
      error.statusCode = 404;
      throw error;
    }
    const passwordMatch = comparePassword(password, seller.seller_zip_code_prefix)
    if (!passwordMatch) {
      const error = new ModError("Passwords do not match");
      error.statusCode = 401;
      throw error;
    }

    return {
      message: "Authentication succesful",
      isSuccess: true,
      data: seller
    }
  };

  static async updateSellerData(updateSellerPayload: UpdateSellerPayload): Promise<isAuthSuccessI> {
    const { userName, city, state } = updateSellerPayload;
    if (city === undefined && state === undefined) {
      const error = new ModError("Please pass data to be updated");
      error.statusCode = 400;
      throw error;
    }
    const seller = await Seller.findById(userName);

    if (!seller) {
      const error = new ModError("Seller not found");
      error.statusCode = 404;
      throw error;
    }
    const cityStateObject: { seller_city?: string, seller_state?: string } = {};
    cityStateObject.seller_city = city ?? cityStateObject.seller_city;
    cityStateObject.seller_state = state ?? cityStateObject.seller_state;
    const { updated, message } = await Seller.updateSeller(userName, cityStateObject);

    if (updated) {
      return {
        message: "Seller info updated succesfully",
        isSuccess: true,
        data: cityStateObject
      }
    }

    const error = new ModError(message);
    error.statusCode = 400;
    throw error;

  };

  static async getOrdersBySellerId(requestQuery: any): Promise<isAuthSuccessI> {
    const sellerId = requestQuery.sellerId as string;
    const sortBy: SortyBy = requestQuery.sortBy || SortyBy.limit_date;
    const currentPage = parseInt(requestQuery.currentPage as string, 10) || 1;
    const itemsPerPage = parseInt(requestQuery.itemsPerPage as string, 10);
    const limit = Math.min(Math.max(itemsPerPage, 1), 100) || 20;
    const offset = currentPage ? (currentPage - 1) * limit : 0;

    if (!sellerId) {
      const error = new ModError("Seller Id is required");
      error.statusCode = 400;
      throw error;
    }


    const seller = await Seller.findById(sellerId);

    if (!seller) {
      const error = new ModError("Seller not found");
      error.statusCode = 404;
      throw error;
    }

    const getOrdersPayload: GetOrdersRequestPayload = {
      sellerId,
      sortBy,
      limit,
      offset
    }

    const orders = await Order.getOrdersBySellerId(getOrdersPayload);

    if (orders === undefined) {
      const error = new ModError("No order found for the requested seller");
      error.statusCode = 404;
      throw error;
    }

    return {
      message: "Orders gotten succesfully",
      isSuccess: true,
      data: orders
    }
  };





  static async getOrdersById(orderId: string): Promise<{ message: string, isSuccess: boolean, data: any }> {
 
      if (!orderId) {
        const error = new ModError("Order Id is required");
        error.statusCode = 400;
        throw error;
      }
      const order = await Order.findById(orderId);

      if (!order) {
        const error = new ModError("Order not found");
        error.statusCode = 404;
        throw error;
      }
      return {
        message: "Seller info updated succesfully",
        isSuccess: true,
        data: order
      }
  
}


  static async deleteOrderById(orderId: string): Promise<{ message: string, isSuccess: boolean }> {
 
      if (!orderId) {
        const error = new ModError("Order Id is required");
        error.statusCode = 400;
        throw error;
      }
      const order = await Order.findById(orderId);

      if (!order) {
        const error = new ModError("Order not found");
        error.statusCode = 404;
        throw error;
      }
        const result = await Order.deleteById(orderId);

        if (result.deleted) {
            return {
                message: "Order deleted",
                isSuccess: true
            };
        } else {
            const error = new ModError(result.message);
            error.statusCode = 404;
            throw error;
        }
  
}
}
