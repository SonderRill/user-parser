import { User } from './interfaces/user.interface'
import { UsersService } from './users.service'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('users')
export class UsersController {
    constructor(private readonly _userService: UsersService) {}

    @Get(':email')
    async getUserByEmail(@Param() { email }: { email: string }): Promise<User> {
        const user = await this._userService.getUserByEmail(email)
        return user
    }
}
