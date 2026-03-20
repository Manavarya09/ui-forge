# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within UIForge, please follow these steps:

### For Security Researchers

1. **Do not** create a public GitHub issue for security vulnerabilities
2. Send a detailed report to the maintainers via:
   - GitHub Security Advisories (preferred)
   - Email to the maintainers

### What to Include

When reporting, please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: You should receive an acknowledgment within 48 hours
- **Initial Assessment**: We aim to provide an initial assessment within 7 days
- **Resolution**: We will work to release a fix and public disclosure as quickly as possible
- **Credit**: Security researchers who report valid vulnerabilities will be credited in the release notes (unless you prefer to remain anonymous)

## Security Best Practices

When using UIForge:

- Always verify the source of npm packages before installation
- Review generated code before deploying to production
- Keep your Node.js and npm versions up to date
- Use environment variables for sensitive configuration

## Dependencies

UIForge depends on third-party packages. We regularly update dependencies and monitor for known vulnerabilities. Users should:

- Keep their installations up to date
- Review dependency changes in updates
- Use `npm audit` to check for vulnerabilities in generated projects

## Security Updates

Security updates will be released as patch versions and announced through:

- GitHub Releases
- npm registry version updates

## Scope

This security policy applies to:

- The UIForge CLI tool
- Generated project templates
- Documentation and website

Out of scope:

- User-generated content in projects created with UIForge
- Third-party packages used by generated projects
