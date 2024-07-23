import { Request, Response, NextFunction } from "express";
import { succesHandler } from "../../helpers/responseHandler";
import { DefaultService } from "./defaultService";

export class DefaultController {
  static async authenticate(req: Request, res: Response, next: NextFunction) {


    try {
      const { message, data } = await DefaultService.authenticate(req.body);
      return succesHandler(res, 200, message, true, data)
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  static async updateSellerInfo(req: Request, res: Response, next: NextFunction) {

    try {
      const { message, data } = await DefaultService.updateSellerData(req.body);
      return succesHandler(res, 200, message, true, data)
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  static async getOrdersByUserId(req: Request, res: Response, next: NextFunction) {

    try {
      const { message, data } = await DefaultService.getOrdersBySellerId(req.query);
      return succesHandler(res, 200, message, true, data)
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  static async deleteOrderById(req: Request, res: Response, next: NextFunction) {

    try {
      const orderId = req.params.id as string;
      const { message } = await DefaultService.deleteOrderById(orderId);
      return succesHandler(res, 204, message, true, null)
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}
