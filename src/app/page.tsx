'use client';

import { useState, useEffect, useRef } from 'react';
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
  PawPrint,
  Award,
  Users,
  Clock,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Mental Enrichment',
    description: 'Six distinct puzzle types target every canine cognitive domain — tracking, foraging, manipulation, sequencing, nose work, and persistence.',
    accent: 'from-amber-500 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
    hover: 'hover:from-amber-100 hover:to-orange-100',
  },
  {
    icon: Sparkles,
    title: 'Never Gets Old',
    description: 'Magnetic modules swap in seconds. Reconfigure weekly for novel challenges that prevent habituation — the #1 reason dogs lose interest in toys.',
    accent: 'from-yellow-500 to-amber-500',
    bg: 'from-yellow-50 to-amber-50',
    hover: 'hover:from-yellow-100 hover:to-amber-100',
  },
  {
    icon: Heart,
    title: 'Calmer Departures',
    description: 'In our 8-week pilot, 94% of dogs showed reduced separation behaviors. Engaged dogs don\'t destroy — they solve, sniff, and nap.',
    accent: 'from-rose-500 to-pink-500',
    bg: 'from-rose-50 to-pink-50',
    hover: 'hover:from-rose-100 hover:to-pink-100',
  },
  {
    icon: ShieldCheck,
    title: 'Built for Power Chewers',
    description: 'FDA-compliant copolyester withstands 200+ lb bite force. 2-year warranty. If they break it, we replace it — no questions.',
    accent: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-50 to-teal-50',
    hover: 'hover:from-emerald-100 hover:to-teal-100',
  },
];

const stats = [
  { value: '47', suffix: ' min', label: 'Median session engagement', icon: Clock },
  { value: '94', suffix: '%', label: 'Dogs with reduced anxiety', icon: Heart },
  { value: '720', suffix: '+', label: 'Unique puzzle combinations', icon: Sparkles },
  { value: '2', suffix: ' yr', label: 'Warranty coverage', icon: ShieldCheck },
];

const trustBadges = [
  { icon: Award, text: 'Vet Recommended', desc: 'Designed with behaviorists' },
  { icon: ShieldCheck, text: 'Safety Certified', desc: 'ASTM F963 & FDA compliant' },
  { icon: Users, text: '10,000+ Dogs', desc: 'Happy customers worldwide' },
  { icon: Leaf, text: 'Eco-Conscious', desc: 'Recyclable materials' },
];

