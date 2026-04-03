import React from 'react';
import Razorpay from 'react-razorpay';

const RazorpayComponent = () => {
  const handlePaymentSuccess = (paymentId) => {
    console.log('Payment Successful:', paymentId);
    // Handle successful payment
  };

  const handlePaymentError = (error) => {
    console.error('Payment Error:', error);
    // Handle payment error
  };

  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key ID
    amount: 50000, // Amount in paise (e.g., 50000 paise = ₹500)
    currency: 'INR',
    name: 'Your Company Name',
    description: 'Purchase Description',
    image: '/your-logo.png',
    handler: handlePaymentSuccess,
    prefill: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      contact: '9999999999',
    },
    notes: {
      address: '1234, ABC Street, XYZ City',
    },
    theme: {
      color: '#F37254',
    },
  };

  return (
    <div>
      <Razorpay options={options} onSuccess={handlePaymentSuccess} onError={handlePaymentError}>
        <button>Pay Now</button>
      </Razorpay>
    </div>
  );
};

export default RazorpayComponent;
