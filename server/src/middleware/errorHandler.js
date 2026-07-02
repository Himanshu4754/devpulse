export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message);
  res.status(statusCode).json({
    message: err.message || 'Server error'
  });
};