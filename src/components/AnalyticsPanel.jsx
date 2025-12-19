import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useWallet } from '../context/WalletContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPanel() {
  const { transactions } = useWallet();

  // --- 1. Predictive Logic ---
  // Simple Mock: Current Balance + Future Projection
  const currentBalance = transactions.reduce((acc, tx) => 
    tx.type === 'INCOME' ? acc + tx.amount : acc - tx.amount, 0
  );

  const labels = [];
  const historicalData = [];
  const projectedData = [];

  // Generate 15 days of history (simplified)
  for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('pt-PT', { day: 'numeric' }));
    // Mock history curve
    historicalData.push(currentBalance - (i * 50) + (Math.random() * 200)); 
    projectedData.push(null);
  }

  // Generate 15 days of future
  let tempBalance = currentBalance;
  for (let i = 1; i <= 15; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    labels.push(d.toLocaleDateString('pt-PT', { day: 'numeric' }));
    historicalData.push(null);
    
    // Predicitve Algo: Daily Avg Spend Mock (e.g., 40eur/day)
    tempBalance -= 40; 
    projectedData.push(tempBalance);
  }
  
  // Connect the lines
  projectedData[14] = historicalData[14]; 

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Histórico',
        data: historicalData,
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Previsão (IA)',
        data: projectedData,
        borderColor: '#FF2975',
        backgroundColor: 'rgba(255, 41, 117, 0.5)',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Projeção de Saldo (30 Dias)', color: '#fff' },
    },
    scales: {
      y: { display: false },
      x: { ticks: { color: '#666', maxTicksLimit: 6 } }
    }
  };

  // --- 2. Alert Logic (50/30/20) ---
  // Mock check for "Lazer" deviation
  const alerts = [];
  // Hardcoded check for PoC demonstration
  if (true) { 
    alerts.push({
      category: 'Lazer',
      param: '30%',
      current: '45%',
      severity: 'warning'
    });
  }

  return (
    <div className="glass-panel" style={{ marginTop: '1rem', width: '100%' }}>
      
      {/* Alerts Section */}
      {alerts.map((alert, idx) => (
        <div key={idx} style={{ 
          background: 'rgba(255, 206, 86, 0.1)', 
          borderLeft: '4px solid #FFCE56',
          padding: '0.8rem',
          marginBottom: '1rem',
          borderRadius: '4px'
        }}>
          <strong style={{ color: '#FFCE56', display: 'block', marginBottom: '0.2rem' }}>?? Atenção: Desvio de Orçamento</strong>
          <span style={{ fontSize: '0.85rem', color: '#ccc' }}>
            A categoria <b>{alert.category}</b> está a consumir <b>{alert.current}</b> (Ideal: {alert.param}).
          </span>
        </div>
      ))}

      {/* Predictive Chart */}
      <div style={{ height: '200px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      {tempBalance < 0 && (
         <div style={{ 
            marginTop: '1rem', 
            background: 'rgba(255, 41, 117, 0.15)', 
            color: '#FF2975', 
            padding: '0.5rem', 
            borderRadius: '8px',
            fontSize: '0.8rem',
            textAlign: 'center'
         }}>
           ?? <b>Risco Crítico:</b> Saldo negativo previsto em 12 dias.
         </div>
      )}

    </div>
  );
}


