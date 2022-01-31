import { DbModule } from './../db-module/db-module.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [HttpModule, DbModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
