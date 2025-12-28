'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RefundPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('cko-payment-id');
    const [payment, setPayment] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [refundResult, setRefundResult] = useState<any>(null);
    const [updatedPayment, setUpdatedPayment] = useState<any>(null);

    // Fetch initial payment details
    useEffect(() => {
        if (paymentId) {
            fetch(`/api/payment/${paymentId}`)
                .then(res => res.json())
                .then(data => setPayment(data));
        }
    }, [paymentId]);

    const handleRefund = async () => {
        const res = await fetch(`/api/refund/${paymentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });
        const data = await res.json();
        setRefundResult(data);

        // After refund, fetch updated payment details
        const updatedRes = await fetch(`/api/payment/${paymentId}`);
        const updatedData = await updatedRes.json();
        setUpdatedPayment(updatedData);
    };

    return (
        <div>
            <h1>Refund Payment</h1>

            {payment ? (
                <>
                    <p>
                        Captured amount: {payment.amount} {payment.currency}
                    </p>
                    <input
                        type="number"
                        placeholder="Enter refund amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <button onClick={handleRefund}>Submit Refund</button>
                </>
            ) : (
                <p>Loading payment details...</p>
            )}

            {refundResult && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Refund Result</h2>
                    <pre>{JSON.stringify(refundResult, null, 2)}</pre>
                </div>
            )}

            {updatedPayment && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Updated Payment Details</h2>
                    <pre>{JSON.stringify(updatedPayment, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}