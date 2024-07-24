import { Application, Router } from "express";
import validationHandler from "../../middleware/validationHandler";
import { defaultValidator } from "../../validations/defaultValidator";
import { DefaultController } from "./defaultController";

const router = Router();
const apiVersion = '/api/v1';

router.post(
  "/auth",
  defaultValidator.authenticate,
  validationHandler,
  DefaultController.authenticate
);

router.put(
  "/account",
  defaultValidator.updateUser,
  validationHandler,
  DefaultController.updateSellerInfo
);

router.get(
  "/order_items",
  DefaultController.getOrdersByUserId
);

router.delete(
  "/order_items/:id",
  DefaultController.deleteOrderById
);

router.get(
  "/order_items/:id",
  DefaultController.getOrdersById
);

export default (app: Application) => {

  app.use(apiVersion, router);

  return app
}
