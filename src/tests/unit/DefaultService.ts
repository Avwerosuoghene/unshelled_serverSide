import { DefaultService } from '../../modules/default/defaultService'; // Adjust the path as necessary
import { Seller } from "../../database/models/seller";
import { Order } from "../../database/models/order";
import { ModError } from "../../database/types/handlers";
import { comparePassword } from "../../helpers/auth";
import test, { describe, beforeEach } from 'node:test';

jest.mock("");
jest.mock("../../database/models/order");
jest.mock("../../helpers/auth");

// Sample data for testing
const mockSeller = {
    userName: "testSeller",
    seller_zip_code_prefix: "hashedPassword",
    seller_city: "Test City",
    seller_state: "Test State"
};

const mockOrder = {
    order_id: "12345",
    order_item_id: 1,
    product_id: "product1",
    shipping_limit_date: new Date(),
    seller_id: "testSeller",
    price: 100,
    freight_value: 10
};

// Tests for DefaultService
describe('DefaultService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('authenticate should return success for valid credentials', async () => {
        (Seller.findById as jest.Mock).mockResolvedValue(mockSeller);
        (comparePassword as jest.Mock).mockReturnValue(true);

        const result = await DefaultService.authenticate({
            userName: "testSeller",
            password: "password"
        });

        expect(result).toEqual({
            message: "Authentication succesful",
            isSuccess: true,
            data: mockSeller
        });
    });

    test('authenticate should throw an error for invalid credentials', async () => {
        (Seller.findById as jest.Mock).mockResolvedValue(mockSeller);
        (comparePassword as jest.Mock).mockReturnValue(false);

        await expect(DefaultService.authenticate({
            userName: "testSeller",
            password: "wrongPassword"
        })).rejects.toThrowError(new ModError("Passwords do not match"));
    });

    test('updateSellerData should return success for valid updates', async () => {
        (Seller.findById as jest.Mock).mockResolvedValue(mockSeller);
        (Seller.updateSeller as jest.Mock).mockResolvedValue({ updated: true, message: "Update successful" });

        const result = await DefaultService.updateSellerData({
            userName: "testSeller",
            city: "New City",
            state: "New State"
        });

        expect(result).toEqual({
            message: "Seller info updated succesfully",
            isSuccess: true,
            data: { seller_city: "New City", seller_state: "New State" }
        });
    });

    test('updateSellerData should throw an error if seller not found', async () => {
        (Seller.findById as jest.Mock).mockResolvedValue(undefined);

        await expect(DefaultService.updateSellerData({
            userName: "unknownSeller",
            city: "New City",
            state: "New State"
        })).rejects.toThrowError(new ModError("Seller not found"));
    });

    test('getOrdersBySellerId should return orders for valid seller', async () => {
        (Seller.findById as jest.Mock).mockResolvedValue(mockSeller);
        (Order.getOrdersBySellerId as jest.Mock).mockResolvedValue({
            data: [mockOrder],
            total: 1,
            limit: 20,
            offset: 0
        });

        const result = await DefaultService.getOrdersBySellerId({
            sellerId: "testSeller",
            sortBy: "shipping_limit_date",
            currentPage: 1,
            itemsPerPage: 20
        });

        expect(result).toEqual({
            message: "Orders gotten succesfully",
            isSuccess: true,
            data: {
                data: [mockOrder],
                total: 1,
                limit: 20,
                offset: 0
            }
        });
    });

    test('getOrdersBySellerId should throw an error if seller not found', async () => {
        (Seller.findById as jest.Mock).mockResolvedValue(undefined);

        await expect(DefaultService.getOrdersBySellerId({
            sellerId: "unknownSeller",
            sortBy: "shipping_limit_date",
            currentPage: 1,
            itemsPerPage: 20
        })).rejects.toThrowError(new ModError("Seller not found"));
    });

    test('deleteOrderById should return success for valid order', async () => {
        (Order.findById as jest.Mock).mockResolvedValue(mockOrder);
        (Order.deleteById as jest.Mock).mockResolvedValue({ deleted: true, message: "Order deleted" });

        const result = await DefaultService.deleteOrderById("12345");

        expect(result).toEqual({
            message: "Order deleted",
            isSuccess: true
        });
    });

    test('deleteOrderById should throw an error if order not found', async () => {
        (Order.findById as jest.Mock).mockResolvedValue(undefined);

        await expect(DefaultService.deleteOrderById("unknownOrder")).rejects.toThrowError(new ModError("Order not found"));
    });

    test('deleteOrderById should throw an error if orderId is missing', async () => {
        await expect(DefaultService.deleteOrderById("")).rejects.toThrowError(new ModError("Order Id is required"));
    });
});