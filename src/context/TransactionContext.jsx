import { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

const DEFAULT_BUCKETS = [
  { id: 'needs', name: 'Necessidades', target: 50, color: '#4BC0C0', icon: '🏠' },
  { id: 'wants', name: 'Lazer', target: 30, color: '#FF9F40', icon: '🎉' },
  { id: 'savings', name: 'Investimentos', target: 20, color: '#36A2EB', icon: '📈' },
];

const DEFAULT_ACCOUNTS = [
  { id: 'bank-a', name: 'Banco A', type: 'bank', balance: 0 },
  { id: 'cash', name: 'Carteira Física', type: 'cash', balance: 0 },
];

export const TransactionProvider = ({ children }) => {
  // Load State from LocalStorage or use Defaults
  const [dataLoaded, setDataLoaded] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [buckets, setBuckets] = useState(DEFAULT_BUCKETS);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [fundSettings, setFundSettings] = useState({
    active: false,
    name: 'Fundo Automático',
    percentage: 10,
    balance: 0 
  });
  const [recurringItems, setRecurringItems] = useState([]);

  // --- 1. Load Data on Mount ---
  useEffect(() => {
    const loadedTx = localStorage.getItem('aequus_transactions');
    const loadedBuckets = localStorage.getItem('aequus_buckets');
    const loadedAccounts = localStorage.getItem('aequus_accounts');
    const loadedFund = localStorage.getItem('aequus_fund');
    const loadedRecurring = localStorage.getItem('aequus_recurring');

    if (loadedTx) setTransactions(JSON.parse(loadedTx));
    if (loadedBuckets) setBuckets(JSON.parse(loadedBuckets));
    if (loadedAccounts) setAccounts(JSON.parse(loadedAccounts));
    if (loadedFund) setFundSettings(JSON.parse(loadedFund));
    if (loadedRecurring) setRecurringItems(JSON.parse(loadedRecurring));
    
    setDataLoaded(true);
  }, []);

  // --- 2. Save Data on Change ---
  useEffect(() => {
    if (!dataLoaded) return;
    localStorage.setItem('aequus_transactions', JSON.stringify(transactions));
    localStorage.setItem('aequus_buckets', JSON.stringify(buckets));
    localStorage.setItem('aequus_accounts', JSON.stringify(accounts));
    localStorage.setItem('aequus_fund', JSON.stringify(fundSettings));
    localStorage.setItem('aequus_recurring', JSON.stringify(recurringItems));
  }, [transactions, buckets, accounts, fundSettings, recurringItems, dataLoaded]);


  // --- 3. Recurring Engine Check ---
  useEffect(() => {
    if (!dataLoaded) return;
    
    // Simple logic: Check if a recurring item needs to run for *this month*
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${today.getMonth()}`; // "2024-11"

    let newTxs = [];
    let updatedRecurring = [...recurringItems];

    updatedRecurring = updatedRecurring.map(item => {
        // If last processed was NOT this month, and today >= expected day
        if (item.lastProcessed !== currentMonth && today.getDate() >= item.day) {
            
            // Generate Income
            const newTx = {
                id: Date.now() + Math.random(),
                amount: item.amount,
                type: 'INCOME',
                category: 'Rendimento Recorrente',
                date: new Date().toISOString(),
                accountId: item.accountId,
                note: `Recorrente (Dia ${item.day})`
            };
            
            // Trigger Auto-Fund Logic manually for this tx
             if (fundSettings.active) {
                const deduction = (newTx.amount * fundSettings.percentage) / 100;
                newTx.amount -= deduction;
                newTx.originalAmount = item.amount;
                newTx.note += ` (Deduzido ${fundSettings.percentage}%)`;
                
                // Update Fund Balance (Needs to be done safely, here strictly for effect)
                setFundSettings(prev => ({ ...prev, balance: prev.balance + deduction }));
            }

            newTxs.push(newTx);
            return { ...item, lastProcessed: currentMonth };
        }
        return item;
    });

    if (newTxs.length > 0) {
        setTransactions(prev => [...newTxs, ...prev]);
        setRecurringItems(updatedRecurring);
        
        // Update Account Balances
         setAccounts(prev => prev.map(acc => {
            const incomeForAccount = newTxs
                .filter(t => t.accountId === acc.id)
                .reduce((sum, t) => sum + t.amount, 0);
            return incomeForAccount > 0 ? { ...acc, balance: acc.balance + incomeForAccount } : acc;
         }));

        alert(`🔄 ${newTxs.length} transação(ões) recorrente(s) processada(s)!`);
    }

  }, [dataLoaded]); // Run once after data load


  // --- Actions ---

  const addTransaction = (transaction) => {
    // If "isRecurring" flag is passed
    if (transaction.isRecurring) {
        const recurringItem = {
            id: Date.now(),
            amount: transaction.amount,
            day: new Date().getDate(), // Sets recurrence to "Today's Day"
            accountId: transaction.accountId,
            lastProcessed: `${new Date().getFullYear()}-${new Date().getMonth()}` // Mark as done for this month
        };
        setRecurringItems(prev => [...prev, recurringItem]);
    }

    const newTx = { 
      ...transaction, 
      id: Date.now(),
      type: transaction.type || 'EXPENSE' 
    };

    // Auto-Fund Logic (Duplicate from before, simpler)
    if (newTx.type === 'INCOME' && fundSettings.active) {
        const deduction = (newTx.amount * fundSettings.percentage) / 100;
        const netAmount = newTx.amount - deduction;
        
        const incomeTx = { ...newTx, amount: netAmount, note: (newTx.note || '') + ` (Fundo ${fundSettings.percentage}%)` };
        
        setFundSettings(prev => ({ ...prev, balance: prev.balance + deduction }));
        setTransactions(prev => [incomeTx, ...prev]);
        // Update Account
        updateAccountBalance(incomeTx.accountId, netAmount, 'INCOME');

    } else {
        setTransactions(prev => [newTx, ...prev]);
        updateAccountBalance(newTx.accountId, newTx.amount, newTx.type);
    }
  };

  const updateAccountBalance = (accountId, amount, type) => {
      if (!accountId) return;
      setAccounts(prev => prev.map(acc => {
        if (acc.id === accountId) {
            return {
                ...acc,
                balance: type === 'INCOME' ? acc.balance + amount : acc.balance - amount
            };
        }
        return acc;
    }));
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    // Revert Account Balance
    if (tx.accountId) {
         setAccounts(prev => prev.map(acc => {
            if (acc.id === tx.accountId) {
                return {
                    ...acc,
                    balance: tx.type === 'INCOME' ? acc.balance - tx.amount : acc.balance + tx.amount
                };
            }
            return acc;
        }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Helper Wrappers
  const addBucket = (name, target) => setBuckets(prev => [...prev, { id: Date.now().toString(), name, target: Number(target), color: '#'+Math.floor(Math.random()*16777215).toString(16), icon: '📦' }]);
  const removeBucket = (id) => setBuckets(prev => prev.filter(b => b.id !== id));
  const updateBucket = (id, updates) => setBuckets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  
  const addAccount = (name, type, initialBalance) => setAccounts(prev => [...prev, { id: Date.now().toString(), name, type, balance: Number(initialBalance) }]);
  const removeAccount = (id) => setAccounts(prev => prev.filter(a => a.id !== id));

  return (
    <TransactionContext.Provider value={{ 
      transactions, addTransaction, deleteTransaction,
      buckets, addBucket, removeBucket, updateBucket,
      accounts, addAccount, removeAccount,
      fundSettings, setFundSettings,
      recurringItems 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
