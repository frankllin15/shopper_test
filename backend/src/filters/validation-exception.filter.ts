import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(BadRequestException) // Captura apenas exceções de validação ou 400
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // A resposta da validação pode ser um objeto ou string, é importante padronizar
    const validationErrors =
      typeof exceptionResponse === 'object' && exceptionResponse['message']
        ? exceptionResponse['message'] // Array de mensagens de erro
        : [exceptionResponse]; // Caso seja uma string simples

    response.status(status).json({
      error_code: 'INVALID_DATA',
      error_description: validationErrors.join('; '),
    });
  }
}
