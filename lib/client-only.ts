// Utilidades para verificar entorno del navegador y prevenir errores SSR

/**
 * Verifica si estamos en el entorno del navegador
 */
export const isClient = typeof window !== 'undefined';

/**
 * Verifica si document está disponible
 */
export const hasDocument = typeof document !== 'undefined';

/**
 * Verifica si navigator está disponible
 */
export const hasNavigator = typeof navigator !== 'undefined';

/**
 * Ejecuta una función solo en el cliente
 * @param fn Función a ejecutar
 * @param fallback Valor de retorno para el servidor (opcional)
 */
export function clientOnly<T>(fn: () => T, fallback?: T): T | undefined {
  if (isClient) {
    try {
      return fn();
    } catch (error) {
      console.warn('Error en función clientOnly:', error);
      return fallback;
    }
  }
  return fallback;
}

/**
 * Obtiene la URL actual de forma segura
 */
export function getCurrentUrl(): string {
  return clientOnly(() => window.location.href, '') || '';
}

/**
 * Obtiene el título del documento de forma segura
 */
export function getDocumentTitle(): string {
  return clientOnly(() => document.title, '') || '';
}

/**
 * Obtiene el user agent de forma segura
 */
export function getUserAgent(): string {
  return clientOnly(() => navigator.userAgent, '') || '';
}

/**
 * Ejecuta una función cuando el DOM esté listo
 */
export function onDOMReady(fn: () => void): void {
  if (!isClient) return;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

/**
 * Crea un elemento DOM de forma segura
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K
): HTMLElementTagNameMap[K] | null {
  return clientOnly(() => document.createElement(tagName), null);
}

/**
 * Obtiene elementos por selector de forma segura
 */
export function querySelectorAll(selector: string): NodeListOf<Element> | null {
  return clientOnly(() => document.querySelectorAll(selector), null);
}

/**
 * Obtiene un elemento por ID de forma segura
 */
export function getElementById(id: string): HTMLElement | null {
  return clientOnly(() => document.getElementById(id), null);
}

/**
 * Abre una URL en una nueva ventana de forma segura
 */
export function openWindow(url: string, target: string = '_blank', features?: string): Window | null {
  return clientOnly(() => window.open(url, target, features), null);
}

/**
 * Añade un event listener de forma segura
 */
export function addEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  clientOnly(() => {
    window.addEventListener(type, listener, options);
  });
}

/**
 * Remueve un event listener de forma segura
 */
export function removeEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | EventListenerOptions
): void {
  clientOnly(() => {
    window.removeEventListener(type, listener, options);
  });
}

/**
 * Obtiene las dimensiones de la ventana de forma segura
 */
export function getWindowDimensions(): { width: number; height: number } {
  return clientOnly(
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    { width: 0, height: 0 }
  ) || { width: 0, height: 0 };
}

/**
 * Obtiene la posición del scroll de forma segura
 */
export function getScrollPosition(): { x: number; y: number } {
  return clientOnly(
    () => ({
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
    }),
    { x: 0, y: 0 }
  ) || { x: 0, y: 0 };
}

/**
 * Verifica si el usuario prefiere modo oscuro
 */
export function prefersDarkMode(): boolean {
  return clientOnly(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    false
  ) || false;
}

/**
 * Obtiene información del dispositivo de forma segura
 */
export function getDeviceInfo(): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  return clientOnly(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    
    return { isMobile, isTablet, isDesktop };
  }, { isMobile: false, isTablet: false, isDesktop: true }) || 
  { isMobile: false, isTablet: false, isDesktop: true };
}

/**
 * Hook seguro para verificar si estamos en el cliente
 * Usar dentro de componentes React
 */
export function createClientHook() {
  if (typeof window === 'undefined') {
    return () => false;
  }
  
  // Solo importar React si estamos en el cliente
  const React = require('react');
  
  return function useIsClient(): boolean {
    const [isClient, setIsClient] = React.useState(false);
    
    React.useEffect(() => {
      setIsClient(true);
    }, []);
    
    return isClient;
  };
} 