import React, { useState, useEffect } from 'react';
import BlurredPaywall from './BlurredPaywall';

const FeedbackCard = ({ userId, apiKey, month }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          user_id: userId,
          month: month || new Date().toISOString().slice(0, 7),
          expenses: {
            food: 25000,
            rent: 30000,
            transport: 8000,
            entertainment: 12000,
            shopping: 15000,
            utilities: 5000
          }
        })
      });

      if (response.status === 403) {
        setIsPremium(false);
        return;
      }

      const data = await response.json();
      setFeedback(data);
      setIsPremium(data.is_premium);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFeedback();
    }
  }, [userId, month]);

  if (loading) {
    return <div>Loading feedback...</div>;
  }

  if (!feedback) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Monthly Expense Feedback</h2>
        <p>Premium subscription required to view feedback.</p>
        <button onClick={() => window.location.href = '/upgrade'}>
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Monthly Feedback - {feedback.month}</h2>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Total Expenses: NPR {feedback.total_expenses.toLocaleString()}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div>
          <h3 style={{ color: '#4CAF50' }}>✅ What You Did Right</h3>
          {feedback.rights.map((item, index) => (
            <BlurredPaywall
              key={index}
              isPremium={isPremium}
              upgradeMessage="Upgrade to see solutions for all rights"
            >
              <div style={{
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#e8f5e9',
                borderRadius: '5px',
                border: '1px solid #4CAF50'
              }}>
                <h4>{item.title}</h4>
                <p><strong>Amount:</strong> NPR {item.amount.toLocaleString()}</p>
                <p>{item.description}</p>
                {item.solution && (
                  <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#2e7d32' }}>
                    <strong>Solution:</strong> {item.solution}
                  </p>
                )}
              </div>
            </BlurredPaywall>
          ))}
        </div>

        <div>
          <h3 style={{ color: '#f44336' }}>❌ What You Did Wrong</h3>
          {feedback.wrongs.map((item, index) => (
            <BlurredPaywall
              key={index}
              isPremium={isPremium}
              upgradeMessage="Upgrade to see solutions for all wrongs"
            >
              <div style={{
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#ffebee',
                borderRadius: '5px',
                border: '1px solid #f44336'
              }}>
                <h4>{item.title}</h4>
                <p><strong>Amount Wasted:</strong> NPR {item.amount.toLocaleString()}</p>
                <p>{item.description}</p>
                {item.solution && (
                  <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#c62828' }}>
                    <strong>Solution:</strong> {item.solution}
                  </p>
                )}
              </div>
            </BlurredPaywall>
          ))}
        </div>
      </div>

      <div>
        <h3>💡 Suggestions</h3>
        <ul>
          {feedback.suggestions.map((suggestion, index) => (
            <li key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '5px' }}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackCard;

