

import {  Response } from 'express';

export const succesHandler = (res: Response, statusCode: number, message: string,  isSuccess: boolean, data?: any,) => {
  return res.status(statusCode).json({ message, data, isSuccess});
};
