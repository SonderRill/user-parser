import { UsersModule } from './users/users.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { config } from './config/config'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        UsersModule,
        ScheduleModule.forRoot(),
    ],
})
export class AppModule {}
