// src/stripe.js or wherever you configure Stripe
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51NmBxVSJm0EOvE96jDAKUOsep6pg3OfXGtTguyJdXCt0FFxOL8Ipho1HzbWtDVTUin5wJyEFX8jYwcmCrcHTx0gh00spEecMx7');

export default stripePromise;
