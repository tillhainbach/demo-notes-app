import Stripe from 'stripe';
import handler, { ok } from '../util/handler';
import { calculateCost } from '../util/cost';

export const main = handler(async (event) => {
  const { storage, source } = JSON.parse(event.body ?? '');
  const amount = calculateCost(storage);
  const description = 'Scratch charge';

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-08-01',
  });

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: 'EUR',
  });

  return ok({ status: true });
});
