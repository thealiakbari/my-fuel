import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Store } from './store';

@Global()
@Module({
	imports: [ConfigModule],
	providers: [Store],
	exports: [Store],
})
export class RedisModule {}
