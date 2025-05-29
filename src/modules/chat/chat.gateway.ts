import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from '../../common/ws-exception/ws-exception.filter';
import { SendMessageDto } from './dtos/send-message.dto';

@UseFilters(WsExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors) => new WsException(errors)
  })
)
@WebSocketGateway(80, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;

  afterInit(server: Server): void {}

  handleConnection(@ConnectedSocket() client: Socket): void {
    client.broadcast.emit('s.user.joined', { client: client.id });
    console.log('client connected', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    client.broadcast.emit('s.user.leaved', { client: client.id });
    console.log('client disconnected', client.id);
  }

  @SubscribeMessage('c.message.send')
  handleSendMessage(
    @MessageBody()
    payload: SendMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('s.message.new', { ...payload, client: client.id });
  }
}
