import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { UserId } from "src/auth/decorators/user-id.decorator";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {};

    @Get("/me")
    @UseGuards(AuthGuard)
    async me(@UserId() userId: number) {
        return await this.usersService.me(userId);
    };

    @Get("/by-username/:username")
    async getUserByUsername(@Param("username") username: string) {
        return await this.usersService.getByUsername(username);
    };

    @Get("/by-id/:id")
    async getUserById(@Param("id", ParseIntPipe) id: number) {
        return await this.usersService.getById(id);
    };

    @Get("/all-users")
    async allUsers() {
        return await this.usersService.allUsers();
    };
}