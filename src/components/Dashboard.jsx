import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Sparkles, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useInventory } from '../context/InventoryContext';
import WolfPet from './WolfPetV2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactions } = useWallet();
  const { items } = useInventory(); // Get Inventory for Net Worth

  // --- Financial Calculations ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions.filter(tx => tx.type === 'INCOME').reduce((acc, tx) => acc + tx.amount, 0);
  const expenses = monthlyTransactions.filter(tx => tx.type === 'EXPENSE').reduce((acc, tx) => acc + tx.amount, 0);
  
  // Cash Balance
  const cashBalance = transactions.reduce((acc, tx) => tx.type === 'INCOME' ? acc + tx.amount : acc - tx.amount, 0);
  
  // Inventory Value (Cost basis or sell price? Let's use Buy Price for conservative Net Worth, or Sold Price for potential)
  // Let's use "Asset Value" = Buy Price of unsold items.
  const stockValue = items.filter(i => i.status === 'available').reduce((acc, i) => acc + (Number(i.buyPrice) || 0), 0);
  
  // Total Net Worth
  const netWorth = cashBalance + stockValue;

  // Chart Data
  const categoryTotals = {};
  monthlyTransactions.filter(tx => tx.type === 'EXPENSE').forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00E5FF', '#FF2975'],
        borderWidth: 0,
    }],
  };
  const options = { plugins: { legend: { position: 'right', labels: { color: '#fff', boxWidth: 10, font: { size: 10 } } } } };

  if (transactions.length === 0 && items.length === 0) {
    return (
       <div className="glass-panel" style={{ width: '100%', textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Sparkles size={48} color="#00E5FF" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Bem-vindo ao Aequus!</h2>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Seu império começa aqui.</p>
        <button onClick={() => navigate('/add')} style={{ background: 'var(--accent-primary)', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 'bold' }}>Começar</button>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ width: '100%', paddingBottom: '1rem' }}>
      
      {/* Header with Wolf & Net Worth */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>Patrimônio Líquido (Net Worth)</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>
                {netWorth.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </h2>
              <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '4px' }}>
                  💰 Cash: {cashBalance.toFixed(0)}€ | ⌚ Game: {stockValue.toFixed(0)}€
              </div>
          </div>
          
          {/* Mini Wolf Widget */}
          <div onClick={() => navigate('/quest')} style={{ cursor: 'pointer' }}>
            <WolfPet minimal={true} />
          </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />

      {/* Monthly Flow */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#00E5FF', fontWeight: 'bold' }}>+{income.toFixed(0)}&euro;</p>
          <span style={{ fontSize: '0.7rem', color: '#666' }}>Entradas</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#FF2975', fontWeight: 'bold' }}>-{expenses.toFixed(0)}&euro;</p>
          <span style={{ fontSize: '0.7rem', color: '#666' }}>Saídas</span>
        </div>
      </div>

      {/* Chart */}
      {Object.keys(categoryTotals).length > 0 && (
        <div style={{ marginTop: '1.5rem', height: '180px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}