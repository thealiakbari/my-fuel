import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { caheConfigFactory, postgresConfigFactory, RedisModule } from '@infra';
import { HttpModule } from '@infra';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
	imports: [
		ConfigModule.forRoot({
			expandVariables: true,
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			useFactory: postgresConfigFactory,
			inject: [ConfigService],
		}),
		CacheModule.registerAsync({
			useFactory: caheConfigFactory,
			isGlobal: true,
			inject: [ConfigService],
		}),

		RedisModule,

		HttpModule,
	],
})
export class AppModule {}
