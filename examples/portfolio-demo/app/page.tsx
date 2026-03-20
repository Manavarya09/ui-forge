import { motion } from 'framer-motion';
import { ArrowRight, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack marketplace with real-time payments',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
  },
  {
    title: 'AI Dashboard',
    description: 'Analytics platform for machine learning models',
    tags: ['React', 'Python', 'TensorFlow'],
  },
  {
    title: 'Design System',
    description: 'Component library with 50+ UI components',
    tags: ['TypeScript', 'Storybook', 'Tailwind'],
  },
];

const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Figma', 'Tailwind'];

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold">Alex Chen</span>
          <div className="flex items-center gap-6">
            <a href="#work" className="text-sm text-white/70 hover:text-white transition-colors">Work</a>
            <a href="#about" className="text-sm text-white/70 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-pink-400 font-medium mb-4"
          >
            Full-Stack Developer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Building digital{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              experiences
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mb-10"
          >
            I craft high-performance web applications with clean code and thoughtful design. Currently focused on building products that make a difference.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <a href="#contact" className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors inline-flex items-center gap-2">
              Get in touch <ArrowRight size={18} />
            </a>
            <a href="#work" className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors">
              View work
            </a>
          </motion.div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Selected Work</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 bg-black/50 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-colors"
              >
                <div className="h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white/50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-white/60 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
            <p className="text-white/60 mb-4">
              With over 5 years of experience in web development, I specialize in building scalable applications using modern technologies.
            </p>
            <p className="text-white/60 mb-6">
              When I'm not coding, you'll find me exploring new design trends, contributing to open source, or hiking in the mountains.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-4 py-2 bg-white/5 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-white/60 mb-8">
            Have a project in mind? Let's chat about how I can help bring your ideas to life.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            <Mail size={18} />
            hello@example.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">© 2026 Alex Chen. Built with UIForge.</p>
          <div className="flex gap-4">
            <a href="https://github.com" className="text-white/60 hover:text-white text-sm">GitHub</a>
            <a href="https://linkedin.com" className="text-white/60 hover:text-white text-sm">LinkedIn</a>
            <a href="https://twitter.com" className="text-white/60 hover:text-white text-sm">Twitter</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
