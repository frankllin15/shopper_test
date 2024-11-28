import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiExeption extends HttpException {
  constructor(
    error_code: string,
    error_description: string,
    status: HttpStatus,
  ) {
    super(
      {
        error_code: error_code,
        error_description: error_description,
      },
      status,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
