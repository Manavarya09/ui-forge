'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Users, Globe, Code, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-time Analytics',
    description: 'Track user behavior and engagement with live dashboards. Make data-driven decisions instantly with comprehensive analytics.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time collaboration tools. Share, edit, and comment on projects with your team.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Connect your own domain or use our subdomain. Full SSL support and global CDN for lightning-fast performance worldwide.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Code,
    title: 'API Access',
    description: 'Build custom integrations with our RESTful API. Webhooks, GraphQL, and SDKs for all major programming languages.',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: Shield,
    title: 'SSO Security',
    description: 'Enterprise-grade security with SSO, SAML, and OAuth support. SOC 2 Type II certified with 99.99% uptime guarantee.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Get help whenever you need it with 24/7 customer support. Dedicated account managers for Enterprise plans.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4"
          >
            Features
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and features designed to help you build and scale your SaaS business faster than ever.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="group relative p-8 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
