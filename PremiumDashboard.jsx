import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PremiumDashboard = ({ userId, apiKey }) => {
  const [adviceData, setAdviceData] = useState(null);
  const [simulationData, setSimulationData] = useState([]);
  const [loading, setLoading] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const fetchAdvice = async (category = 'invest') => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          category,
          message: "I want to invest my savings",
          monthly_income_npr: 100000,
          monthly_expenses_npr: { food: 20000, rent: 30000, transport: 5000 },
          current_savings_npr: 500000,
          location: "kathmandu",
          mode: "indepth",
          persona: "laxmi-didi",
          user_name: "Sita",
          is_premium: true,
          user_id: userId
        })
      });
      const data = await response.json();
      setAdviceData(data);
      if (data.simulation) {
        setSimulationData(data.simulation);
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAdvice();
    }
  }, [userId]);

  const portfolioData = adviceData?.alternatives?.map(alt => ({
    name: alt.name,
    value: alt.price_npr,
    months: alt.months_needed
  })) || [];

  return (
    <div className="premium-dashboard" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Premium Dashboard - Mero Paisa Guru</h1>
      
      {loading && <p>Loading...</p>}
      
      {adviceData && (
        <>
          <div style={{ marginBottom: '30px' }}>
            <h2>Investment Portfolio Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {adviceData.visualization && (
            <div style={{ marginBottom: '30px' }}>
              <h2>Progress Visualization</h2>
              <p>{adviceData.visualization.description}</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: 'Progress', value: adviceData.visualization.data.progress }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {simulationData.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2>12-Month Investment Simulation</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Value (NPR)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `NPR ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="total_value" stroke="#8884d8" name="Total Value" />
                  <Line type="monotone" dataKey="fd_value" stroke="#82ca9d" name="Fixed Deposit" />
                  <Line type="monotone" dataKey="shares_value" stroke="#ffc658" name="Shares" />
                  <Line type="monotone" dataKey="mutual_funds_value" stroke="#ff7300" name="Mutual Funds" />
                  <Line type="monotone" dataKey="gold_value" stroke="#ffc0cb" name="Gold" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div style={{ marginTop: '30px' }}>
            <h2>Financial Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Target Amount</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>NPR {adviceData.target_amount_npr.toLocaleString()}</p>
              </div>
              <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Progress</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{adviceData.progress_percent}%</p>
              </div>
              <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Monthly Savings</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>NPR {adviceData.realistic_monthly_savings_npr.toLocaleString()}</p>
              </div>
              <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Months Needed</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{adviceData.months_needed} months</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PremiumDashboard;

