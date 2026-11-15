'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { Button } from '@/components/Button';
import { useStore } from '@/lib/store';
import { formatPrice, validateEmail, validatePhone, generateOrderId } from '@/lib/utils';
import { product } from '@/lib/product';
import {
  Truck,
  Shield,
  RotateCcw,
  Lock,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const shippingOptions = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 9,
    days: '5–7 business days',
    description: 'Free on orders over $100',
    icon: Truck,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 19,
    days: '2–3 business days',
    description: 'Priority processing & tracking',
    icon: Truck,
  },
];

function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useStore();
  const [step, setStep] = useState<'info' | 'shipping' | 'payment' | 'confirm'>('info');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = getCartTotal();
  const shippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0;
  const total = subtotal + shippingCost;

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep('all')) return;

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    clearCart();
    setIsSubmitting(false);
    router.push(`/order-confirmation?orderId=${newOrderId}&total=${total}&email=${formData.email}`);
  };

  const stepOrder: ('info' | 'shipping' | 'payment' | 'confirm')[] = ['info', 'shipping', 'payment', 'confirm'];

  const handleNext = () => {
    if (validateStep(step)) {
      const currentIndex = stepOrder.indexOf(step);
      if (currentIndex < stepOrder.length - 1) {
        setStep(stepOrder[currentIndex + 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <Cart />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add the Sniff & Solve system to continue</p>
            <Button onClick={() => window.location.href = '#product'}>Continue Shopping</Button>
          </div>
        </main>
      </div>
    );
  }

  const steps = [
    { id: 'info', label: 'Contact Info', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: Lock },
    { id: 'confirm', label: 'Confirm', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        steps.findIndex(st => st.id === step) >= i
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && <div className="w-16 h-0.5 bg-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:hidden">
              {steps.map((s, i) => (
                <div key={s.id} className={`flex items-center gap-1 px-3 py-2 rounded-full whitespace-nowrap ${
                  steps.findIndex(st => st.id === step) >= i
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                    <s.icon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit}>
                {step === 'info' && (
                  <ContactInfoForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    onNext={handleNext}
                  />
                )}

                {step === 'shipping' && (
                  <ShippingForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    shippingOptions={shippingOptions}
                    selectedShipping={selectedShipping}
                    setSelectedShipping={setSelectedShipping}
                    onBack={handleBack}
                    onNext={handleNext}
                  />
                )}

                {step === 'payment' && (
                  <PaymentForm
                    onBack={handleBack}
                    onNext={handleNext}
                  />
                )}

                {step === 'confirm' && (
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
                  />
                )}
              </form>
            </div>

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
      </main>
    </div>
  );
}

function ContactInfoForm({
  formData,
  setFormData,
  errors,
  onNext,
}: {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  onNext: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
            } focus:outline-none focus:ring-2 transition-colors`}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && <p id="firstName-error" className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
            } focus:outline-none focus:ring-2 transition-colors`}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && <p id="lastName-error" className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
          } focus:outline-none focus:ring-2 transition-colors`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
          } focus:outline-none focus:ring-2 transition-colors`}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>
      <Button type="button" onClick={onNext} className="w-full">
        Continue to Shipping
      </Button>
    </div>
  );
}

interface ShippingFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  shippingOptions: typeof shippingOptions;
  selectedShipping: string;
  setSelectedShipping: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

function ShippingForm({
  formData,
  setFormData,
  errors,
  shippingOptions,
  selectedShipping,
  setSelectedShipping,
  onBack,
  onNext,
}: ShippingFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
            } focus:outline-none focus:ring-2 transition-colors`}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && <p id="address-error" className="mt-1 text-sm text-red-500">{errors.address}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            id="address2"
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-gray-900 focus:outline-none focus:ring-2 transition-colors"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
            } focus:outline-none focus:ring-2 transition-colors`}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && <p id="city-error" className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            id="state"
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
            } focus:outline-none focus:ring-2 transition-colors`}
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? 'state-error' : undefined}
          />
          {errors.state && <p id="state-error" className="mt-1 text-sm text-red-500">{errors.state}</p>}
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            id="zip"
            type="text"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.zip ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'
            } focus:outline-none focus:ring-2 transition-colors`}
            aria-invalid={!!errors.zip}
            aria-describedby={errors.zip ? 'zip-error' : undefined}
          />
          {errors.zip && <p id="zip-error" className="mt-1 text-sm text-red-500">{errors.zip}</p>}
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-gray-900 focus:outline-none focus:ring-2 transition-colors"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="EU">European Union</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h3>
        <div className="space-y-3">
          {shippingOptions.map((option: typeof shippingOptions[0]) => (
            <label
              key={option.id}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                selectedShipping === option.id
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedShipping === option.id}
                onChange={() => setSelectedShipping(option.id)}
                className="mt-1 h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option.name}</span>
                  <span className="font-semibold text-gray-900">
                    {option.price === 0 ? 'FREE' : `$${option.price}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <option.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{option.days}</span>
                  <span>•</span>
                  <span>{option.description}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}

interface PaymentFormProps {
  onBack: () => void;
  onNext: () => void;
}

function PaymentForm({ onBack, onNext }: PaymentFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment</h2>
      <div className="space-y-4 mb-6">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
              <CreditCard className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Credit or Debit Card</p>
              <p className="text-sm text-gray-500">Visa, Mastercard, Amex, Discover</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
              <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Shop Pay</p>
              <p className="text-sm text-gray-500">Fast checkout with saved info</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
              <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Google Pay</p>
              <p className="text-sm text-gray-500">Quick checkout with Google</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium text-emerald-800">Secure Checkout</p>
            <p className="text-sm text-emerald-700">
              All transactions are encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Review Order
        </Button>
      </div>
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
}: ConfirmOrderProps) {
  const shippingOption = shippingOptions.find((s: typeof shippingOptions[0]) => s.id === selectedShipping);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>

      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
          <div className="text-gray-600 space-y-1">
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.email}</p>
            <p>{formData.phone}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h3>
          <div className="text-gray-600 space-y-1">
            <p>{formData.address}</p>
            <p>{formData.city}, {formData.state} {formData.zip}</p>
            <p>{formData.country === 'US' ? 'United States' : formData.country}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Method</h3>
          <div className="text-gray-600">
            <p>{shippingOption?.name} — {shippingOption?.days}</p>
            <p className="font-medium">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h3>
          <p className="text-gray-600">Credit/Debit Card (ending in •••• 4242)</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">By placing this order, you agree to our</p>
            <p className="mt-1">Terms of Service, Privacy Policy, and 90-day Satisfaction Guarantee terms.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : `Place Order — $${total}`}
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
    <div className="lg:sticky lg:top-24">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {cart.map((item: any) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl">
                🧩
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-900">${item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping ({shippingOption?.name})</span>
            <span className="font-medium">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <div className="text-sm text-emerald-800">
              <p className="font-medium">Secure Checkout</p>
              <p>256-bit encryption • No card data stored • 90-day guarantee</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <RotateCcw className="h-5 w-5 text-amber-600 flex-shrink-0" aria-hidden="true" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">90-Day Satisfaction Guarantee</p>
              <p>If your dog doesn't love it, we'll refund you. No questions.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Fast Shipping</p>
              <p>Orders ship in 1–2 business days. Tracking emailed automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;