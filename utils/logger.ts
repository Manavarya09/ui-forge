import chalk from 'chalk';
import gradient from 'gradient-string';
import ora, { type Ora } from 'ora';

const theme = {
  primary: gradient(['#6366f1', '#8b5cf6', '#a855f7']),
  success: gradient(['#22c55e', '#16a34a']),
  error: gradient(['#ef4444', '#dc2626']),
};

interface Step {
  name: string;
  status: 'pending' | 'running' | 'done' | 'skip';
}

class ProgressTracker {
  private steps: Step[] = [];
  private currentIndex = 0;
  private spinner: Ora | null = null;

  start(steps: string[]): void {
    this.steps = steps.map((name) => ({ name, status: 'pending' }));
    this.currentIndex = 0;
  }

  next(): void {
    if (this.currentIndex < this.steps.length) {
      this.steps[this.currentIndex].status = 'done';
      this.currentIndex++;
    }
  }

  skip(): void {
    if (this.currentIndex < this.steps.length) {
      this.steps[this.currentIndex].status = 'skip';
      this.currentIndex++;
    }
  }

  getSteps(): Step[] {
    return this.steps;
  }

  render(): void {
    process.stdout.moveCursor(0, -this.steps.length);
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      let icon = chalk.gray('○');
      let color = chalk.gray;

      if (step.status === 'done') {
        icon = chalk.green('✓');
        color = chalk.green;
      } else if (step.status === 'skip') {
        icon = chalk.yellow('○');
        color = chalk.yellow;
      } else if (step.status === 'running') {
        icon = chalk.cyan('●');
        color = chalk.cyan;
      }

      process.stdout.write(`  ${icon} ${color(step.name)}\n`);
    }
  }

  startSpinner(text: string): Ora {
    this.spinner = ora({
      text: chalk.cyan(text),
      spinner: 'dots',
      color: 'cyan',
    }).start();
    return this.spinner;
  }

  stopSpinner(success: boolean = true, text?: string): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(text ? chalk.green(text) : undefined);
      } else {
        this.spinner.fail(text ? chalk.red(text) : undefined);
      }
      this.spinner = null;
    }
  }
}

const progressTracker = new ProgressTracker();

export const logger = {
  logo: () => {
    console.log();
    console.log(theme.primary('  ╔═══════════════════════════════════════════════════╗'));
    console.log(theme.primary('  ║') + '   ' + chalk.bold.white('UIForge') + ' ' + chalk.gray('v1.0') + ' '.repeat(31) + theme.primary('║'));
    console.log(theme.primary('  ║') + '   ' + chalk.gray('Premium UI Generation CLI') + ' '.repeat(20) + theme.primary('║'));
    console.log(theme.primary('  ╚═══════════════════════════════════════════════════╝'));
    console.log();
  },

  success: (message: string) => {
    console.log('  ' + chalk.green('✓') + ' ' + chalk.green(message));
  },

  error: (message: string) => {
    console.log('  ' + chalk.red('✗') + ' ' + chalk.red(message));
  },

  warning: (message: string) => {
    console.log('  ' + chalk.yellow('⚠') + ' ' + chalk.yellow(message));
  },

  info: (message: string) => {
    console.log('  ' + chalk.cyan('ℹ') + ' ' + chalk.cyan(message));
  },

  step: (current: number, total: number, message: string) => {
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((current / total) * 20);
    const empty = 20 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    
    console.log(chalk.gray('  ┌─ ' + bar + ' ' + percentage + '% ─┐'));
    console.log(chalk.gray('  │') + ' ' + message + ' '.repeat(Math.max(0, 45 - message.length)) + chalk.gray('│'));
    console.log(chalk.gray('  └' + '─'.repeat(50) + '┘'));
  },

  stepSimple: (message: string) => {
    const steps = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
      process.stdout.write(`\r  ${chalk.cyan(steps[i % steps.length])} ${chalk.white(message)}`);
      i++;
    }, 80);
    
    setTimeout(() => {
      clearInterval(interval);
      process.stdout.write('\r' + ' '.repeat(60) + '\r');
      console.log('  ' + chalk.green('✓') + ' ' + chalk.white(message));
    }, 400);
  },

  steps: (messages: string[], duration: number = 300) => {
    console.log();
    messages.forEach((msg, index) => {
      setTimeout(() => {
        console.log('  ' + chalk.cyan('→') + ' ' + chalk.white(msg));
      }, index * duration);
    });
  },

  done: () => {
    console.log();
    console.log(theme.success('  ╔═══════════════════════════════════════════════════╗'));
    console.log(theme.success('  ║') + ' ' + chalk.green.bold('🚀 UIForge Ready!') + ' '.repeat(28) + theme.success('║'));
    console.log(theme.success('  ╚═══════════════════════════════════════════════════╝'));
    console.log();
  },

  header: (message: string) => {
    console.log();
    console.log(chalk.bold.white('  ' + message));
    console.log();
  },

  divider: () => {
    console.log(chalk.gray('  ' + '─'.repeat(50)));
  },

  nextSteps: (projectName: string) => {
    console.log();
    console.log(chalk.bold.white('  Next steps:'));
    console.log();
    console.log('  ' + chalk.gray('$') + ' ' + chalk.white(`cd ${projectName}`));
    console.log('  ' + chalk.gray('$') + ' ' + chalk.white('npm install'));
    console.log('  ' + chalk.gray('$') + ' ' + chalk.green('npm run dev'));
    console.log();
  },

  aiProvider: (provider: string, type: 'local' | 'cloud') => {
    const icon = type === 'local' ? '🏠' : '☁️';
    const label = type === 'local' ? 'Using Ollama (local)' : 'Using Groq (cloud)';
    console.log();
    console.log('  ' + chalk.cyan(icon) + ' ' + chalk.white(label));
  },

  warningBox: (title: string, messages: string[]) => {
    console.log();
    console.log(chalk.yellow('  ┌──────────────────────────────────────────────────┐'));
    console.log(chalk.yellow('  │') + ' ' + chalk.yellow.bold(title));
    for (const msg of messages) {
      console.log(chalk.yellow('  │') + ' ' + chalk.yellow(msg));
    }
    console.log(chalk.yellow('  └──────────────────────────────────────────────────┘'));
    console.log();
  },

  errorBox: (title: string, message: string) => {
    console.log();
    console.log(chalk.red('  ┌──────────────────────────────────────────────────┐'));
    console.log(chalk.red('  │') + ' ' + chalk.red.bold(title));
    console.log(chalk.red('  │') + ' ' + chalk.red(message));
    console.log(chalk.red('  └──────────────────────────────────────────────────┘'));
    console.log();
  },

  spinners: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  spinIndex: 0,

  spin: (message: string) => {
    const spinner = chalk.cyan(logger.spinners[logger.spinIndex % logger.spinners.length]);
    logger.spinIndex++;
    process.stdout.write(`\r  ${spinner} ${message}`);
  },

  clearSpin: () => {
    process.stdout.write('\r' + ' '.repeat(60) + '\r');
  },

  startSpinner: (text: string) => {
    return progressTracker.startSpinner(text);
  },

  stopSpinner: (success: boolean = true, text?: string) => {
    progressTracker.stopSpinner(success, text);
  },

  progress: progressTracker,
};
