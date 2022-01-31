import { User } from './interfaces/user.interface'
import { DATABASE_POOL, REQRES_URL } from './../common/constants'
import {
    Inject,
    Injectable,
    NotFoundException,
    Logger,
    OnModuleInit,
} from '@nestjs/common'
import { Pool } from 'pg'
import { Cron, CronExpression } from '@nestjs/schedule'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import format from 'pg-format'

@Injectable()
export class UsersService implements OnModuleInit {
    private readonly _logger = new Logger(UsersService.name)
    private _users: User[] = []

    constructor(
        @Inject(DATABASE_POOL) private readonly _conn: Pool,
        private readonly _httpService: HttpService,
    ) { }

    async onModuleInit(): Promise<void> {
        const { rows } = await this._conn.query<User>('SELECT * FROM users')

        this._users = rows
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            const { rows } = await this._conn.query<User>(
                'SELECT * FROM users WHERE email=$1',
                [email],
            )

            if (!rows[0]) {
                throw new NotFoundException('User not found')
            }

            return rows[0]
        } catch (error) {
            this._logger.debug(error, 'getUserByEmail method error')

            throw error
        }
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron(): Promise<void> {
        try {
            const externalUsers = await this._getPaginatedExternalUsers()

            const diffUsers = this._diffUsers(externalUsers)

            if (diffUsers.length == 0) {
                this._logger.log('No new users found')
                return
            }

            const params = diffUsers.map(user => Object.values(user))

            // INSERT INTO users (id, email) VALUES ('1', 'jack@mail.ru'), ('2', 'john@mail.ru'), ('3', 'jill@mail.ru') ...
            const sql = format(
                'INSERT INTO users (id, email) VALUES %L',
                params,
            )

            await this._conn.query(sql)
            this._users = this._users.concat(diffUsers)

            this._logger.log(`${diffUsers.length} users added`)

        } catch (error) {

            this._logger.debug(error, 'handleCron method error')
            throw error
        }

    }

    private async _getPaginatedExternalUsers(): Promise<User[]> {
        let users: User[] = []

        const { data: firstData } = await lastValueFrom(
            this._httpService.get(`${REQRES_URL}/users`),
        )

        users = users.concat(firstData.data)

        // i = 2
        for (let i = firstData.page + 1; i <= firstData.total_pages; i++) {
            const { data } = await lastValueFrom(
                this._httpService.get(`${REQRES_URL}/users?page=${i}`),
            )
            users = users.concat(data.data)
        }

        return users
    }

    private _diffUsers(externalUsers: User[]): User[] {

        const users = externalUsers
            .filter(
                (externalUser) =>
                    !this._users.find((user) => user.id === externalUser.id),
            )
            .map((user) => ({ id: user.id, email: user.email }))

        return users
    }

}
