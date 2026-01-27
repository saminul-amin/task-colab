import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import { TErrorSources } from "../interfaces/error.types";
import { ZodError } from "zod";
import { AppError } from "../utils";
import mongoose from "mongoose";

const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSources[] = err.issues.map((issue) => ({
    path: String(issue.path[issue.path.length - 1]),
    message: issue.message,
  }));

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
};

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources: TErrorSources[] = Object.values(err.errors).map(
    (error) => ({
      path: error.path,
      message: error.message,
    })
  );

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
};

const handleCastError = (err: mongoose.Error.CastError) => {
  const errorSources: TErrorSources[] = [
    {
      path: err.path,
      message: `Invalid ${err.path}: ${err.value}`,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Invalid ID",
    errorSources,
  };
};

const handleDuplicateError = (err: any) => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedValue = match ? match[1] : "";

  const errorSources: TErrorSources[] = [
    {
      path: Object.keys(err.keyPattern)[0],
      message: `${extractedValue} already exists`,
    },
  ];

  return {
    statusCode: httpStatus.CONFLICT,
    message: "Duplicate Entry",
    errorSources,
  };
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorSources: TErrorSources[] = [];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }

  if (envVars.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
