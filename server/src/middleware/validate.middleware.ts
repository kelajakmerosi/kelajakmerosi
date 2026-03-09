import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import ERROR_CODES from '../constants/errorCodes';
import { sendError } from '../utils/http';

const toValidationDetails = (zodError: ZodError) => {
    const flattened = zodError.flatten();
    const issues = zodError.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
    }));

    return {
        ...flattened,
        issues,
    };
};

const getValidationMessage = (zodError: ZodError, fallback: string) => {
    const firstIssue = zodError.issues.find((issue) => typeof issue?.message === 'string' && issue.message.length > 0);
    return firstIssue?.message || fallback;
};

export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return sendError(res, {
            status: 400,
            code: ERROR_CODES.VALIDATION_ERROR,
            message: getValidationMessage(parsed.error, 'Validation failed'),
            requestId: (req as any).id,
            details: toValidationDetails(parsed.error),
        });
    }

    req.body = parsed.data;
    return next();
};

export const validateParams = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
        return sendError(res, {
            status: 400,
            code: ERROR_CODES.VALIDATION_ERROR,
            message: getValidationMessage(parsed.error, 'Invalid path parameters'),
            requestId: (req as any).id,
            details: toValidationDetails(parsed.error),
        });
    }

    req.params = parsed.data;
    return next();
};

export const validateQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
        return sendError(res, {
            status: 400,
            code: ERROR_CODES.VALIDATION_ERROR,
            message: getValidationMessage(parsed.error, 'Invalid query parameters'),
            requestId: (req as any).id,
            details: toValidationDetails(parsed.error),
        });
    }

    req.query = parsed.data;
    return next();
};
