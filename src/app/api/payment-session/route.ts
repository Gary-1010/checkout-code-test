import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { market } = await req.json();
    const amount = market === 'NL' ? 1200 : 9800; // €12.00 or HK$98.00
    const currency = market === 'NL' ? 'EUR' : 'HKD';
    const country = market === 'NL' ? 'NL' : 'HK';

    const resp = await fetch('https://api.sandbox.checkout.com/payment-sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.CKO_SECRET_KEY!, // secret key must stay server-side
        },
        body: JSON.stringify({
            amount,
            currency,
            reference: `ORD-${Date.now()}`,
            billing: { address: { country } },
            customer: { name: 'Jia Tsang', email: 'jia.tsang@example.com' },
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
            processing_channel_id: process.env.CKO_PROCESSING_CHANNEL,
        }),
    }); 
    console.log(process.env.NEXT_PUBLIC_BASE_URL)

    if (!resp.ok) {
        const text = await resp.text();
        console.log(text);
        return new Response(text, { status: resp.status });
    }

    // Return the whole PaymentSession object to the client for Flow
    const paymentSession = await resp.json();
    return Response.json(paymentSession);
}