
# Encrypted Credentials

The **Credentials** package is a TypeScript module inspired by Ruby on Rails credentials.
It provides a secure way to manage and edit sensitive data stored in encrypted files.

## Features

- **File Encryption**: Encrypt and decrypt files using the AES-256-GCM encryption algorithm.
- **Key Management**: Automatically generate and manage encryption keys securely.
- **YAML Support**: Works with YAML format for storing structured data.
- **Environment-Specific Configuration**: Supports environment-specific configuration files (e.g., `development`, `production`) for credentials.

## Installation

Install the package using npm:

```bash
npm install credentials-store --save
```

## Editing Encrypted Files

Edit encrypted credentials for a specific environment using your system's default text editor.

```bash
npx credentials-store
```

or

```bash
npx credentials production
```

## Reading Encrypted Files

```typescript
import { credentials } from 'credentials-store';

const config = credentials(); // Read and parse the default credentials file
```

You can also specify an environment:

```typescript
const config = credentials('production'); // Read and parse the production environment credentials
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

We welcome contributions! Please feel free to open issues or submit pull requests to improve this package.
