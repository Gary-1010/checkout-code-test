'use client';

import { RouterServerContextSymbol } from 'next/dist/server/lib/router-utils/router-server-context';
import { useState } from 'react';

const COLORS = { bg: '#FFFFFD', text: '#323416', accent: '#8C9E6E' };
const appearance = {
    colorAction: '#5E48FC',
    colorBackground: '#0A0A0C',
    colorBorder: '#68686C',
    colorDisabled: '#64646E',
    colorError: '#FF3300',
    colorFormBackground: '#1F1F1F',
    colorFormBorder: '#1F1F1F',
    colorInverse: '#F9F9FB',
    colorOutline: '#ADA4EC',
    colorPrimary: '#F9F9FB',
    colorSecondary: '#828388',
    colorSuccess: '#2ECC71',
    button: {
        fontFamily:
            '"Roboto Mono", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif',
        fontSize: '16px',
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: '24px',
    },
    footnote: {
        fontFamily:
            '"PT Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: '20px',
    },
    label: {
        fontFamily:
            '"Roboto Mono", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: '20px',
    },
    subheading: {
        fontFamily:
            '"Roboto Mono", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif',
        fontSize: '16px',
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: '24px',
    },
    borderRadius: ['8px', '8px'],
};

const componentOptions = {
    card: {
        data: {
            cardholderName: 'Jia Tsang',
        },
        displayCardholderName: 'top',
    },
};
export default function CheckoutPage() {
    const [market, setMarket] = useState<'NL' | 'HK'>('NL');
    const [error, setError] = useState<string | null>(null);

    const priceLabel = market === 'NL' ? '€12.00' : 'HK$98.00';

    async function startPayment() {
        try {
            setError(null);
            console.log("Public key:", process.env.NEXT_PUBLIC_CKO_PUBLIC_KEY);
            // 1) Ask server to create a Payment Session based on market
            const resp = await fetch('/api/payment-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ market }),
            });
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt);
            }
            const paymentSession = await resp.json(); // full PaymentSession object

            // 2) Load Flow from Checkout's CDN (required for PCI compliance)
            const script = document.createElement('script');
            script.src = 'https://checkout-web-components.checkout.com/index.js';
            script.async = true;
            script.onload = async () => {
                const checkout = await (window as any).CheckoutWebComponents({
                    paymentSession,
                    publicKey: process.env.NEXT_PUBLIC_CKO_PUBLIC_KEY,
                    environment: 'sandbox',
                    appearance,
                    componentOptions,
                    onPaymentCompleted: async (_self: any, paymentResponse: any) => {
                        console.log("Payment completed:", paymentResponse);
                        window.location.href = `/success?cko-payment-id=${paymentResponse.id}`;
                    },
                    onError: (self: any, error: any) => {
                        console.error("Flow error:", error);
                        alert("Payment failed: " + error.message);
                    },
                });

                // 3) Create and mount Flow (renders cards, iDEAL, wallets if available)
                const flowComponent = checkout.create('flow');
                flowComponent.mount('#flow-container');
            };
            document.body.appendChild(script);
        } catch (e: any) {
            setError(e.message || 'Failed to start payment');
        }
    }

    return (
        <main style={{ backgroundColor: COLORS.bg, color: COLORS.text, padding: '2rem' }}>
            <header>
                <h1>iPhone Case Store</h1>
                <p style={{ color: COLORS.accent }}>
                    Secure checkout (Cards, iDEAL, Apple Pay / Google Pay via Flow)
                </p>
            </header>

            <section style={{ marginTop: '1rem' }}>
                <div style={{ border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: '1rem' }}>
                    <p>Basket: iPhone Case — {priceLabel}</p>
                    <label>
                        Market:{' '}
                        <select value={market} onChange={(e) => setMarket(e.target.value as 'NL' | 'HK')}>
                            <option value="NL">Netherlands (EUR)</option>
                            <option value="HK">Hong Kong (HKD)</option>
                        </select>
                    </label>
                </div>
            </section>

            <section style={{ marginTop: '1rem' }}>
                <button
                    onClick={startPayment}
                    style={{ backgroundColor: COLORS.accent, color: COLORS.bg, padding: '0.5rem 1rem', borderRadius: 6 }}
                >
                    Start payment
                </button>
            </section>

            <section style={{ marginTop: '1.5rem' }}>
                <div id="flow-container" />
            </section>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </main>
    );
}
