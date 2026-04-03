import { useEffect, useRef, useCallback } from "react";

export function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const acquire = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    if (wakeLockRef.current) return; // déjà acquis
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch (err) {
      // L'utilisateur a refusé ou le navigateur ne supporte pas
      console.warn("Wake Lock refusé :", err);
    }
  }, []);

  const release = useCallback(async () => {
    if (!wakeLockRef.current) return;
    try {
      await wakeLockRef.current.release();
    } finally {
      wakeLockRef.current = null;
    }
  }, []);

  // Acquiert / relâche selon `active`
  useEffect(() => {
    if (active) {
      acquire();
    } else {
      release();
    }
  }, [active, acquire, release]);

  // Le wake lock est automatiquement relâché par le navigateur quand
  // l'onglet passe en arrière-plan. On le ré-acquiert dès que la page
  // redevient visible ET que le timer est encore actif.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && active) {
        acquire();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [active, acquire]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      release();
    };
  }, [release]);
}
