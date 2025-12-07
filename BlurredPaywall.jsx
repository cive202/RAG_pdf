import React from 'react';

const BlurredPaywall = ({ children, isPremium, upgradeMessage = "Upgrade to Premium to unlock this feature" }) => {
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        filter: 'blur(5px)', 
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px 40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        zIndex: 10,
        border: '2px solid #4CAF50'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔒</div>
        <h3 style={{ margin: '10px 0', color: '#333' }}>Premium Feature</h3>
        <p style={{ margin: '10px 0', color: '#666' }}>{upgradeMessage}</p>
        <button style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginTop: '10px'
        }} onClick={() => window.location.href = '/upgrade'}>
          Upgrade to Premium - ₹199/month
        </button>
      </div>
    </div>
  );
};

export default BlurredPaywall;

