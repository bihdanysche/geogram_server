import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifcations.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UserId } from "../auth/decorators/user-id.decorator";
import { PaginationDTO } from "src/common/dtos/PaginationDTO";

@Controller("/notifications")
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService
    ) {}

    @Get("/")
    @UseGuards(AuthGuard)
    async getNotifications(@UserId() userId: number, @Query() pagination: PaginationDTO) {
        return await this.notificationsService.getNotifications(userId, pagination);
    }
}