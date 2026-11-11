# TaskFlow infrastructure configuration

This folder is reserved for infrastructure and delivery configuration that belongs in version control.

Possible future areas include local container configuration and later AWS infrastructure, deployment, CI/CD, and operational configuration. Add them only when the application requires them and the approach has been explained and agreed.

Do not store credentials, private keys, real environment files, state files containing sensitive values, or other secrets here. Explain cost, security, and cleanup before any paid cloud resources are introduced.

Every meaningful infrastructure change requires a beginner-friendly guide under docs/implementation/infrastructure/ and links to the relevant theory lessons.
