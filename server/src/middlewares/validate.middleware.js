const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue.path[1] || issue.path[0],
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Dữ liệu gửi lên không hợp lệ!',
        errors,
      });
    }

    return next(error);
  }
};

module.exports = validate;
