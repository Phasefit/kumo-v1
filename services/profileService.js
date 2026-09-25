(function () {
  function client() {
    return window.KumoSupabase.getClient();
  }

  function cacheProfile(profile) {
    try {
      localStorage.setItem(`kumo-profile:${profile.id}`, JSON.stringify({
        id: profile.id,
        display_name: profile.display_name,
        selected_language: profile.selected_language,
      }));
    } catch {
      // Unavailable browser storage must not prevent online sign-in.
    }
    return profile;
  }

  async function getOrCreateProfile(user) {
    if (navigator.onLine === false) {
      try {
        const cached = JSON.parse(localStorage.getItem(`kumo-profile:${user.id}`));
        if (cached?.id === user.id &&
            ["japanese", "turkish", "albanian"].includes(cached.selected_language)) return cached;
      } catch {
        // Missing or invalid cache requires an online load.
      }
      throw new Error("Koble til nettet og åpne kurset én gang før du bruker Kumo uten nett.");
    }
    const { data, error } = await client().from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (error) throw new Error("Kunne ikke laste profilen.");
    if (data) return cacheProfile(data);

    const profile = {
      id: user.id,
      display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Elev",
    };
    const { data: created, error: createError } = await client()
      .from("profiles")
      .upsert(profile, { onConflict: "id" })
      .select()
      .single();
    if (createError) throw new Error("Kunne ikke opprette profilen.");
    return cacheProfile(created);
  }

  async function updateProfile(userId, changes) {
    const { data, error } = await client()
      .from("profiles")
      .update(changes)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw new Error("Kunne ikke oppdatere profilen.");
    return cacheProfile(data);
  }

  async function updateSelectedLanguage(userId, language) {
    return updateProfile(userId, { selected_language: language });
  }

  window.KumoServices = window.KumoServices || {};
  window.KumoServices.profile = Object.freeze({
    getOrCreateProfile,
    updateProfile,
    updateSelectedLanguage,
  });
})();
