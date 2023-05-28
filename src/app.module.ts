import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfigService } from './config/MongooseConfigService';
import config from './config/dbConfig';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BillsModule } from './bills/bills.module';
import { ExpenseCategoriesModule } from './categories/expenses/expenseCategories.module';
import { IncomeCategoriesModule } from './categories/incomes/incomeCategories.module';
import { IncomesModule } from './incomes/incomes.module';
// import { ExpensesModule } from './expenses/expenses.module';

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
    BillsModule,
    IncomeCategoriesModule,
    ExpenseCategoriesModule,
    IncomesModule,
    // ExpensesModule,
  ],
})
export class AppModule { }
