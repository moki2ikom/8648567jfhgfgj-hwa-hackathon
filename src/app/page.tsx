'use client';

import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { Product3D } from '@/components/Product3D';
import { Button } from '@/components/Button';
import { FAQItem } from '@/components/FAQItem';
import { CTA } from '@/components/CTA';
import { product } from '@/lib/product';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import {
  CheckCircle,
  Truck,
  RotateCcw,
  Shield,
  Star,
  Sparkles,
  Brain,
  Heart,
  Zap,
} from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Mental Enrichment',
    description: 'Six distinct puzzle types target every canine cognitive domain — tracking, foraging, manipulation, sequencing, nose work, and persistence.',
  },
  {
    icon: Sparkles,
    title: 'Never Gets Old',
    description: 'Magnetic modules swap in seconds. Reconfigure weekly for novel challenges that prevent habituation — the #1 reason dogs lose interest in toys.',
  },
  {
    icon: Heart,
    title: 'Calmer Departures',
    description: 'In our 8-week pilot, 94% of dogs showed reduced separation behaviors. Engaged dogs don\'t destroy — they solve, sniff, and nap.',
  },
  {
    icon: Shield,
    title: 'Built for Power Chewers',
    description: 'FDA-compliant copolyester withstands 200+ lb bite force. 2-year warranty. If they break it, we replace it — no questions.',
  },
];

const stats = [
  { value: '47 min', label: 'Median session engagement' },
  { value: '94%', label: 'Dogs with reduced anxiety' },
  { value: '720+', label: 'Unique puzzle combinations' },
  { value: '2 yr', label: 'Warranty coverage' },
];

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/pattern.svg')]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              New: Modular Scent Puzzle System
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Keep Your Dog{' '}
              <span className="relative">
                <span className="relative z-10">Happily Busy</span>
                <span className="absolute bottom-2 left-0 right-0 h-6 bg-amber-200/50" aria-hidden="true" />
              </span>{' '}
              for Hours
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              The first truly modular enrichment system. Six magnetic puzzle modules.
              Infinite configurations. One happy dog — even when you're away.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Get Sniff & Solve</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Modules
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <span>Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <span>90-day satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <span>Ships in 1–2 business days</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square max-w-md mx-auto">
              <Product3D />
            </div>
            <div className="absolute -bottom-6 -left-6 -right-6 -top-6 bg-gradient-to-t from-white/80 to-transparent rounded-3xl pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  );
}

function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Sniff & Solve Works
          </h2>
          <p className="text-lg text-gray-600">
            Most toys fail because they only engage one instinct. Ours engages six — and changes every week.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <benefit.icon className="h-6 w-6 text-amber-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <section id="product" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="sticky top-24">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 relative overflow-hidden">
              <Product3D />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">The Core System</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h2>
              <p className="text-lg text-gray-600 mb-6">{product.tagline}</p>
              <p className="text-gray-600 mb-8">{product.description}</p>

              <div className="space-y-4 mb-8">
                {product.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}>
                  Add to Cart — {formatPrice(product.price)}
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}>
                  View All Modules
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <div className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</div>
                <div className="text-sm text-gray-500">Core System</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <div className="text-2xl font-bold text-gray-900">$199</div>
                <div className="text-sm text-gray-500">Expansion Pack (6 modules)</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <div className="text-2xl font-bold text-gray-900">$12</div>
                <div className="text-sm text-gray-500">Snuffle Spiral Refill</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section id="modules" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">The Six Modules</h2>
          <p className="text-lg text-gray-600">Each module targets a different instinct. Swap, rearrange, and recombine for endless novelty.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}>
            Add Expansion Pack (+6 Modules) — $199
          </Button>
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ module, index }: { module: typeof product.modules[0]; index: number }) {
  const colors = [
    'from-amber-100 to-amber-200',
    'from-yellow-100 to-yellow-200',
    'from-blue-100 to-blue-200',
    'from-purple-100 to-purple-200',
    'from-green-100 to-green-200',
    'from-red-100 to-red-200',
  ];

  return (
    <div className="group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl bg-gradient-to-br ${colors[index]}`}>
        <span aria-hidden="true">{module.icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.name}</h3>
      <p className="text-gray-600 mb-4">{module.description}</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Brain className="h-4 w-4" aria-hidden="true" />
          <span>{module.instict}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Zap className="h-4 w-4" aria-hidden="true" />
          <span>Difficulty: {module.difficulty}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Star className="h-4 w-4" aria-hidden="true" />
          <span>Typical engagement: {module.time}</span>
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by Dog Parents & Professionals</h2>
          <p className="text-lg text-gray-600">Real results from our 200-dog pilot program and early customers.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex gap-1 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-amber-800 font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.dog}</div>
                </div>
              </div>
              {review.verified && (
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle className="h-3 w-3" aria-hidden="true" />
                  Verified Purchase
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know before you buy.</p>
        </div>

        <div className="space-y-4">
          {product.faq.map((item, index) => (
            <FAQItem key={index} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-2">Sniff & Solve</h3>
            <p className="text-gray-400 max-w-sm">
              The modular scent puzzle system that keeps dogs happily busy for hours.
              Designed with veterinary behaviorists. Built for real life.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#product" className="hover:text-white transition-colors">Core System</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Modules</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Expansion Pack</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warranty</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2024 Sniff & Solve. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">📷</a>
            <a href="#" className="hover:text-white transition-colors" aria-label="TikTok">🎵</a>
            <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">▶️</a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Email">✉️</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Cart />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <Stats />
        <ProductShowcase />
        <Modules />
        <Reviews />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}