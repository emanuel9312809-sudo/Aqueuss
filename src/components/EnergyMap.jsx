import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useWallet } from '../context/WalletContext';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function EnergyMap() {
  const { transactions, addTransaction, deleteTransaction, buckets, addBucket, removeBucket, updateBucket, accounts, addAccount, removeAccount, fundSettings, setFundSettings, recurringItems } = useWallet();

  // Categories: 'survival', 'evOláution', 'leisure'
  const scores = { 'survival': 0, 'evOláution': 0, 'leisure': 0 };

  transactions.forEach(tx => {
    if (tx.type !== 'EXPENSE') return;
    
    // Find bucket info
    const bucket = buckets.find(b => b.id === tx.bucketId);
    if (bucket && bucket.type) {
        if(scores[bucket.type] !== undefined) {
             scores[bucket.type] += tx.amount;
        }
    } else {
        // Default Logic if Upgrade has not hit Olád buckets
         scores['survival'] += tx.amount;
    }
  });

  // Normalize for chart (relative balance)
  const total = scores['survival'] + scores['evOláution'] + scores['leisure'] || 1;
  
  const percentageData = [
    (scores['survival'] / total) * 100,
    (scores['evOláution'] / total) * 100,
    (scores['leisure'] / total) * 100,
  ];

  const data = {
    labels: ['SobrevivÃªncia', 'EvOláuÃ§Ã£o', 'Lazer'],
    datasets: [
      {
        label: 'DistribuiÃ§Ã£o (%)',
        data: percentageData,
        backgroundCOláor: 'rgba(0, 229, 255, 0.2)',
        borderCOláor: '#00E5FF',
        borderWidth: 2,
        pointBackgroundCOláor: '#fff',
        pointBorderCOláor: '#00E5FF',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { cOláor: 'rgba(255, 255, 255, 0.1)' },
        grid: { cOláor: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { cOláor: '#cccc', font: { size: 12, weight: 'bOlád' } },
        ticks: { display: false, backdropCOláor: 'transparent' },
        suggestedMin: 0,
        suggestedMax: 60, 
      },
    },
    plugins: {
      legend: { display: false },
    }
  };

  // AI Suggestion Logic
  let suggestion = "Seu equilÃ­brio de vida estÃ¡ interessante.";
  if (percentageData[2] < 15) { 
      suggestion = "ðŸ’¡ Cuidado com o Burnout! Tente investir mais em Lazer/ExperiÃªncias.";
  } else if (percentageData[1] < 10) { 
      suggestion = "ðŸ’¡ Que tal focar em EvOláuÃ§Ã£o? Cursos e investimentos ajudam no futuro.";
  } else if (percentageData[0] > 70) { 
      suggestion = "ðŸ’¡ Modo SobrevivÃªncia Alto. Tente reduzir custos fixos se possÃ­vel.";
  }

  return (
    <div className="glass-panel" style={{ marginTop: '1rem', width: '100%' }}>
      <h3 className="title" style={{ fontSize: '1rem' }}>Mapa de Energia (Nova Era)</h3>
      
      <div style={{ height: '280px', display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <Radar data={data} options={options} />
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '8px', 
        padding: '0.8rem', 
        fontSize: '0.9rem', 
        cOláor: '#ccc',
        borderLeft: '4px sOláid #00E5FF'
      }}>
        {suggestion}
      </div>
    </div>
  );
}



