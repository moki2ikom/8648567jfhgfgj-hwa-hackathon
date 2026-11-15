'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { Button } from '@/components/Button';
import { useStore } from '@/lib/store';
import { formatPrice, validateEmail, validatePhone, generateOrderId } from '@/lib/utils';
import { product } from '@/lib/product';
import Link from 'next/link';
import {
  Truck,
  Shield,
  RotateCcw,
  Lock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
  MapPin,
  Phone,
  ChevronRight,
  Loader2,
} from 'lucide-react';

const shippingOptions = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 9,
    days: '5–7 business days',
    description: 'Free on orders over $100',
    icon: Truck,
    badge: null,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 19,
    days: '2–3 business days',
    description: 'Priority processing & tracking',
    icon: Truck,
    badge: 'Popular',
  },
];

const stepConfig = [
  { id: 'info' as const, label: 'Contact', icon: User, href: '#' },
  { id: 'shipping' as const, label: 'Shipping', icon: MapPin, href: '#' },
  { id: 'payment' as const, label: 'Payment', icon: CreditCard, href: '#' },
  { id: 'confirm' as const, label: 'Review', icon: CheckCircle, href: '#' },
];

const stepOrder: ('info' | 'shipping' | 'payment' | 'confirm')[] = ['info', 'shipping', 'payment', 'confirm'];

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Cart />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/4" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-gray-200 rounded-2xl" />
              <div className="lg:col-span-5 h-80 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StepProgress({ steps, currentStep }: { steps: typeof stepConfig; currentStep: string }) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }} />
      </div>
      <div className="relative flex justify-between">
        {steps.map((stepConfig, index) => (
          <div key={stepConfig.id} className="flex flex-col items-center">
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              index <= currentIndex
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {index < currentIndex ? (
                <CheckCircle className="w-5 h-5" aria-hidden="true" />
              ) : (
                <stepConfig.icon className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <span className={`mt-2 text-xs font-medium ${index <= currentIndex ? 'text-gray-900' : 'text-gray-400'}`}>
              {stepConfig.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CheckoutStepProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; ariaHidden?: boolean }>;
  children: React.ReactNode;
}

function CheckoutStep({ title, description, icon: Icon, children }: CheckoutStepProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm animate-scale-in">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-amber-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function StepActions({ onBack, onNext, isFirst }: { onBack: () => void; onNext: () => void; isFirst?: boolean }) {
  return (
    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
      {!isFirst && (
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
      )}
      <Button onClick={onNext} className="flex-1">
        {isFirst ? 'Continue to Shipping' : 'Continue'}
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

interface FormFieldProps {
  field: { name: string; label: string; type: string; icon: React.ComponentType<{ className?: string; ariaHidden?: boolean }>; required: boolean; options?: { value: string; label: string }[] };
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur?: () => void;
  error?: string;
  showError?: boolean;
}

function FormField({ field, value, onChange, onBlur, error, showError }: FormFieldProps) {
  const isSelect = field.type === 'select';
  const hasError = showError && error;

  return (
    <div className="relative">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {field.label} {field.required && <span className="text-amber-500" aria-hidden="true">*</span>}
      </label>
      {isSelect ? (
        <select
          id={field.name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 appearance-none bg-white ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-200 focus:ring-2 focus:ring-amber-500/20'
          } focus:outline-none`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <field.icon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id={field.name}
            type={field.type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all duration-200 bg-white ${
              hasError
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-200 focus:ring-2 focus:ring-amber-500/20'
            } focus:outline-none`}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
            placeholder={field.label}
          />
        </div>
      )}
      {hasError && (
        <p id={`${field.name}-error`} className="mt-2 text-sm text-red-500 flex items-center gap-1" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function ContactInfoForm({
  formData,
  setFormData,
  errors,
  touched,
  setTouched,
}: {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setTouched: (data: Record<string, boolean>) => void;
}) {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', icon: User, required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', icon: User, required: true },
    { name: 'email', label: 'Email Address', type: 'email', icon: Mail, required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, required: true },
  ];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        {fields.slice(0, 2).map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            onBlur={() => setTouched({ ...touched, [field.name]: true })}
            error={errors[field.name]}
            showError={touched[field.name] && !!errors[field.name]}
          />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {fields.slice(2).map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            onBlur={() => setTouched({ ...touched, [field.name]: true })}
            error={errors[field.name]}
            showError={touched[field.name] && !!errors[field.name]}
          />
        ))}
      </div>
    </div>
  );
}

function ShippingOption({ option, selected, onChange }: { option: typeof shippingOptions[0]; selected: boolean; onChange: () => void }) {
  return (
    <label
      className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
        selected
          ? 'border-amber-500 bg-amber-50/50 shadow-lg shadow-amber-500/10'
          : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
      }`}
    >
      <input
        type="radio"
        name="shipping"
        checked={selected}
        onChange={onChange}
        className="sr-only"
        aria-label={option.name}
      />
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        selected ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
      }`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">{option.name}</span>
          <span className="font-semibold text-gray-900 text-lg">
            {option.price === 0 ? 'FREE' : `$${option.price}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <option.icon className="w-4 h-4" aria-hidden="true" />
          <span>{option.days}</span>
          <span className="text-gray-300">•</span>
          <span>{option.description}</span>
        </div>
        {option.badge && (
          <span className="mt-2 inline-block px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-full">
            {option.badge}
          </span>
        )}
      </div>
    </label>
  );
}

function ShippingForm({
  formData,
  setFormData,
  errors,
  touched,
  setTouched,
  shippingOptions,
  selectedShipping,
  setSelectedShipping,
}: any) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField
          field={{ name: 'address', label: 'Address', type: 'text', icon: MapPin, required: true }}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          onBlur={() => setTouched({ ...touched, address: true })}
          error={errors.address}
          showError={touched.address && !!errors.address}
        />
        <FormField
          field={{ name: 'address2', label: 'Apartment, Suite, etc.', type: 'text', icon: MapPin, required: false }}
          value={formData.address2}
          onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <FormField
          field={{ name: 'city', label: 'City', type: 'text', icon: MapPin, required: true }}
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          onBlur={() => setTouched({ ...touched, city: true })}
          error={errors.city}
          showError={touched.city && !!errors.city}
        />
        <FormField
          field={{ name: 'state', label: 'State', type: 'text', icon: MapPin, required: true }}
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          onBlur={() => setTouched({ ...touched, state: true })}
          error={errors.state}
          showError={touched.state && !!errors.state}
        />
        <FormField
          field={{ name: 'zip', label: 'ZIP Code', type: 'text', icon: MapPin, required: true }}
          value={formData.zip}
          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          onBlur={() => setTouched({ ...touched, zip: true })}
          error={errors.zip}
          showError={touched.zip && !!errors.zip}
        />
        <FormField
          field={{ name: 'country', label: 'Country', type: 'select', icon: MapPin, required: true, options: [
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'UK', label: 'United Kingdom' },
            { value: 'AU', label: 'Australia' },
            { value: 'EU', label: 'European Union' },
          ]}}
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h3>
        <div className="space-y-3" role="radiogroup" aria-label="Shipping method">
          {shippingOptions.map((option: typeof shippingOptions[0]) => (
            <ShippingOption
              key={option.id}
              option={option}
              selected={selectedShipping === option.id}
              onChange={() => setSelectedShipping(option.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ icon: Icon, title, description, selected = false }: { icon: React.ComponentType<{ className?: string; ariaHidden?: boolean }>; title: string; description: string; selected?: boolean }) {
  return (
    <button
      type="button"
      className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${
        selected
          ? 'border-amber-500 bg-amber-50/50'
          : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        selected ? 'bg-amber-100' : 'bg-gray-50'
      }`}>
        <Icon className={`w-6 h-6 ${selected ? 'text-amber-600' : 'text-gray-500'}`} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {selected && (
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
      )}
    </button>
  );
}

function PaymentForm() {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <PaymentOption
          icon={CreditCard}
          title="Credit or Debit Card"
          description="Visa, Mastercard, Amex, Discover"
          selected
        />
        <PaymentOption
          icon={Lock}
          title="Shop Pay"
          description="Fast checkout with saved info"
        />
        <PaymentOption
          icon={Lock}
          title="Google Pay"
          description="Quick checkout with Google"
        />
      </div>

      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-emerald-800">Secure Checkout</p>
            <p className="text-sm text-emerald-700 mt-1">
              All transactions are encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-5 h-5 text-amber-600" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-amber-800">90-Day Satisfaction Guarantee</p>
            <p className="text-sm text-amber-700 mt-1">
              If your dog doesn't love it, we'll refund you. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="text-gray-600 space-y-1">{children}</div>
    </div>
  );
}

interface ConfirmOrderProps {
  formData: any;
  selectedShipping: string;
  shippingOptions: typeof shippingOptions;
  subtotal: number;
  shippingCost: number;
  total: number;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  animating: boolean;
}

function ConfirmOrder({
  formData,
  selectedShipping,
  shippingOptions,
  subtotal,
  shippingCost,
  total,
  onBack,
  onSubmit,
  isSubmitting,
  animating,
}: ConfirmOrderProps) {
  const shippingOption = shippingOptions.find((s: typeof shippingOptions[0]) => s.id === selectedShipping);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <ReviewSection title="Contact Information">
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.email}</p>
          <p>{formData.phone}</p>
        </ReviewSection>
        <ReviewSection title="Shipping Address">
          <p>{formData.address}</p>
          <p>{formData.city}, {formData.state} {formData.zip}</p>
          <p>{formData.country === 'US' ? 'United States' : formData.country}</p>
        </ReviewSection>
        <ReviewSection title="Shipping Method">
          <p>{shippingOption?.name} — {shippingOption?.days}</p>
          <p className="font-medium">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</p>
        </ReviewSection>
        <ReviewSection title="Payment Method">
          <p>Credit/Debit Card (ending in •••• 4242)</p>
        </ReviewSection>
      </div>

      <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping ({shippingOption?.name})</span>
            <span className="font-medium">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-4">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">By placing this order, you agree to our</p>
            <p className="mt-1">Terms of Service, Privacy Policy, and 90-day Satisfaction Guarantee terms.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isSubmitting || animating}>
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={isSubmitting || animating}>
          {isSubmitting || animating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Processing...
            </>
          ) : (
            `Place Order — $${total}`
          )}
        </Button>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  cart: any[];
  subtotal: number;
  shippingCost: number;
  total: number;
  selectedShipping: string;
  shippingOptions: typeof shippingOptions;
}

