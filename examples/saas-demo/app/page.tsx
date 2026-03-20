import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const features = [
  'Lightning fast deployment',
  'Built-in analytics',
  'Custom domains',
  'SSL certificates',
  '24/7 support',
  'API access',
];

const plans = [
  { name: 'Starter', price: '$9', features: ['5 Projects', 'Basic Support', 'Community Access'] },
  { name: 'Pro', price: '$29', features: ['Unlimited Projects', 'Priority Support', 'Advanced Features'], popular: true },
  { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'Custom Solutions', 'Dedicated Support'] },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold">SaaSify</span>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</a>
            <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm text-white/80 mb-6"
          >
            Built with UIForge CLI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Build faster with{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              confidence
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            The modern platform for building and scaling your SaaS. Ship faster, sleep better.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors inline-flex items-center gap-2">
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors">
              View Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-white/60">Powerful features to help you ship faster</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-black/50 rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature}</h3>
                <p className="text-white/60 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing</h2>
            <p className="text-white/60">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-500/20 to-purple-500/10 border-indigo-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/60">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="w-4 h-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl font-bold">SaaSify</span>
          <p className="text-white/60 text-sm">© 2026 SaaSify. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
