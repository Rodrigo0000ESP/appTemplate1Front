import { ChakraProvider as ChakraUIProvider, extendTheme } from '@chakra-ui/react';
import type { ReactNode } from 'react';

// Custom theme siguiendo los estándares de R Firm
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
});

interface ChakraProviderProps {
  children: ReactNode;
}

/**
 * ChakraProvider wrapper para componentes @rdm-org-dev
 * Necesario para que los componentes de Chakra UI funcionen en Astro
 * Uso: Envolver componentes que usen Chakra UI con client:load o client:only="react"
 */
export function ChakraProvider({ children }: ChakraProviderProps) {
  return <ChakraUIProvider theme={theme}>{children}</ChakraUIProvider>;
}
