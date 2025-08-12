import * as React from 'react';

let public_key = import.meta.env.VITE_STRIPE_PUBLIC_KEY

function BuyButtonComponent({ buttonId }) {
  // Paste the stripe-buy-button snippet in your React component
  return (
    <stripe-buy-button
    
      buy-button-id={ buttonId }
      publishable-key= {public_key}
    >
    </stripe-buy-button>
  );
}

export default BuyButtonComponent;