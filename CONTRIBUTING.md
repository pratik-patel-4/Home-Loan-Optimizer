# Contributing to Home Loan Optimizer

Thank you for your interest in contributing to the Home Loan Optimizer project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Be respectful and considerate
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Personal or political attacks
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/home-loan-optimizer.git
   cd home-loan-optimizer
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/home-loan-optimizer.git
   ```

### Install Dependencies

```bash
cd home-loan-optimizer
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/tax-calculator`)
- `fix/` - Bug fixes (e.g., `fix/emi-calculation-error`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-utils`)
- `test/` - Adding tests (e.g., `test/add-emi-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add tax benefit calculator"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 4. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Select your branch
- Fill in the PR template
- Submit for review

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use type inference where appropriate

```typescript
// Good
interface LoanDetails {
  principal: number;
  rate: number;
  tenure: number;
}

function calculateEMI(loan: LoanDetails): number {
  // implementation
}

// Avoid
function calculateEMI(loan: any): any {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// Good
interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
}) => {
  // implementation
};
```

### File Organization

```
src/
├── components/
│   ├── feature-name/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.test.tsx (if applicable)
│   │   └── index.ts
│   └── shared/
│       └── SharedComponent.tsx
├── utils/
│   ├── utilityName.ts
│   └── utilityName.test.ts (if applicable)
└── types/
    └── typeName.ts
```

### Naming Conventions

- **Components**: PascalCase (e.g., `LoanHealthAnalyzer`)
- **Files**: PascalCase for components, camelCase for utilities
- **Functions**: camelCase (e.g., `calculateEMI`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_TENURE_YEARS`)
- **Interfaces/Types**: PascalCase (e.g., `LoanDetails`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use trailing commas in objects and arrays
- Maximum line length: 100 characters

```typescript
// Good
const loan = {
  principal: 1000000,
  rate: 10.5,
  tenure: 120,
};

// Avoid
const loan = {
  principal: 1000000,
  rate: 10.5,
  tenure: 120
}
```

### ESLint

Run ESLint before committing:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(calculator): add tax benefit calculator"

# Bug fix
git commit -m "fix(emi): correct EMI calculation for edge cases"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(utils): simplify amortization logic"

# Breaking change
git commit -m "feat(api): change loan interface structure

BREAKING CHANGE: LoanDetails interface now requires startDate field"
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests when applicable
- Provide detailed description in body for complex changes

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] No console.log or debugging code left
- [ ] All tests pass (if tests exist)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)

### PR Title Format

Follow the same format as commit messages:

```
feat(calculator): add prepayment strategy comparison
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
- [ ] Tests added/updated (if applicable)
```

### Review Process

1. **Automated Checks**: CI/CD runs linting and builds
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged
5. **Merge**: Squash and merge (default)

### After Merge

- Delete your feature branch
- Update your local main branch
- Close related issues (if any)

---

## Testing Guidelines

### Manual Testing

Always test your changes manually:

1. **Functionality**: Feature works as expected
2. **Edge Cases**: Test with unusual inputs
3. **Responsive Design**: Test on different screen sizes
4. **Browser Compatibility**: Test on Chrome, Firefox, Safari
5. **Accessibility**: Test keyboard navigation

### Unit Tests (Recommended)

If adding tests, follow these guidelines:

```typescript
// Example: utils/emi.test.ts
import { calculateEMI } from './emi';

describe('calculateEMI', () => {
  it('should calculate EMI correctly', () => {
    const result = calculateEMI(1000000, 10, 120);
    expect(result).toBeCloseTo(13215, 0);
  });

  it('should handle zero principal', () => {
    const result = calculateEMI(0, 10, 120);
    expect(result).toBe(0);
  });

  it('should handle zero rate', () => {
    const result = calculateEMI(1000000, 0, 120);
    expect(result).toBeCloseTo(8333, 0);
  });
});
```

### Test Coverage

- Aim for high coverage on utility functions
- Test edge cases and error conditions
- Test component rendering (if using testing library)

---

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Explain non-obvious code

```typescript
/**
 * Calculates the Equated Monthly Installment (EMI) for a loan
 * 
 * @param principal - The loan principal amount
 * @param annualRate - Annual interest rate (in percentage)
 * @param tenureMonths - Loan tenure in months
 * @returns The calculated EMI amount
 * 
 * @example
 * const emi = calculateEMI(1000000, 10.5, 120);
 * // Returns: 13493.73
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  // implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing installation process
- Updating dependencies
- Modifying configuration

### Architecture Documentation

Update ARCHITECTURE.md when:
- Adding new components
- Changing data flow
- Modifying state management
- Introducing new patterns

---

## Reporting Issues

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Try latest version** to see if issue is fixed

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Enter '...'
4. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other relevant information
```

---

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with the "question" label
4. Join community discussions (if available)

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Home Loan Optimizer! 🎉

---

**Contributing Guide Version**: 1.0.0  
**Last Updated**: June 10, 2026