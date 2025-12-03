// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: messages,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered',
    });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, notFound };
