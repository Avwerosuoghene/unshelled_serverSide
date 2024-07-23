import { Seller } from "../models/seller";
import { UpdateSellerPayload } from "./payloads";

export interface CustomError {
    message: string;
    statusCode: number | undefined;
    data: any;
  }
  
  export class ModError extends Error {
    status = 400;
  
    constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, ModError.prototype);
    }
    statusCode: number | undefined;
  }
  
  export interface isSuccessI {
    message: string,
    isSuccess: boolean
  }


  
  export interface isAuthSuccessI extends isSuccessI {
    data: any
  }
  
  export interface updateSellerResponseI extends isSuccessI {
    userData: UpdateSellerPayload
  }



