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
import { useTransaction } from '../context/TransactionContext';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function EnergyMap() {
  const { transactions } = useTransaction();

  // --- 3-Axis Logic ---
  // Needs: Housing, Health, Food
  // Growth: Education, Savings/Investments
  // Experiences: Leisure, Shopping, Travel

  const axes = {
    'Necessidades': ['Habitação', 'Saúde', 'Comida', 'Transporte'],
    'Crescimento': ['Educação', 'Investimentos', 'Poupança'],
    'Experiências': ['Lazer', 'Compras', 'Viagem']
  };

  const scores = { 'Necessidades': 0, 'Crescimento': 0, 'Experiências': 0 };

  transactions.forEach(tx => {
    if (tx.type !== 'EXPENSE') return;
    
    if (axes['Necessidades'].includes(tx.category)) scores['Necessidades'] += tx.amount;
    else if (axes['Crescimento'].includes(tx.category)) scores['Crescimento'] += tx.amount;
    else scores['Experiências'] += tx.amount; // Fallback to experiences
  });

  // Calculate percentages (Mock Budget logic)
  // Assume generic budgets for PoC: Needs 1500, Growth 500, Exp 500
  const totals = { 'Necessidades': 1500, 'Crescimento': 500, 'Experiências': 500 };
  
  const percentageData = [
    Math.min((scores['Necessidades'] / totals['Necessidades']) * 100, 100),
    Math.min((scores['Crescimento'] / totals['Crescimento']) * 100, 100),
    Math.min((scores['Experiências'] / totals['Experiências']) * 100, 100),
  ];

  const data = {
    labels: ['Necessidades (Base)', 'Crescimento (Futuro)', 'Experiências (Alma)'],
    datasets: [
      {
        label: 'Equilíbrio Atual (%)',
        data: percentageData,
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
        borderColor: '#00E5FF',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#00E5FF',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#cccc', font: { size: 12, weight: 'bold' } },
        ticks: { display: false, backdropColor: 'transparent' },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
    }
  };

  // AI Suggestion Logic
  const expScore = percentageData[2]; // Experiences
  const growthScore = percentageData[1]; // Growth
  
  let suggestion = "O seu equilíbrio financeiro parece saudável.";
  if (expScore > 40 && growthScore < 20) {
    suggestion = "💡 Dica da IA: O eixo de Experiências está alto. Tente realocar 5% para Crescimento no próximo mês.";
  }

  return (
    <div className="glass-panel" style={{ marginTop: '1rem', width: '100%' }}>
      <h3 className="title" style={{ fontSize: '1rem' }}>Mapa de Energia Financeira</h3>
      
      <div style={{ height: '280px', display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <Radar data={data} options={options} />
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '8px', 
        padding: '0.8rem', 
        fontSize: '0.9rem', 
        color: '#ccc',
        borderLeft: '4px solid #00E5FF'
      }}>
        {suggestion}
      </div>
    </div>
  );
}
