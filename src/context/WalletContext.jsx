import { createContext, useContext, useState, useEffect } from 'react';
import { useGamification } from './GamificationContext';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

const DEFAULT_BUCKETS = [
  { id: 'needs', name: 'Necessidades', target: 50, color: '#4BC0C0', icon: '💰', type: 'survival' },
  { id: 'wants', name: 'Lazer', target: 30, color: '#FF9F40', icon: '💰', type: 'leisure' },
  { id: 'savings', name: 'Investimentos', target: 20, color: '#36A2EB', icon: '💰', type: 'evolution' },
];

const DEFAULT_ACCOUNTS = [
  { id: 'bank-a', name: 'Banco A', type: 'bank', balance: 0 },
  { id: 'cash', name: 'Carteira Física', type: 'cash', balance: 0 },
];

export const WalletProvider = ({ children }) => {
  const { gainXP, checkMissions } = useGamification();

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

  useEffect(() => {
    if (!dataLoaded) return;
    localStorage.setItem('aequus_transactions', JSON.stringify(transactions));
    localStorage.setItem('aequus_buckets', JSON.stringify(buckets));
    localStorage.setItem('aequus_accounts', JSON.stringify(accounts));
    localStorage.setItem('aequus_fund', JSON.stringify(fundSettings));
    localStorage.setItem('aequus_recurring', JSON.stringify(recurringItems));
  }, [transactions, buckets, accounts, fundSettings, recurringItems, dataLoaded]);

  const addTransaction = (transaction) => {
    if (transaction.isRecurring) {
        const recurringItem = {
            id: Date.now(),
            amount: transaction.amount,
            day: new Date().getDate(),
            accountId: transaction.accountId,
            lastProcessed: new Date().getFullYear() + '-' + new Date().getMonth()
        };
        setRecurringItems(prev => [...prev, recurringItem]);
    }

    const newTx = { ...transaction, id: Date.now(), type: transaction.type || 'EXPENSE' };
    
    if (newTx.type === 'INCOME' && fundSettings.active) {
        const deduction = (newTx.amount * fundSettings.percentage) / 100;
        const netAmount = newTx.amount - deduction;
        const incomeTx = { ...newTx, amount: netAmount, note: (newTx.note || '') + ' (Fundo ' + fundSettings.percentage + '%)' };
        setFundSettings(prev => ({ ...prev, balance: prev.balance + deduction }));
        setTransactions(prev => [incomeTx, ...prev]);
        updateAccountBalance(incomeTx.accountId, netAmount, 'INCOME');
    } else {
        setTransactions(prev => [newTx, ...prev]);
        updateAccountBalance(newTx.accountId, newTx.amount, newTx.type);
    }
    
    // Call Gamification Context
    gainXP(10); 
    checkMissions('ADD_TRANSACTION');
  };

  const updateAccountBalance = (accountId, amount, type) => {
      if (!accountId) return;
      setAccounts(prev => prev.map(acc => {
        if (acc.id === accountId) {
            return { ...acc, balance: type === 'INCOME' ? acc.balance + amount : acc.balance - amount };
        }
        return acc;
    }));
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    if (tx.accountId) {
         setAccounts(prev => prev.map(acc => {
            if (acc.id === tx.accountId) {
                return { ...acc, balance: tx.type === 'INCOME' ? acc.balance - tx.amount : acc.balance + tx.amount };
            }
            return acc;
        }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBucket = (name, target, type = 'survival', icon = '💰') => {
      const newBucket = { 
          id: Date.now().toString(), 
          name, 
          target: Number(target), 
          color: '#' + Math.floor(Math.random()*16777215).toString(16), 
          icon: '💰',
          type 
      };
      setBuckets(prev => [...prev, newBucket]);
  };
  
  const removeBucket = (id) => setBuckets(prev => prev.filter(b => b.id !== id));
  const updateBucket = (id, updates) => setBuckets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  
  const addAccount = (name, type, initialBalance) => setAccounts(prev => [...prev, { id: Date.now().toString(), name, type, balance: Number(initialBalance) }]);
  const removeAccount = (id) => setAccounts(prev => prev.filter(a => a.id !== id));

  return (
    <WalletContext.Provider value={{ 
      transactions, addTransaction, deleteTransaction,
      buckets, addBucket, removeBucket, updateBucket,
      accounts, addAccount, removeAccount,
      fundSettings, setFundSettings,
      recurringItems
    }}>
      {children}
    </WalletContext.Provider>
  );
};

