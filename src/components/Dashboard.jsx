import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useWallet } from '../context/WalletContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { transactions, addTransaction, deleteTransaction, buckets, addBucket, removeBucket, updateBucket, accounts, addAccount, removeAccount, fundSettings, setFundSettings, recurringItems } = useWallet();

  // Basic Financials
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions
    .filter(tx => tx.type === 'INCOME')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const expenses = monthlyTransactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((acc, tx) => acc + tx.amount, 0);

  // Simulated Balance (Cumulative Mock)
  // In a real app this would be more complex, here we just show Monthly Net
  const balance = transactions.reduce((acc, tx) => {
    return tx.type === 'INCOME' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  // Breakdown for Doughnut
  const categoryTotals = {};
  monthlyTransactions
    .filter(tx => tx.type === 'EXPENSE')
    .forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundcolor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#fff', boxWidth: 10 }
      }
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {balance.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
      </h2>
      <p style={{ color: '#a0a0a0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Saldo Total Estimado <span style={{ fontSize: '0.7rem', color: '#00E5FF', border: '1px solid #00E5FF', padding: '1px 4px', borderRadius: '4px' }}>LIVE ?</span></p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#00E5FF' }}>+{income.toFixed(0)}&euro;</p>
          <span style={{ fontSize: '0.7rem', color: '#666' }}>Entradas (Mês)</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#FF2975' }}>-{expenses.toFixed(0)}&euro;</p>
          <span style={{ fontSize: '0.7rem', color: '#666' }}>Saídas (Mês)</span>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', height: '180px', display: 'flex', justifyContent: 'center' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}





