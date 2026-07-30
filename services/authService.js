(function () {
  function client() {
    return window.KumoSupabase.getClient();
  }

  function friendlyAuthError(error, action) {
    const message = String(error?.message || "");
    const code = String(error?.code || error?.error_code || "").toLowerCase();
    const status = Number(error?.status || 0);
    if (/invalid login credentials/i.test(message)) return "Feil e-postadresse eller passord.";
    if (/email not confirmed/i.test(message)) return "Bekreft e-postadressen før du logger inn.";
    if (/user already registered/i.test(message)) return "Det finnes allerede en konto med denne e-postadressen.";
    if (/password/i.test(message) && /characters|weak/i.test(message)) return "Passordet oppfyller ikke sikkerhetskravene.";
    if (/rate limit|too many requests/i.test(message) || code.includes("rate_limit")) {
      return "For mange forsøk på kort tid. Vent noen minutter før du prøver igjen.";
    }
    if (/email address not authorized/i.test(message) || code.includes("email_address_not_authorized")) {
      return "Supabase sin testtjeneste tillater ikke denne e-postadressen. Konfigurer egen SMTP under Authentication → Emails.";
    }
    if (/error sending confirmation email/i.test(message) || code.includes("email_send")) {
      return "Supabase fikk ikke sendt bekreftelsesmailen. Kontroller Auth Logs og SMTP-oppsettet.";
    }
    if (action === "signup" && status >= 500 && (!message || message === "{}")) {
      return "Supabase fikk ikke sendt bekreftelsesmailen. Konfigurer SMTP under Authentication → Emails, og prøv igjen.";
    }
    if (/database error saving new user/i.test(message) || code.includes("unexpected_failure")) {
      return "Database-triggeren feilet under opprettelse av brukeren. Kjør database-migrasjonen på nytt og kontroller Auth Logs.";
    }
    if (/redirect/i.test(message) && /allow|url/i.test(message)) {
      return "Bekreftelsesadressen er ikke tillatt. Legg http://127.0.0.1:8765/** til under Authentication → URL Configuration.";
    }
    if (/signup.*disabled/i.test(message) || code.includes("signup_disabled")) {
      return "Registrering er deaktivert i Supabase Authentication.";
    }
    if (/invalid.*email|validate email/i.test(message) || code.includes("validation_failed")) {
      return "E-postadressen er ikke gyldig.";
    }

    const detail = [code, message].filter(Boolean).join(": ");
    const fallback = action === "signup" ? "Kunne ikke opprette kontoen." : "Kunne ikke logge inn.";
    return detail ? `${fallback} Supabase svarte: ${detail}` : `${fallback} Prøv igjen.`;
  }

  async function signUp({ email, password, displayName, captchaToken }) {
    const { data, error } = await client().auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || "" },
        emailRedirectTo: window.location.origin + window.location.pathname,
        captchaToken,
      },
    });
    if (error) throw new Error(friendlyAuthError(error, "signup"));
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error(
        "Det finnes allerede en konto med denne e-postadressen. Prøv å logge inn, eller bruk glemt passord.",
      );
    }
    return data;
  }

  async function signIn({ email, password }) {
    const { data, error } = await client().auth.signInWithPassword({ email, password });
    if (error) throw new Error(friendlyAuthError(error, "login"));
    return data;
  }

  function redirectUrl() {
    return window.location.origin + window.location.pathname;
  }

  async function sendPasswordReset(email, captchaToken) {
    const { error } = await client().auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl(),
      captchaToken,
    });
    if (error) throw new Error(friendlyAuthError(error, "reset"));
  }

  async function updatePassword(password) {
    const { error } = await client().auth.updateUser({ password });
    if (error) throw new Error(friendlyAuthError(error, "update"));
  }

  async function resendConfirmation(email) {
    const { error } = await client().auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: redirectUrl() },
    });
    if (error) throw new Error(friendlyAuthError(error, "resend"));
  }

  async function signOut() {
    const { error } = await client().auth.signOut();
    if (error) throw new Error("Kunne ikke logge ut. Prøv igjen.");
  }

  async function getSession() {
    const { data, error } = await client().auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function getCurrentUser() {
    const { data, error } = await client().auth.getUser();
    if (error) throw error;
    return data.user;
  }

  function onAuthStateChange(callback) {
    return client().auth.onAuthStateChange(callback);
  }

  window.KumoServices = window.KumoServices || {};
  window.KumoServices.auth = Object.freeze({
    signUp,
    signIn,
    sendPasswordReset,
    updatePassword,
    resendConfirmation,
    signOut,
    getSession,
    getCurrentUser,
    onAuthStateChange,
  });
})();
