import { body } from "express-validator";

export const defaultValidator = {
  authenticate: [
    body("userName").trim().not()
      .isEmpty(),
    body("password").trim().not()
      .isEmpty(),
  ],
  updateUser: [
    body("userName").trim().not()
      .isEmpty(),
  ],
  getOrders: [
    body("sellerId").trim().not()
      .isEmpty(),
  ],
};
