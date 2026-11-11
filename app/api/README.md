# Backend API

Reserved for the TaskFlow backend HTTP API.

**Agreed technology direction:** Node.js + Express + TypeScript.

```text
api/
├── src/
│   ├── config/
│   ├── db/
│   ├── middleware/
│   ├── modules/
│   │   ├── health/
│   │   ├── auth/
│   │   └── tasks/
│   └── shared/
└── tests/
```

The exact server entry files, module internals, validation library, database access library, migration tool, authentication design, and test stack remain open decisions.

No backend source code or package manifest has been created.
