export const errorHandler = (err, req, res, next) => {
  const origin = req.headers.origin;

  if (origin === process.env.CLIENT_URL1 || origin === process.env.CLIENT_URL2) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");

  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error"
  });
};