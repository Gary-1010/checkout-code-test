'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';


export default function SuccessPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('cko-payment-id');
    const [payment, setPayment] = useState<any>(null);

    useEffect(() => {
        if (paymentId) {
            fetch(`/api/payment/${paymentId}`)
                .then(res => res.json())
                .then(data => setPayment(data));
        }
    }, [paymentId]);

    return (
        <div>
            <h1>Payment Success</h1>
            {payment ? (
                <>
                    {/* Show payment details */}
                    <pre>{JSON.stringify(payment, null, 2)}</pre>

                    {/* Add refund link */}
                    <Link href={`/payment/refund?cko-payment-id=${payment.id}`}>
                        <button style={{ marginTop: '1rem' }}>Refund this payment</button>
                    </Link>
                </>
            ) : (
                <p>Loading payment details...</p>
            )}
        </div>
    );

}