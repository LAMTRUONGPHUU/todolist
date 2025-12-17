
import { AppError } from "@/utils/appError";
import { type Request, type Response, type NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message

    });
  }
  console.error(err);


  return res.status(500).json({
    statusCode: 500,
    message: "Internal server error"
  });
}
