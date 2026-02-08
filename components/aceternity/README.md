# Aceternity UI Components

This folder contains components from [Aceternity UI](https://ui.aceternity.com/).

## How to use

1. Visit https://ui.aceternity.com/components
2. Choose a component you want to use
3. Copy the component code and paste it into a new file in this folder
4. Make sure to install any additional dependencies the component requires

## Common Dependencies

Most Aceternity components require:
- `framer-motion` - For animations (already installed)
- `clsx` - For conditional classes (already installed)
- `tailwind-merge` - For merging Tailwind classes (already installed)
- `lucide-react` - For icons (install if needed: `bun add lucide-react`)

## Example Usage

```tsx
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";

export default function Page() {
  return <TextGenerateEffect words="Hello World" />;
}
```

## Available Components

Add your Aceternity components here as you copy them from the website.
