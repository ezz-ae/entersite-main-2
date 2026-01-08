/**
 * Entrestate PayPal SDK Logic
 * Securely handles order creation and capture for the OS licenses.
 */

export interface PayPalOrderRequest {
    planId?: string;
    amount: string;
    currency: string;
}

import { authorizedFetch } from './auth-fetch';

export const createPayPalOrder = async (req: PayPalOrderRequest) => {
    try {
        const response = await authorizedFetch('/api/payments/paypal/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        return await response.json();
    } catch (error) {
        console.error("PayPal Order Creation Error:", error);
        throw error;
    }
};

export const capturePayPalOrder = async (orderId: string) => {
    try {
        const response = await authorizedFetch('/api/payments/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });
        return await response.json();
    } catch (error) {
        console.error("PayPal Order Capture Error:", error);
        throw error;
    }
};
