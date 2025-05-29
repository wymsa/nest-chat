import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ValidationError } from 'class-validator';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ws = host.switchToWs();
    const eventPattern = ws.getPattern();
    const client = ws.getClient<Socket>();
    const errors = exception.getError();
    let formattedErrors: string[] = [];

    if (typeof errors === 'string') {
      formattedErrors.push(errors);
    } else if (Array.isArray(errors)) {
      formattedErrors = (errors as ValidationError[])
        .map((error) => Object.values(error.constraints || {}))
        .flat();
    } else {
      formattedErrors.push('unknown errors');
    }

    client.emit('s.error', {
      client: client.id,
      event: eventPattern,
      errors: formattedErrors,
      timestamp: new Date().toISOString()
    });

    setTimeout(() => client.disconnect(), 500);
  }
}
