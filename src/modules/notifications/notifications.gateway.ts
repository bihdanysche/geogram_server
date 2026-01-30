import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, type WsResponse } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { AppConfig } from "src/config/app.config";
import * as cookie from "cookie";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";

interface ExtendedSocket extends Socket {
  data: {
    userId: number,
    sessionId: number
  }
};

@WebSocketGateway({
    cors: {
        origin: AppConfig.originURL,
        credentials: true,
    },
    namespace: "notifications",
    transports: ["websocket"]
})
export class NotificationsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const rawCookie = client.handshake.headers.cookie;

        if (!rawCookie) {
            client.disconnect();
            return;
        }

        const cookies = cookie.parse(rawCookie);
        const accessToken = cookies['access_token'];

        if (!accessToken) {
            client.disconnect();
            return;
        }
    }

    @SubscribeMessage('listenNewNotifications')
    @UseGuards(AuthGuard)
    joinNotifRoom(@ConnectedSocket() client: ExtendedSocket): WsResponse|undefined {
        const roomName = this.getRoomIdForUser(client.data.userId);

        if (client.rooms.has(roomName)) {
            return;
        }

        void client.join(roomName);
        
        return {
            event: "auth_success",
            data: null
        };
    }

    getRoomIdForUser(id: number) {
        return `user:${id}`;
    }
}