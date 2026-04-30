declare module 'figma:asset/*';
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module 'lucide-react' {
  import * as React from 'react';
  export const Play: React.ComponentType<any>;
  export const Pause: React.ComponentType<any>;
  export const RotateCcw: React.ComponentType<any>;
  const icons: { [key: string]: React.ComponentType<any> };
  export default icons;
}

// Provide a very permissive JSX IntrinsicElements to avoid missing element errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
