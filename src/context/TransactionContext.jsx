import { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

const DEFAULT_BUCKETS = [
  { id: 'needs', name: 'Necessidades', target: 50, color: '#4BC0C0', icon: '??', type: 'survival' },
  { id: 'wants', name: 'Lazer', target: 30, color: '#FF9F40', icon: '??', type: 'leisure' },
  { id: 'savings', name: 'Investimentos', target: 20, color: '#36A2EB', icon: '??', type: 'evolution' },
];

const DEFAULT_ACCOUNTS = [
  { id: 'bank-a', name: 'Banco A', type: 'bank', balance: 0 },
  { id: 'cash', name: 'Carteira Física', type: 'cash', balance: 0 },
];

export const TransactionProvider = ({ children }) => {
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

  // Gamification State
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, nextLevel: 100 });
  const [missions, setMissions] = useState([
    { id: 'daily-1', type: 'daily', desc: 'Registrar 1 Transação', xp: 50, completed: false },
    { id: 'weekly-1', type: 'weekly', desc: 'Poupar 10€ (Fundo)', xp: 200, completed: false }, 
  ]);

  useEffect(() => {
    const loadedTx = localStorage.getItem('aequus_transactions');
    const loadedBuckets = localStorage.getItem('aequus_buckets');
    const loadedAccounts = localStorage.getItem('aequus_accounts');
    const loadedFund = localStorage.getItem('aequus_fund');
    const loadedRecurring = localStorage.getItem('aequus_recurring');
    const loadedStats = localStorage.getItem('aequus_stats');
    
    if (loadedTx) setTransactions(JSON.parse(loadedTx));
    if (loadedBuckets) setBuckets(JSON.parse(loadedBuckets));
    if (loadedAccounts) setAccounts(JSON.parse(loadedAccounts));
    if (loadedFund) setFundSettings(JSON.parse(loadedFund));
    if (loadedRecurring) setRecurringItems(JSON.parse(loadedRecurring));
    if (loadedStats) setUserStats(JSON.parse(loadedStats));

    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    localStorage.setItem('aequus_transactions', JSON.stringify(transactions));
    localStorage.setItem('aequus_buckets', JSON.stringify(buckets));
    localStorage.setItem('aequus_accounts', JSON.stringify(accounts));
    localStorage.setItem('aequus_fund', JSON.stringify(fundSettings));
    localStorage.setItem('aequus_recurring', JSON.stringify(recurringItems));
    localStorage.setItem('aequus_stats', JSON.stringify(userStats));
  }, [transactions, buckets, accounts, fundSettings, recurringItems, userStats, dataLoaded]);

  const gainXP = (amount) => {
      setUserStats(prev => {
          let newXP = prev.xp + amount;
          let newLevel = prev.level;
          let newNext = prev.nextLevel;
          
          if (newXP >= newNext) {
              newLevel += 1;
              newXP = newXP - newNext;
              newNext = Math.floor(newNext * 1.5); 
              alert(?? PARABÉNS! Você subiu para o Nível !);
              checkSmartReward();
          }
          return { level: newLevel, xp: newXP, nextLevel: newNext };
      });
  };

  const checkSmartReward = () => {
      const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0);
      const available = totalIncome - totalExpense;
      const REWARD_AMOUNT = 20; 

      if (available >= REWARD_AMOUNT) {
          if (window.confirm(?? Recompensa de Nível Disponível!\n\nVocê tem saldo livre. Deseja separar € para LAZER agora?)) {
              alert(? € foram marcados para o seu Lazer! Aproveite!);
          }
      } else {
          alert('?? Nível Subiu! (Mas sem saldo livre para recompensa hoje.)');
      }
  };

  const checkMissions = (action) => {
      if (action === 'ADD_TRANSACTION') {
          setMissions(prev => prev.map(m => {
              if (m.type === 'daily' && !m.completed) {
                  gainXP(m.xp);
                  return { ...m, completed: true };
              }
              return m;
          }));
      }
  };

  const addTransaction = (transaction) => {
    if (transaction.isRecurring) {
        const recurringItem = {
            id: Date.now(),
            amount: transaction.amount,
            day: new Date().getDate(),
            accountId: transaction.accountId,
            lastProcessed: ${new Date().getFullYear()}-
        };
        setRecurringItems(prev => [...prev, recurringItem]);
    }

    const newTx = { ...transaction, id: Date.now(), type: transaction.type || 'EXPENSE' };
    
    if (newTx.type === 'INCOME' && fundSettings.active) {
        const deduction = (newTx.amount * fundSettings.percentage) / 100;
        const netAmount = newTx.amount - deduction;
        const incomeTx = { ...newTx, amount: netAmount, note: (newTx.note || '') +  (Fundo %) };
        setFundSettings(prev => ({ ...prev, balance: prev.balance + deduction }));
        setTransactions(prev => [incomeTx, ...prev]);
        updateAccountBalance(incomeTx.accountId, netAmount, 'INCOME');
    } else {
        setTransactions(prev => [newTx, ...prev]);
        updateAccountBalance(newTx.accountId, newTx.amount, newTx.type);
    }
    
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

  const addBucket = (name, target, type = 'survival') => {
      const newBucket = { 
          id: Date.now().toString(), 
          name, 
          target: Number(target), 
          color: '#' + Math.floor(Math.random()*16777215).toString(16), 
          icon: '??',
          type 
      };
      setBuckets(prev => [...prev, newBucket]);
  };
  
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
      recurringItems,
      userStats, missions 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
