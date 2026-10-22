import { ApiError } from '../utils/ApiError.js';

export function validate(schema) {
  return (req, _res, next) => {
    req.validated = req.validated || {};
    const details = {};

    const targets = ['body', 'query', 'params'];
    for (const target of targets) {
      if (schema[target]) {
        const result = schema[target].safeParse(req[target]);
        if (!result.success) {
          for (const issue of result.error.issues) {
            const path = issue.path.join('.') || target;
            details[path] = issue.message;
          }
        } else {
          req.validated[target] = result.data;
        }
      }
    }

    if (Object.keys(details).length > 0) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', details);
    }

    next();
  };
}
