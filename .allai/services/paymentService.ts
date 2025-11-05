// Mock payment service for demo/testing
export const processPayment = (amount: number, paymentMeta?: any): Promise<{ success: boolean; transactionId?: string; message?: string }> => {
  return new Promise(resolve => {
    // Simulate network / processing delay
    setTimeout(() => {
      // For demo, treat zero or positive amounts as successful.
      if (amount >= 0) {
        resolve({ success: true, transactionId: `tx_${Date.now()}` });
      } else {
        resolve({ success: false, message: 'Invalid amount' });
      }
    }, 900);
  });
};

export default processPayment;
