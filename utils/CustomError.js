export class CustomError extends Error {
  constructor(statusCode = 500, name = 'UNDEFINED_ERROR', description, payload) {
    super(description || name);
    this.statusCode = statusCode;
    this.name = name;
    this.description = description;
    this.payload = payload;
  }
}
