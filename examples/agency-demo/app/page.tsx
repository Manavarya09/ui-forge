import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Users, TrendingUp, Award } from 'lucide-react';

const services = [
  { icon: Briefcase, title: 'Strategy', description: 'Business strategy and growth planning' },
  { icon: Users, title: 'Design', description: 'UI/UX design that converts' },
  { icon: TrendingUp, title: 'Development', description: 'Full-stack web development' },
  { icon: Award, title: 'Marketing', description: 'Digital marketing and SEO' },
];

const projects = [
  { title: 'TechCorp Rebrand', category: 'Branding', image: 'https://picsum.photos/seed/1/600/400' },
  { title: 'StartupX Platform', category: 'Development', image: 'https://picsum.photos/seed/2/600/400' },
  { title: 'FinanceApp', category: 'Design', image: 'https://picsum.photos/seed/3/600/400' },
];

const stats = [
  { value: '150+', label: 'Projects' },
  { value: '50+', label: 'Clients' },
  { value: '8+', label: 'Years' },
  { value: '99%', label: 'Satisfaction' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold">Nexus Agency</span>
          <div className="flex items-center gap-6">
            <a href="#services" className="text-sm text-white/70 hover:text-white">Services</a>
            <a href="#work" className="text-sm text-white/70 hover:text-white">Work</a>
            <button className="px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-lg">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-violet-400 font-medium mb-4"
          >
            Digital Agency
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            We build{' '}
            <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
              digital products
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            Strategy, design, and development for ambitious brands. We turn ideas into exceptional digital experiences.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button className="px-6 py-3 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 inline-flex items-center gap-2">
              Start a Project <ArrowRight size={18} />
            </button>
            <button className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5">
              View Work
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-violet-400 mb-2">{stat.value}</div>
              <div className="text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-violet-500/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-white/60 text-sm">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Selected Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-video bg-white/10 rounded-xl mb-4 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-violet-400 text-sm">{project.category}</span>
                <h3 className="text-lg font-semibold mt-1">{project.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start?</h2>
          <p className="text-white/60 mb-8">Let's discuss your next project.</p>
          <a
            href="mailto:hello@nexus.agency"
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600"
          >
            Get in Touch <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-white/60 text-sm">
          © 2026 Nexus Agency. Built with UIForge.
        </div>
      </footer>
    </main>
  );
}
