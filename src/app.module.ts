import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfigService } from './config/MongooseConfigService';
import config from './config/dbConfig';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BillModule } from './bills/bills.module';
import { CategoriesModule } from './categories/categories.module';
import { CostsModule } from './costs/costs.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    UsersModule,
    AuthModule,
    BillModule,
    CategoriesModule,
    CostsModule,
  ],
})
export class AppModule { }
