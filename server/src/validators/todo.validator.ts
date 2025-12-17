import { body, param } from "express-validator";

// Reusable ID validator since both Update and Delete need it
const idParamValidator = param("id")
  .exists().withMessage("Todo ID is required")
  .isMongoId().withMessage("Invalid Todo ID format") // Recommended: checks if it's a valid MongoDB ObjectId
  .trim()
  .notEmpty().withMessage("Todo ID cannot be empty");

export const createTodosValidator = [
  body("title")
    .exists().withMessage("Todo title is required")
    .isString().withMessage("Todo title must be a string")
    .trim()
    .notEmpty().withMessage("Todo title cannot be empty"),

  body("content")
    .optional()
    .isString().withMessage("Todo content must be a string")
    .trim(),
];

export const updateTodoValidator = [
  idParamValidator,
  body("status")
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage("Status must be an integer between 0 and 2"),
  body("title")
    .optional()
    .isString().withMessage("Todo title must be a string")
    .trim()
    .notEmpty().withMessage("Todo title cannot be empty"),
  body("content")
    .optional()
    .isString().withMessage("Todo content must be a string")
    .trim(),
];

// New Delete Validator
export const deleteTodoValidator = [
  idParamValidator
];

export const deleteManyTodosValidator = [
  body("ids")
    .exists().withMessage("IDs array is required")
    .isArray({ min: 1 }).withMessage("IDs must be a non-empty array")
    .custom((ids) => ids.every((id: any) => typeof id === "string" && id.trim() !== "")).withMessage("Each ID must be a non-empty string"),
];


export const todoValidator = {
  create: createTodosValidator,
  update: updateTodoValidator,
  delete: deleteTodoValidator, // Added here
  deleteMany: deleteManyTodosValidator,
};
