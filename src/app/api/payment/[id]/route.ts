import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    // Await the params
    const { id } = await context.params;

    const res = await fetch(`https://api.sandbox.checkout.com/payments/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.CKO_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to fetch payment' },
            { status: res.status }
        );
    }

    const data = await res.json();
    return NextResponse.json(data);
}