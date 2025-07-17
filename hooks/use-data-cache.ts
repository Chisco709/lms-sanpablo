import { useState, useCallback, useRef } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live en milisegundos
  maxSize?: number; // Máximo número de entradas en cache
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

export function useDataCache<T>(options: CacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, maxSize = 50 } = options; // TTL por defecto: 5 minutos
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());

  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) return null;
    
    // Verificar si el dato expiró
    if (Date.now() - entry.timestamp > ttl) {
      cache.current.delete(key);
      return null;
    }
    
    // Incrementar contador de acceso
    entry.accessCount++;
    
    return entry.data;
  }, [ttl]);

  const set = useCallback((key: string, data: T) => {
    // Si el cache está lleno, eliminar el menos usado
    if (cache.current.size >= maxSize) {
      let leastUsedKey = '';
      let leastUsedCount = Infinity;
      
      for (const [k, entry] of cache.current.entries()) {
        if (entry.accessCount < leastUsedCount) {
          leastUsedCount = entry.accessCount;
          leastUsedKey = k;
        }
      }
      
      if (leastUsedKey) {
        cache.current.delete(leastUsedKey);
      }
    }
    
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 0
    });
  }, [maxSize]);

  const remove = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const invalidatePattern = useCallback((pattern: string) => {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];
    
    for (const key of cache.current.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => cache.current.delete(key));
  }, []);

  return {
    get,
    set,
    remove,
    clear,
    invalidatePattern,
    size: cache.current.size
  };
} 