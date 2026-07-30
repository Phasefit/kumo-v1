(function () {
  function client() {
    return window.KumoSupabase.getClient();
  }

  async function getOrCreateProfile(user) {
    const { data, error } = await client().from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (error) throw new Error("Kunne ikke laste profilen.");
    if (data) return data;

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
    return created;
  }

  async function updateProfile(userId, changes) {
    const { data, error } = await client()
      .from("profiles")
      .update(changes)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw new Error("Kunne ikke oppdatere profilen.");
    return data;
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
