import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BillsService } from 'src/bills/bills.service';
import { ExpensesService } from 'src/expenses/expenses.service';
import { IncomesService } from 'src/incomes/incomes.service';

@Injectable()
export class ClearService {
  constructor(
    private billsService: BillsService,
    private incomesServise: IncomesService,
    private expensesService: ExpensesService,
  ) { }

  async clearBillInfo(billId: string, userId: string) {
    const bill = await this.billsService.findOneBill(billId, userId);
    if (!bill) return;
    const deletedIncomes = await this.incomesServise.deleteIncomesBillId(billId, userId);
    const deletedExpenses = await this.expensesService.deleteExpensesBillId(billId, userId);
    const deletedBill = await this.billsService.deleteBill(billId, userId);
    return { 
      deletedBill: deletedBill.deletedCount,
      deletedIncomes: deletedIncomes.deletedCount,
      deletedExpenses: deletedExpenses.deletedCount 
    }
  }
}