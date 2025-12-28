# Checkout.com Flow Case Study (Next.js)

## 📖 Overview
This case study demonstrates how to integrate **Checkout.com Flow** into a Next.js application.  
It covers:
- Secure card capture and tokenization using Flow.
- Handling redirects for iDEAL payments.
- Displaying payment results on a success page.
- Implementing a **refund flow** where users can enter an amount to refund and view updated payment details.
- Customizing Flow’s UI (colors, fonts, borders) to match your site design.

---

## 🔄 Payment Flow
1. **Checkout Page**  
   - Flow is initialized with your public key (`NEXT_PUBLIC_CKO_PUBLIC_KEY`) and a payment session.  
   - Users enter card details or select alternative payment methods.  
   - Flow handles tokenization and authentication.

2. **Success Page**  
   - After payment completion, the user is redirected to `/payments/success?cko-payment-id=...`.  
   - The app fetches payment details from `/api/payment/[id]` using your secret key.  
   - Payment JSON is displayed, along with a link to refund the payment.

3. **Refund Page**  
   - The user is redirected to `/payments/refund?cko-payment-id=...`.  
   - The page shows the captured amount and allows the user to enter a refund amount.  
   - On submission, `/api/refund/[id]` is called to process the refund.  
   - The refund result is displayed, and the payment details are re-fetched to show the updated state.

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies
```bash
yarn install
```
or
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_CKO_PUBLIC_KEY=pk_sbox_your_public_key_here
CKO_SECRET_KEY=sk_sbox_your_secret_key_here
NEXT_PUBLIC_ENVIRONMENT=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```



### 4. Run the development server
```bash
yarn dev
```
or
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure
```
src/app/
  ├── page.tsx                # Checkout page with Flow integration
  ├── payments/
  │   ├── success/page.tsx     # Success page showing payment details + refund link
  │   └── refund/page.tsx      # Refund page with amount input and updated payment details
  └── api/
      ├── payment/[id]/route.ts # Fetch payment details from Checkout.com
      └── refund/[id]/route.ts  # Process refunds via Checkout.com
```

---
