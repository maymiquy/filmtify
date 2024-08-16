import { STRIPE_SECRET_KEY } from '@/config';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY);
export default stripe;
