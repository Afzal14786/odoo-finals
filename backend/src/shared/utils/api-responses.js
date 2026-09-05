
export class ApiResponse {
  constructor(res, statusCode, message, data) {
    this.res = res;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  send() {
    return this.res.status(this.statusCode).json({
      success: this.statusCode >= 200 && this.statusCode < 300,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      timestamp: new Date().toISOString(),
    });
  }
}