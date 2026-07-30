(function () {
  let client = null;

  function getConfiguration() {
    const config = window.KUMO_CONFIG || {};
    return {
      url: String(config.supabaseUrl || "").trim(),
      anonKey: String(config.supabaseAnonKey || "").trim(),
    };
  }

  function getClient() {
    if (client) return client;

    const { url, anonKey } = getConfiguration();
    if (!url || !anonKey) {
      throw new Error(
        "Supabase er ikke konfigurert. Sett VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY før appen startes.",
      );
    }
    if (!window.supabase?.createClient) {
      throw new Error("Supabase-klienten kunne ikke lastes. Kontroller nettverkstilkoblingen og prøv igjen.");
    }

    client = window.supabase.createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return client;
  }

  function isConfigured() {
    const { url, anonKey } = getConfiguration();
    return Boolean(url && anonKey);
  }

  window.KumoSupabase = Object.freeze({ getClient, isConfigured });
})();