function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/images/pattern.svg')]" aria-hidden="true" />
      {mounted && (
        <>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl animate-blob" aria-hidden="true" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-gradient-to-r from-amber-200/10 to-transparent rounded-full blur-3xl animate-pulse-slow" aria-hidden="true" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-6 border border-amber-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>New: Modular Scent Puzzle System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight leading-[1.05] mb-6">
              Keep Your Dog{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Happily Busy</span>
                <span className="absolute bottom-1 left-0 right-0 h-8 bg-gradient-to-r from-amber-200 to-orange-200 opacity-60 -z-10 rounded-full" aria-hidden="true" />
              </span>{' '}
              for Hours
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The first truly modular enrichment system. Six magnetic puzzle modules.
              Infinite configurations. One happy dog — even when you're away.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden" onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="relative flex items-center gap-2">Get Sniff & Solve</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-300 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700" onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Modules
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl border border-gray-100 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <span className="font-medium text-gray-700">Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl border border-gray-100 backdrop-blur-sm">
                <RotateCcw className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <span className="font-medium text-gray-700">90-day satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl border border-gray-100 backdrop-blur-sm">
                <Truck className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <span className="font-medium text-gray-700">Ships in 1–2 business days</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-yellow-100/50 rounded-3xl blur-2xl opacity-50" aria-hidden="true" />
              <div className="relative rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                <Product3D />
              </div>
              <div className="absolute -bottom-8 -left-8 -right-8 -top-8 bg-gradient-to-t from-white/60 to-transparent rounded-3xl pointer-events-none" aria-hidden="true" />
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <PawPrint className="h-5 w-5 text-amber-500" aria-hidden="true" />
                <span className="font-medium text-gray-900">Designed for dogs 15–100+ lbs</span>
              </div>
              <div className="w-px h-6 bg-gray-200" aria-hidden="true" />
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="h-5 w-5 text-amber-500" aria-hidden="true" />
                <span className="font-medium text-gray-900">Veterinary behaviorist approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  );
}

function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">Why It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Six Instincts.{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">One System.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Most toys fail because they only engage one instinct. Ours engages six — and changes every week.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, delay }: { benefit: typeof benefits[0]; delay: number }) {
  return (
    <div
      className={`group relative p-7 rounded-3xl bg-gradient-to-br ${benefit.bg} ${benefit.hover} transition-all duration-500 border border-transparent group-hover:border-amber-100 group-hover:shadow-xl`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: benefit.accent }} aria-hidden="true" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center`} style={{ background: benefit.accent }}>
            <benefit.icon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">{benefit.title}</h3>
        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: benefit.accent }} aria-hidden="true" />
    </div>
  );
}

function Stats() {
  const [counters, setCounters] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat) => {
              const target = parseInt(stat.value);
              let current = 0;
              const increment = target / 60;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                setCounters((prev) => ({ ...prev, [stat.label]: Math.floor(current) }));
              }, 20);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.03]" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-800" aria-hidden="true" />
              <div className="relative">
                <stat.icon className="h-10 w-10 mx-auto mb-4 text-amber-500/80" aria-hidden="true" />
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight">
                  {counters[stat.label] !== undefined ? counters[stat.label] : stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400 text-sm sm:text-base font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <section id="product" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="sticky top-28">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.05]" aria-hidden="true" />
              <div className="relative rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                <Product3D />
              </div>
            </div>
          </div>

          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">The Core System</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4 tracking-tight">{product.name}</h2>
              <p className="text-lg text-gray-600 mb-6 font-medium text-amber-700">{product.tagline}</p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{product.description}</p>

              <div className="space-y-4 mb-10">
                {product.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 group-hover:scale-110 transition-all duration-300">
                      <CheckCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                    </div>
                    <span className="text-gray-700 text-lg leading-relaxed pt-1">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden" onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}>
                  <span className="relative flex items-center gap-2">Add to Cart — {formatPrice(product.price)}</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-300 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700" onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}>
                  View All Modules
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              <PriceCard price={formatPrice(product.price)} label="Core System" featured />
              <PriceCard price="$199" label="Expansion Pack (6 modules)" />
              <PriceCard price="$12" label="Snuffle Spiral Refill" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PriceCard({ price, label, featured = false }: { price: string; label: string; featured?: boolean }) {
  return (
    <div className={`relative text-center p-6 rounded-2xl transition-all duration-300 ${
      featured
        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
        : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
    }`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <div className="text-3xl font-bold mb-1">{price}</div>
      <div className={`text-sm ${featured ? 'text-amber-100' : 'text-gray-500'}`}>{label}</div>
    </div>
  );
}

function Modules() {
  return (
    <section id="modules" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">The Modules</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Six Modules. <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Infinite Play.</span></h2>
          <p className="text-lg text-gray-600">Each module targets a different instinct. Swap, rearrange, and recombine for endless novelty.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} delay={index * 80} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700" onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}>
            Add Expansion Pack (+6 Modules) — $199
          </Button>
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ module, index, delay }: { module: typeof product.modules[0]; index: number; delay: number }) {
  const colors = [
    'from-amber-500 to-orange-500',
    'from-yellow-500 to-amber-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
  ];

  return (
    <div
      className="group relative p-7 rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: colors[index] }} aria-hidden="true" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" style={{ background: colors[index] }}>
          <span className="text-3xl" aria-hidden="true">{module.icon}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-white transition-colors">{module.name}</h3>
        <p className="text-gray-600 mb-5 leading-relaxed group-hover:text-gray-300 transition-colors">{module.description}</p>
        <div className="space-y-3 text-sm">
          <ModuleMeta icon={Brain} label="Instinct" value={module.instict} />
          <ModuleMeta icon={Zap} label="Difficulty" value={module.difficulty} />
          <ModuleMeta icon={Clock} label="Engagement" value={module.time} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: colors[index] }} aria-hidden="true" />
    </div>
  );
}

function ModuleMeta({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; ariaHidden?: boolean }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-300 transition-colors">
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="font-medium text-gray-900 group-hover:text-white transition-colors">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Trusted by <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Dog Parents & Professionals</span></h2>
          <p className="text-lg text-gray-600">Real results from our 200-dog pilot program and early customers.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, delay }: { review: typeof product.reviews[0]; delay: number }) {
  return (
    <div
      className="relative p-7 rounded-2xl bg-gray-50 border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      <div className="flex gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
            fill={i < review.rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      <p className="text-gray-700 mb-5 italic leading-relaxed">"{review.text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-amber-800 font-bold text-lg">
          {review.name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-gray-900">{review.name}</div>
          <div className="text-sm text-gray-500">{review.dog}</div>
        </div>
      </div>
      {review.verified && (
        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
          <CheckCircle className="h-3 w-3" aria-hidden="true" />
          Verified Purchase
        </div>
      )}
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
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

function TrustBar() {
  return (
    <section className="py-12 bg-white border-t border-gray-100 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <badge.icon className="h-6 w-6 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{badge.text}</div>
                <div className="text-sm text-gray-500">{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-white">Sniff & Solve</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">Modular Scent Puzzle System</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
              The modular scent puzzle system that keeps dogs happily busy for hours.
              Designed with veterinary behaviorists. Built for real life.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors" aria-label="Instagram">📷</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors" aria-label="TikTok">🎵</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors" aria-label="YouTube">▶️</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors" aria-label="Email">✉️</a>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#product" className="hover:text-white transition-colors flex items-center gap-2"><PawPrint className="h-4 w-4" aria-hidden="true" />Core System</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors flex items-center gap-2"><Sparkles className="h-4 w-4" aria-hidden="true" />Modules</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors flex items-center gap-2"><ShieldCheck className="h-4 w-4" aria-hidden="true" />FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Award className="h-4 w-4" aria-hidden="true" />Expansion Pack</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Truck className="h-4 w-4" aria-hidden="true" />Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><RotateCcw className="h-4 w-4" aria-hidden="true" />Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Shield className="h-4 w-4" aria-hidden="true" />Warranty</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Users className="h-4 w-4" aria-hidden="true" />Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2024 Sniff & Solve. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-blob.animation-delay-2000 { animation-delay: 2s; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
      `}</style>
      <Header />
      <Cart />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <Stats />
        <ProductShowcase />
        <Modules />
        <Reviews />
        <TrustBar />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}