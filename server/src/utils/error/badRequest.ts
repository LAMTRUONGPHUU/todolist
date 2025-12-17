import { AppError } from "../appError";

export class BadRequestError extends AppError {
  static DEFAULT_MESSAGE = "Bad Request";
  static DEFAULT_STATUS_CODE = 400;

  constructor(message = BadRequestError.DEFAULT_MESSAGE) {
    super(message, BadRequestError.DEFAULT_STATUS_CODE);
  }
}
