"use client";

import { useEffect, useState } from 'react';

import { getAvailablePropertyTypes } from '@/lib/api';

const CACHE_KEY = 'aether.availablePropertyTypes.v2';

let memoryCache: string[] | null = null;

function readSessionCache() {
  if (typeof window === 'undefined') return null;

  try {
    const rawValue = window.sessionStorage.getItem(CACHE_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return null;

    const values = parsed.filter((value): value is string => typeof value === 'string');
    return values.length > 0 ? values : null;
  } catch {
    return null;
  }
}

function writeSessionCache(values: string[]) {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(values));
  } catch {
    // Session storage is a speed-up only; the UI can still use the fresh response.
  }
}

export function useAvailablePropertyTypes() {
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState<string[] | undefined>(() => {
    if (memoryCache) return memoryCache;

    const sessionCache = readSessionCache();
    if (sessionCache) {
      memoryCache = sessionCache;
      return sessionCache;
    }

    return undefined;
  });

  useEffect(() => {
    let active = true;

    if (memoryCache) {
      setAvailablePropertyTypes(memoryCache);
      return () => {
        active = false;
      };
    }

    async function loadAvailablePropertyTypes() {
      try {
        const nextTypes = await getAvailablePropertyTypes();
        const usableTypes = nextTypes.length > 0 ? nextTypes : undefined;

        if (usableTypes) {
          memoryCache = usableTypes;
          writeSessionCache(usableTypes);
        }

        if (active) {
          setAvailablePropertyTypes(usableTypes);
        }
      } catch {
        if (active) {
          setAvailablePropertyTypes(undefined);
        }
      }
    }

    void loadAvailablePropertyTypes();

    return () => {
      active = false;
    };
  }, []);

  return availablePropertyTypes;
}
