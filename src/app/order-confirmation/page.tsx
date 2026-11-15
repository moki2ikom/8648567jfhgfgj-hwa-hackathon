'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { Button } from '@/components/Button';
import { formatPrice } from '@/lib/utils';
import { product } from '@/lib/product';
import Link from 'next/link';
import {
  CheckCircle,
  Truck,
  Mail,
  Shield,
  RotateCcw,
  Star,
  Sparkles,
} from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'SNS-XXXXXX';
  const total = searchParams.get('total') || '249';
  const email = searchParams.get('email') || 'customer@example.com';
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const estimatedShipDate = new Date();
  estimatedShipDate.setDate(estimatedShipDate.getDate() + 2);
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Cart />

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-600" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-2">Thank you for your order, {email.split('@')[0]}! 🐾</p>
            <p className="text-gray-500">Your Sniff & Solve system is being prepared for shipment.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="text-xl font-bold text-gray-900 font-mono">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Total</p>
                <p className="text-xl font-bold text-gray-900">${total}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Estimated Ship</p>
                    <p className="text-sm text-emerald-700">{formatDate(estimatedShipDate)}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Confirmation Sent</p>
                    <p className="text-sm text-blue-700">Check your email</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-amber-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">90-Day Guarantee</p>
                    <p className="text-sm text-amber-700">Starts on delivery</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next</h3>
              <div className="space-y-4">
                <StepItem
                  number={1}
                  title="Order Processing"
                  description="We're picking, packing, and preparing your Sniff & Solve system with care."
                  icon={<Sparkles className="h-5 w-5" />}
                  completed
                />
                <StepItem
                  number={2}
                  title="Ships in 1–2 Business Days"
                  description="You'll receive a tracking email as soon as your order ships."
                  icon={<Truck className="h-5 w-5" />}
                />
                <StepItem
                  number={3}
                  title="Delivery & Unboxing"
                  description="Set up the base station, snap in the modules, and watch your dog discover their new favorite activity."
                  icon={<Star className="h-5 w-5" />}
                />
                <StepItem
                  number={4}
                  title="Rotate & Refresh"
                  description="Swap modules weekly for endless novelty. Order expansion packs anytime."
                  icon={<RotateCcw className="h-5 w-5" />}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-center text-white mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Help Your Dog Get Started</h3>
            <p className="text-amber-100 mb-6 max-w-md mx-auto">
              Download our free Quick-Start Guide with behaviorist tips for introducing Sniff & Solve,
              module difficulty progression, and troubleshooting.
            </p>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Download Guide (PDF)
            </Button>
          </div>

          <div className="text-center space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Continue Shopping
            </Link>
            <p className="text-sm text-gray-500">
              Questions? <a href="#" className="text-amber-600 hover:underline">Contact our support team</a> — we're dog parents too.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2024 Sniff & Solve. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function StepItem({
  number,
  title,
  description,
  icon,
  completed = false,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            completed
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {completed ? <CheckCircle className="h-5 w-5" aria-hidden="true" /> : number}
        </div>
        {!completed && (
          <div className="w-0.5 h-16 bg-gray-200 ml-3.5 mt-1" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1 pt-1">
        <h4 className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-600'}`}>{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
        {icon}
      </div>
    </div>
  );
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = ['#E8A87C', '#F4C542', '#8FC1E3', '#D4A5D8', '#A8D5BA', '#F0A0A0'];
  const color = colors[index % colors.length];
  const left = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 2}s`;
  const duration = `${2 + Math.random() * 2}s`;
  const size = `${6 + Math.random() * 10}px`;
  const shape = Math.random() > 0.5 ? '50%' : '0';

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: '-20px',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: shape,
        opacity: 0.8,
        animation: `fall ${duration} ${delay} ease-in forwards`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
      aria-hidden="true"
    />
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationSkeleton />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Cart />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-6" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="h-24 bg-gray-200 rounded-xl" />
              <div className="h-24 bg-gray-200 rounded-xl" />
              <div className="h-24 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}