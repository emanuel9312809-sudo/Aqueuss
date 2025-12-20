
// --- FINANCE LOGIC MODULE ---
// Handles transactions, budget buckets, and financial calculations.

// --- CORE UTILS ---
export const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

// --- BUCKET LOGIC ---
export const DEFAULT_BUCKETS = [
    { id: 'needs', name: 'Necessidades', percentage: 50, color: '#FF3B30' }, // Red
    { id: 'wants', name: 'Desejos', percentage: 30, color: '#32D74B' },    // Green
    { id: 'savings', name: 'Poupanças', percentage: 20, color: '#0A84FF' }  // Blue
];

export const calculateBucketAllocation = (income, buckets) => {
    // Calculates how much money goes into each bucket based on income
    return buckets.map(bucket => ({
        ...bucket,
        allocatedAmount: (income * bucket.percentage) / 100
    }));
};

// --- TRANSACTION MANAGEMENT ---
export const addTransaction = (transactions, newTransaction) => {
    // Adds a transaction with a unique ID and timestamp
    const transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...newTransaction
    };
    return [transaction, ...transactions];
};

export const deleteTransaction = (transactions, id) => {
    return transactions.filter(t => t.id !== id);
};
