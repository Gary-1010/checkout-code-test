import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    const amount = body.amount;

    const res = await fetch(`https://api.sandbox.checkout.com/payments/${id}/refunds`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CKO_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}