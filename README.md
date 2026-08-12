# stuff8_core

Estate core repo for Stuff8. Owns `ecompose.yml` (the estate manifest) and the
composition frontend built with **Astro.js** and **Tailwind CSS**.

## Structure

```
stuff8_core/
├── ecompose.yml   # estate manifest (CT, expose, deploy, services)
└── frontend/      # Astro.js + Tailwind CSS frontend application
```

The domain repos (auth, inventory, marketplace, bidding, ...) are siblings
composed through `ecompose.yml` — either `lxs:` packages from the registry or
`path:` source.

## Running Locally

```bash
cd frontend
npm install
npm run dev
```
