import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import morgan from "morgan";
import fs from "fs";



import modules from "./modules/default";
import headerSetter from "./middleware/setHeaders";
import { connectDb } from "./database/db";
import { CustomError } from "./database/types/handlers";



const app = express();

app.use(bodyParser.json());

app.use(headerSetter);


modules(app);
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),{flags: 'a'}
);
app.use(morgan("combined", {stream: accessLogStream}));

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data, isSuccess: false });
  }
);

connectDb();


export default app;
