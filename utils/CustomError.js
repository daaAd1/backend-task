export class RESTError extends Error {
  constructor(statusCode = 404, name = 'UNKNOWN_ERROR', description = null, payload, userinfo) {
    super(description || name);
    this.name = name;
    this.statusCode = statusCode;
    this.description = description;
    this.payload = payload;
    this.userinfo = userinfo;
  }
}

export const CustomError = (req, res) => {
  if (!res.headersSent) {
    res.status(404);
    res.json({
      statusCode: 404,
      name: 'NOT_FOUND',
      description: `Route is not defined in Swagger specification (${req.method} ${
        req.originalUrl
      })`,
    });
  }
};
