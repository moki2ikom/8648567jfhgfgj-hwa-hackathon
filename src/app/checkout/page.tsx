'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, Lock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { useStore } from '@/lib/store';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS, shippingCostFor, type ShippingId } from '@/lib/catalog';
import { formatPrice, validateEmail, validatePhone, validatePostal } from '@/lib/utils';
import { useMounted } from '@/lib/use-mounted';

type Step = 'contact' | 'delivery' | 'review';
const STEPS: Array<{ id: Step; label: string; index: string }> = [
  { id: 'contact', label: 'Contact', index: '01' },
  { id: 'delivery', label: 'Delivery', index: '02' },
  { id: 'review', label: 'Review', index: '03' },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postal: '',
  country: 'US',
};

const COUNTRIES = [
  ['US', 'United States'],
  ['CA', 'Canada'],
  ['GB', 'United Kingdom'],
  ['DE', 'Germany'],
  ['FR', 'France'],
  ['NL', 'Netherlands'],
  ['AU', 'Australia'],
];

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  required,
  className,
}: {
  id: keyof FormState;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink/50"
      >
        {label}
        {required && <span className="ml-1 text-ochre">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-sm border bg-bone-50 px-3.5 py-3 text-[14px] text-ink transition-colors placeholder:text-ink/25 focus:border-ink ${
          error ? 'border-clay' : 'border-ink/20'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-clay">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function Summary({
  subtotal,
  shipping,
  shippingMethod,
  total,
}: {
  subtotal: number;
  shipping: number;
  shippingMethod: ShippingId;
  total: number;
}) {
  const { cart } = useStore();
  const method = SHIPPING_OPTIONS.find((option) => option.id === shippingMethod);

  return (
    <aside className="lg:sticky lg:top-32">
      <div className="border border-ink/15 bg-bone-50">
        <div className="flex items-center justify-between border-b border-ink/15 px-5 py-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em]">Order summary</h2>
          <span className="font-mono text-[9px] text-ink/40">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>

        <ul className="divide-y divide-ink/10 px-5">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-3 py-4">
              <span
                className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-sm border border-ink/10"
                style={{ backgroundColor: item.swatch }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium leading-snug">{item.name}</p>
                <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-ink/40">
                  Qty {item.quantity}
                  {item.subtitle ? ` · ${item.subtitle}` : ''}
                </p>
              </div>
              <p className="font-mono text-[11px]">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 border-t border-ink/15 px-5 py-4 font-mono text-[11px]">
          <div className="flex justify-between">
            <dt className="text-ink/50">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Shipping — {method?.name}</dt>
            <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Tax</dt>
            <dd className="text-ink/40">Included</dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-ink/15 pt-3 text-[13px]">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>

        <div className="border-t border-ink/15 px-5 py-4">
          <p className="flex items-start gap-2 font-mono text-[8px] uppercase leading-relaxed tracking-[0.08em] text-ink/40">
            <Lock className="mt-0.5 h-3 w-3 flex-shrink-0" aria-hidden="true" />
            Demo checkout. No card is collected and no payment is taken. Orders are recorded by the
            demo order API.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/15 pt-3">
        <Link href="/" className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/45 hover:text-ink">
          ← Keep shopping
        </Link>
        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/30">
          60-day trial · 2-year warranty
        </span>
      </div>
    </aside>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useStore();
  const hydrated = useMounted();
  const [step, setStep] = useState<Step>('contact');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [shippingMethod, setShippingMethod] = useState<ShippingId>('standard');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const subtotal = getCartTotal();
  const shipping = shippingCostFor(subtotal, shippingMethod);
  const total = subtotal + shipping;

  const summary = useMemo(
    () => ({ subtotal, shipping, shippingMethod, total }),
    [subtotal, shipping, shippingMethod, total]
  );

  const update = (key: keyof FormState) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (scope: Step | 'all'): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (scope === 'contact' || scope === 'all') {
      if (!form.firstName.trim()) next.firstName = 'First name is required';
      if (!form.lastName.trim()) next.lastName = 'Last name is required';
      if (!validateEmail(form.email)) next.email = 'Enter a valid email';
      if (!validatePhone(form.phone)) next.phone = 'Enter 10–15 digits';
    }

    if (scope === 'delivery' || scope === 'all') {
      if (!form.line1.trim()) next.line1 = 'Address is required';
      if (!form.city.trim()) next.city = 'City is required';
      if (!form.region.trim()) next.region = 'State or region is required';
      if (!validatePostal(form.postal)) next.postal = 'Enter a valid postal code';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    if (step === 'contact') setStep('delivery');
    if (step === 'delivery') setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (step === 'delivery') setStep('contact');
    if (step === 'review') setStep('delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = async () => {
    if (submitting) return;
    if (!validate('all')) {
      setStep(errors.line1 || errors.city || errors.region || errors.postal ? 'delivery' : 'contact');
      return;
    }
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          customer: `${form.firstName.trim()} ${form.lastName.trim()}`,
          phone: form.phone.trim(),
          shippingMethod,
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          address: {
            line1: form.line1.trim(),
            line2: form.line2.trim(),
            city: form.city.trim(),
            region: form.region.trim(),
            postal: form.postal.trim(),
            country: form.country,
          },
        }),
      });

      const payload = (await response.json()) as { orderId?: string; error?: string };

      if (!response.ok || !payload.orderId) {
        throw new Error(payload.error || 'The order could not be recorded.');
      }

      setSubmitted(true);
      clearCart();
      router.push(`/order-confirmation?orderId=${encodeURIComponent(payload.orderId)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-bone-50">
        <Header />
        <Cart />
        <main className="flex flex-1 items-center justify-center px-5 py-24">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border border-ink/15 border-t-ochre" />
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">
              Loading your cart
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (cart.length === 0 && !submitted) {
    return (
      <div className="flex min-h-screen flex-col bg-bone-50">
        <Header />
        <Cart />
        <main className="flex flex-1 items-center justify-center px-5 py-24">
          <div className="max-w-md text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ochre">Checkout</p>
            <h1 className="mt-4 font-display text-4xl">The cart is empty.</h1>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
              Start with the core system — six modules, four scent cartridges and the weighted
              base — or build a kit around your dog’s level.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/#station"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50 hover:bg-moss"
              >
                See the station <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/#build"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink/25 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] hover:bg-ink hover:text-bone-50"
              >
                Build a kit
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((item) => item.id === step);

  return (
    <div className="flex min-h-screen flex-col bg-bone-50">
      <Header />
      <Cart />

      <main className="flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ochre">Checkout</p>
              <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">Complete the station.</h1>
            </div>
            <ol className="flex items-center gap-5 sm:gap-8" aria-label="Checkout progress">
              {STEPS.map((item, index) => (
                <li key={item.id} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[9px] ${
                      index < stepIndex
                        ? 'border-ink bg-ink text-bone-50'
                        : index === stepIndex
                          ? 'border-ink text-ink'
                          : 'border-ink/20 text-ink/30'
                    }`}
                    aria-current={index === stepIndex ? 'step' : undefined}
                  >
                    {index < stepIndex ? <Check className="h-3 w-3" /> : item.index}
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-[0.12em] ${
                      index <= stepIndex ? 'text-ink' : 'text-ink/35'
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  if (step === 'review') void placeOrder();
                }}
              >
                {step === 'contact' && (
                  <fieldset className="border border-ink/15 bg-bone-50 p-5 sm:p-7">
                    <legend className="sr-only">Contact information</legend>
                    <div className="mb-5 flex items-baseline justify-between">
                      <h2 className="font-display text-2xl">Where should we write?</h2>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">Step 01</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="firstName" label="First name" value={form.firstName} onChange={update('firstName')} autoComplete="given-name" required error={errors.firstName} />
                      <Field id="lastName" label="Last name" value={form.lastName} onChange={update('lastName')} autoComplete="family-name" required error={errors.lastName} />
                      <Field id="email" label="Email" type="email" value={form.email} onChange={update('email')} autoComplete="email" required error={errors.email} />
                      <Field id="phone" label="Phone" type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" required error={errors.phone} />
                    </div>
                    <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.08em] text-ink/35">
                      Used only for order updates. We do not sell contact data.
                    </p>
                    <div className="mt-6 flex justify-end border-t border-ink/15 pt-5">
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50 hover:bg-moss"
                      >
                        Continue to delivery <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </fieldset>
                )}

                {step === 'delivery' && (
                  <fieldset className="border border-ink/15 bg-bone-50 p-5 sm:p-7">
                    <legend className="sr-only">Delivery details</legend>
                    <div className="mb-5 flex items-baseline justify-between">
                      <h2 className="font-display text-2xl">Where does it land?</h2>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">Step 02</span>
                    </div>
                    <div className="grid gap-4">
                      <Field id="line1" label="Address" value={form.line1} onChange={update('line1')} autoComplete="address-line1" required error={errors.line1} />
                      <Field id="line2" label="Apartment, suite, etc. (optional)" value={form.line2} onChange={update('line2')} autoComplete="address-line2" />
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field id="city" label="City" value={form.city} onChange={update('city')} autoComplete="address-level2" required error={errors.city} />
                        <Field id="region" label="State / region" value={form.region} onChange={update('region')} autoComplete="address-level1" required error={errors.region} />
                        <Field id="postal" label="Postal code" value={form.postal} onChange={update('postal')} autoComplete="postal-code" required error={errors.postal} />
                      </div>
                      <div>
                        <label htmlFor="country" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink/50">
                          Country
                        </label>
                        <select
                          id="country"
                          value={form.country}
                          onChange={(event) => update('country')(event.target.value)}
                          className="w-full rounded-sm border border-ink/20 bg-bone-50 px-3.5 py-3 text-[14px] text-ink focus:border-ink"
                          autoComplete="country"
                        >
                          {COUNTRIES.map(([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-7 border-t border-ink/15 pt-5">
                      <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/45">Shipping method</h3>
                      <div className="mt-3 space-y-2">
                        {SHIPPING_OPTIONS.map((option) => {
                          const active = shippingMethod === option.id;
                          const free = subtotal >= FREE_SHIPPING_THRESHOLD;
                          return (
                            <label
                              key={option.id}
                              className={`flex cursor-pointer items-center justify-between gap-4 rounded-sm border px-4 py-3 transition-colors ${
                                active ? 'border-ink bg-bone-100' : 'border-ink/20 hover:border-ink/50'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="shippingMethod"
                                  value={option.id}
                                  checked={active}
                                  onChange={() => setShippingMethod(option.id)}
                                  className="h-3.5 w-3.5 accent-[#17150f]"
                                />
                                <span>
                                  <span className="block text-[13px] font-medium">{option.name}</span>
                                  <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.08em] text-ink/40">
                                    {option.days} · {option.note}
                                  </span>
                                </span>
                              </span>
                              <span className="font-mono text-[11px]">
                                {free ? 'Free' : formatPrice(option.price)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-ink/15 pt-5">
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50 hover:text-ink"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50 hover:bg-moss"
                      >
                        Review order <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </fieldset>
                )}

                {step === 'review' && (
                  <div className="border border-ink/15 bg-bone-50 p-5 sm:p-7">
                    <div className="mb-5 flex items-baseline justify-between">
                      <h2 className="font-display text-2xl">Check it once.</h2>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">Step 03</span>
                    </div>

                    <div className="grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
                      <div className="bg-bone-50 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45">Contact</h3>
                          <button type="button" onClick={() => setStep('contact')} className="font-mono text-[9px] uppercase tracking-[0.1em] text-ochre hover:underline">
                            Edit
                          </button>
                        </div>
                        <p className="mt-2 text-[13px]">{form.firstName} {form.lastName}</p>
                        <p className="text-[13px] text-ink-soft">{form.email}</p>
                        <p className="text-[13px] text-ink-soft">{form.phone}</p>
                      </div>
                      <div className="bg-bone-50 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45">Delivery</h3>
                          <button type="button" onClick={() => setStep('delivery')} className="font-mono text-[9px] uppercase tracking-[0.1em] text-ochre hover:underline">
                            Edit
                          </button>
                        </div>
                        <p className="mt-2 text-[13px]">{form.line1}{form.line2 ? `, ${form.line2}` : ''}</p>
                        <p className="text-[13px] text-ink-soft">
                          {form.city}, {form.region} {form.postal}
                        </p>
                        <p className="text-[13px] text-ink-soft">{COUNTRIES.find(([code]) => code === form.country)?.[1]}</p>
                      </div>
                    </div>

                    <div className="mt-4 border border-ink/15 bg-bone-100/60 p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink/50" aria-hidden="true" />
                        <div>
                          <p className="text-[13px] font-medium">Demo payment</p>
                          <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
                            No card is required for this demo. Placing the order sends it to the
                            demo order API and shows a confirmation screen; nothing is charged.
                          </p>
                        </div>
                      </div>
                    </div>

                    {submitError && (
                      <div role="alert" className="mt-4 flex items-start gap-2 border border-clay/40 bg-clay/5 p-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-clay" aria-hidden="true" />
                        <p className="text-[12px] text-clay">{submitError}</p>
                      </div>
                    )}

                    <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-ink/15 pt-5 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50 hover:text-ink disabled:opacity-40"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50 transition-colors hover:bg-moss disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            Recording order…
                          </>
                        ) : (
                          <>Place demo order — {formatPrice(total)}</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="lg:col-span-5">
              <Summary {...summary} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-bone-50">
          <Header />
          <Cart />
          <main className="flex flex-1 items-center justify-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">Loading checkout</p>
          </main>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
