import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Download, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import SuccessScreen from './SuccessScreen';

const transactions = [
  { id: 'T-001', type: 'income' as const, category: 'Sale', amount: 8500, mode: 'cash' as const, date: '2024-11-15', description: 'Sale to Rajesh Kumar' },
  { id: 'T-002', type: 'expense' as const, category: 'Purchase', amount: 18500, mode: 'online' as const, date: '2024-11-15', description: 'Purchase from ABC Wholesalers' },
  { id: 'T-003', type: 'income' as const, category: 'Sale', amount: 12450, mode: 'online' as const, date: '2024-11-14', description: 'Sale to Priya Sharma' },
  { id: 'T-004', type: 'expense' as const, category: 'Expense', amount: 2500, mode: 'cash' as const, date: '2024-11-14', description: 'Transportation charges' },
  { id: 'T-005', type: 'expense' as const, category: 'Expense', amount: 1500, mode: 'cash' as const, date: '2024-11-13', description: 'Staff wages' },
  { id: 'T-006', type: 'income' as const, category: 'Sale', amount: 15200, mode: 'cash' as const, date: '2024-11-13', description: 'Sale to Amit Patel' },
];

export default function Transactions() {
  const [filter, setFilter] = useState<'all' | 'cash' | 'online'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'cash' | 'online'>('cash');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredTransactions = transactions.filter(
    (t) => filter === 'all' || t.mode === filter
  );

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleSaveTransaction = () => {
    setIsAddDialogOpen(false);
    setShowSuccess(true);
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setIsAddDialogOpen(true);
    setCategory('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleGoToDashboard = () => {
    setShowSuccess(false);
    setCategory('');
    setAmount('');
    setDescription('');
  };

  const handleExport = () => {
    alert('Exporting transactions to Excel...');
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        type="transaction"
        data={{
          amount: parseFloat(amount),
          transactionType: transactionType,
          mode: mode,
          date: date,
        }}
        onAddAnother={handleAddAnother}
        onGoToDashboard={handleGoToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900">Transactions</h1>
            <p className="text-gray-500 text-sm">Manage all income and expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="rounded-xl h-11"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl h-11 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Transaction Type</Label>
                    <Select value={transactionType} onValueChange={(value: 'income' | 'expense') => setTransactionType(value)}>
                      <SelectTrigger className="mt-1.5 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Sale, Purchase, Salary"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1.5 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1.5 h-12"
                    />
                  </div>

                  <div>
                    <Label>Payment Mode</Label>
                    <Select value={mode} onValueChange={(value: 'cash' | 'online') => setMode(value)}>
                      <SelectTrigger className="mt-1.5 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add notes or description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1.5 min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1 h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveTransaction}
                      className="flex-1 h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Income</div>
                <div className="text-gray-900 text-xl">₹{totalIncome.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Expense</div>
                <div className="text-gray-900 text-xl">₹{totalExpense.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Net Balance</div>
                <div className={`text-xl ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{(totalIncome - totalExpense).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select value={filter} onValueChange={(value: 'all' | 'cash' | 'online') => setFilter(value)}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="cash">Cash Only</SelectItem>
                <SelectItem value="online">Online Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
          <h2 className="text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">{transaction.category}</div>
                  <div className="text-gray-500 text-sm mb-1">{transaction.description}</div>
                  <div className="text-gray-400 text-xs">{transaction.date} • {transaction.mode}</div>
                </div>
                <div className={`text-xl ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
