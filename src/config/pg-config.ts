import { ConfigService } from '@nestjs/config'
import { Pool } from 'pg'

const DEFAULT_PSQL_HOST = 'localhost'
const DEFAULT_PSQL_PORT = 5432

export const pgConfig = (configService: ConfigService): Pool => {
    return new Pool({
        user: configService.get('PSQL_USERNAME'),
        host: configService.get('PSQL_HOST', DEFAULT_PSQL_HOST),
        database: configService.get('PSQL_DATABASE'),
        password: configService.get('PSQL_PASSWORD'),
        port: configService.get('PSQL_PORT', DEFAULT_PSQL_PORT),
    })
}
