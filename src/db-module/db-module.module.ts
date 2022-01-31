import { DATABASE_POOL } from './../common/constants'
import { pgConfig } from './../config/pg-config'
import { ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'

const provider = {
    provide: DATABASE_POOL,
    inject: [ConfigService],
    useFactory: pgConfig,
}

@Module({
    providers: [provider],
    exports: [provider],
})
export class DbModule {}
