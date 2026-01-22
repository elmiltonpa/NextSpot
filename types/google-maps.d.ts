// src/types/google-maps.d.ts

// Esto le dice a TypeScript que existen estos elementos HTML personalizados
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gmp-place-autocomplete": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