function OrderSummary({
  cart,
  subtotal,
  shippingCost,
  total,
  selectedShipping,
  shippingOptions,
}: OrderSummaryProps) {
  const shippingOption = shippingOptions.find((s: typeof shippingOptions[0]) => s.id === selectedShipping);

  return (
    <div className="lg:sticky lg:top-28">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <span className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>

        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 text-xl">
                🧩
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">${item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping ({shippingOption?.name})</span>
            <span className="font-medium">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-4">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <TrustBadge icon={Shield} title="Secure Checkout" desc="256-bit encryption • No card data stored" color="emerald" />
          <TrustBadge icon={RotateCcw} title="90-Day Guarantee" desc="Full refund if your dog doesn't love it" color="amber" />
          <TrustBadge icon={Truck} title="Fast Shipping" desc="Orders ship in 1–2 business days" color="blue" />
        </div>
      </div>
    </div>
  );
}

function TrustBadge({ icon: Icon, title, desc, color }: { icon: React.ComponentType<{ className?: string; ariaHidden?: boolean }>; title: string; desc: string; color: 'emerald' | 'amber' | 'blue' }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800 text-emerald-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-800 text-amber-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-800 text-blue-600',
  };
  const [bg, border, text, iconColor] = colors[color].split(' ');

  return (
    <div className={`p-4 rounded-2xl border ${bg} ${border}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}/10`}>
          <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm opacity-80">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useStore();
  const [step, setStep] = useState<'info' | 'shipping' | 'payment' | 'confirm'>('info');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [animating, setAnimating] = useState(false);

  const subtotal = getCartTotal();
  const shippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (searchParams.get('from') === 'cart') {
      setStep('info');
    }
  }, [searchParams]);

  const validateStep = (currentStep: string) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'info' || currentStep === 'all') {
      if (!formData.email || !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.phone.trim() || !validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (currentStep === 'shipping' || currentStep === 'all') {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      if (!formData.zip.trim()) {
        newErrors.zip = 'ZIP code is required';
      }
    }

    setErrors(newErrors);
    setTouched(prev => {
      const next = { ...prev };
      Object.keys(newErrors).forEach(key => { next[key] = true; });
      return next;
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep('all')) return;

    setIsSubmitting(true);
    setAnimating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newOrderId = generateOrderId();
    setAnimating(false);
    clearCart();
    setIsSubmitting(false);
    router.push(`/order-confirmation?orderId=${newOrderId}&total=${total}&email=${formData.email}`);
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setAnimating(true);
      setTimeout(() => {
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex < stepOrder.length - 1) {
          setStep(stepOrder[currentIndex + 1]);
        }
        setAnimating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setAnimating(true);
      setTimeout(() => {
        setStep(stepOrder[currentIndex - 1]);
        setAnimating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <Cart />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-7a2 2 0 00-2-2H8a2 2 0 00-2 2v7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add the Sniff & Solve system to continue</p>
            <Link href="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 animate-fade-in-up">
            <StepProgress steps={stepConfig} currentStep={step} />
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 animate-slide-in-right">
              <form onSubmit={handleSubmit}>
                {step === 'info' && (
                  <CheckoutStep
                    title="Contact Information"
                    description="We'll send order updates to your email"
                    icon={Mail}
                  >
                    <ContactInfoForm
                      formData={formData}
                      setFormData={setFormData}
                      errors={errors}
                      touched={touched}
                      setTouched={setTouched}
                    />
                    <StepActions onBack={handleBack} onNext={handleNext} isFirst={true} />
                  </CheckoutStep>
                )}

                {step === 'shipping' && (
                  <CheckoutStep
                    title="Shipping Address"
                    description="Where should we send your Sniff & Solve?"
                    icon={MapPin}
                  >
                    <ShippingForm
                      formData={formData}
                      setFormData={setFormData}
                      errors={errors}
                      touched={touched}
                      setTouched={setTouched}
                      shippingOptions={shippingOptions}
                      selectedShipping={selectedShipping}
                      setSelectedShipping={setSelectedShipping}
                    />
                    <StepActions onBack={handleBack} onNext={handleNext} />
                  </CheckoutStep>
                )}

                {step === 'payment' && (
                  <CheckoutStep
                    title="Payment"
                    description="Secure checkout powered by Stripe"
                    icon={CreditCard}
                  >
                    <PaymentForm />
                    <StepActions onBack={handleBack} onNext={handleNext} />
                  </CheckoutStep>
                )}

                {step === 'confirm' && (
                  <CheckoutStep
                    title="Review Order"
                    description="Please review your order before placing it"
                    icon={CheckCircle}
                  >
                    <ConfirmOrder
                      formData={formData}
                      selectedShipping={selectedShipping}
                      shippingOptions={shippingOptions}
                      subtotal={subtotal}
                      shippingCost={shippingCost}
                      total={total}
                      onBack={handleBack}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      animating={animating}
                    />
                  </CheckoutStep>
                )}
              </form>
            </div>

            <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <OrderSummary
                cart={cart}
                subtotal={subtotal}
                shippingCost={shippingCost}
                total={total}
                selectedShipping={selectedShipping}
                shippingOptions={shippingOptions}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}