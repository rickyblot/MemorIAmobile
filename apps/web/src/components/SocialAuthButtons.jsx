import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function GoogleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3l-.7.5-2.4 1.9C5.1 19.4 8.3 21.4 12 21.4c2.4 0 4.4-.8 5.9-2.2l-3.1-2.4c-.8.6-1.9.9-2.8.9-2.2 0-4-1.5-4.7-3.4z"
      />
      <path
        fill="#4A90E2"
        d="M3.5 7.3C2.7 8.8 2.3 10.4 2.3 12s.4 3.2 1.2 4.7l3.1-2.4c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.5 7.3z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.3c1.3 0 2.5.5 3.4 1.3l2.5-2.5C16.4 2.6 14.4 1.8 12 1.8 8.3 1.8 5.1 3.8 3.5 7.3l3.1 2.4C7.9 6.8 9.8 5.3 12 5.3z"
      />
    </svg>
  );
}

function AppleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3.7zM14.5 5.8c.6-.7 1-1.7.9-2.7-0.9.0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

/**
 * Shared Google / Apple OAuth buttons for login & signup.
 * Pass `providers` from AuthContext (`oauthProviders`) to hide unconfigured buttons.
 */
export default function SocialAuthButtons({
  providers = null,
  onGoogle,
  onApple,
  loadingProvider = null,
  disabled = false,
  googleLabel = 'Continuar con Google',
  appleLabel = 'Continuar con Apple',
}) {
  const busy = Boolean(loadingProvider) || disabled;
  const showGoogle = !providers || providers.includes('google');
  const showApple = !providers || providers.includes('apple');

  if (!showGoogle && !showApple) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-card px-3 text-muted-foreground font-medium normal-case">
            O continúa con
          </span>
        </div>
      </div>

      {showGoogle && (
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={onGoogle}
          className="w-full h-12 rounded-xl bg-white text-foreground border-border hover:bg-muted/60 font-semibold shadow-sm"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {loadingProvider === 'google' ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <GoogleIcon />
            )}
            <span>{googleLabel}</span>
          </span>
        </Button>
      )}

      {showApple && (
        <Button
          type="button"
          disabled={busy}
          onClick={onApple}
          className="w-full h-12 rounded-xl bg-black text-white hover:bg-black/90 font-semibold shadow-sm"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {loadingProvider === 'apple' ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <AppleIcon />
            )}
            <span>{appleLabel}</span>
          </span>
        </Button>
      )}
    </div>
  );
}
