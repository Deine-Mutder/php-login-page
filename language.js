(() => {
  const language = navigator.language.toLowerCase().startsWith("de") ? "de" : "en";

  const translations = {
    en: {
      "login.title": "Sign In",
      "login.signupTitle": "Sign Up",
      "login.newHere": "New here?",
      "login.join": "Join us today",
      "login.createPrompt": "One of us or just create an account?",
      "login.comeOver": "Come over here",
      "login.username": "Username",
      "login.email": "Email",
      "login.password": "Password",
      "login.login": "Login",
      "login.signup": "Sign Up",
      "dashboard.loading": "Loading...",
      "dashboard.editProfile": "Edit profile",
      "dashboard.logout": "Log out",
      "dashboard.welcome": "Welcome back, {name}!",
      "dashboard.welcomeText": "Ready for a conversation? Join the global live chat and connect with everyone online in real time.",
      "dashboard.enterChat": "Join Chat Room",
      "dashboard.globalChat": "Global Chat Room",
      "dashboard.back": "Back",
      "dashboard.messagePlaceholder": "Write a message...",
      "dashboard.send": "Send message",
      "dashboard.editTitle": "Edit profile",
      "dashboard.displayName": "Display name",
      "dashboard.yourName": "Your name",
      "dashboard.avatarUrl": "Profile image URL",
      "dashboard.cancel": "Cancel",
      "dashboard.save": "Save",
      "dashboard.you": "You",
      "dashboard.anonymous": "Anonymous",
      "dashboard.delete": "Delete",
      "dashboard.deleteError": "Message could not be deleted.",
      "dashboard.nameRequired": "Please enter a display name.",
      "dashboard.profileError": "Profile could not be saved.",
      "dashboard.sendError": "Message could not be sent.",
      "auth.initError": "Firebase Authentication was not initialized correctly.",
      "auth.signupSuccess": "Registration successful! Please sign in now.",
      "auth.signupFailed": "Registration failed.",
      "auth.emailInUse": "This email address is already in use.",
      "auth.invalidEmail": "The email address is invalid.",
      "auth.weakPassword": "The password is too weak (at least 6 characters).",
      "auth.notEnabled": "Email/password registration is not enabled in Firebase.",
      "auth.loginSuccess": "Signed in successfully! Redirecting...",
      "auth.loginFailed": "Login failed.",
      "auth.credentials": "The email or password is incorrect.",
      "auth.disabled": "This user has been disabled."
    },
    de: {
      "login.title": "Anmelden",
      "login.signupTitle": "Registrieren",
      "login.newHere": "Neu hier?",
      "login.join": "Mach heute mit",
      "login.createPrompt": "Schon dabei oder möchtest du ein Konto erstellen?",
      "login.comeOver": "Komm zu uns",
      "login.username": "Benutzername",
      "login.email": "E-Mail",
      "login.password": "Passwort",
      "login.login": "Anmelden",
      "login.signup": "Registrieren",
      "dashboard.loading": "Laden...",
      "dashboard.editProfile": "Profil bearbeiten",
      "dashboard.logout": "Abmelden",
      "dashboard.welcome": "Willkommen zurück, {name}!",
      "dashboard.welcomeText": "Bereit für eine Unterhaltung? Tritt dem globalen Live-Chat bei und tausche dich in Echtzeit mit allen angemeldeten Usern aus.",
      "dashboard.enterChat": "Zum Chat-Room",
      "dashboard.globalChat": "Globaler Chat-Room",
      "dashboard.back": "Zurück",
      "dashboard.messagePlaceholder": "Schreibe eine Nachricht...",
      "dashboard.send": "Nachricht senden",
      "dashboard.editTitle": "Profil bearbeiten",
      "dashboard.displayName": "Anzeigename",
      "dashboard.yourName": "Dein Name",
      "dashboard.avatarUrl": "Profilbild-URL",
      "dashboard.cancel": "Abbrechen",
      "dashboard.save": "Speichern",
      "dashboard.you": "Du",
      "dashboard.anonymous": "Anonym",
      "dashboard.delete": "Löschen",
      "dashboard.deleteError": "Nachricht konnte nicht gelöscht werden.",
      "dashboard.nameRequired": "Bitte gib einen Anzeigenamen ein.",
      "dashboard.profileError": "Profil konnte nicht gespeichert werden.",
      "dashboard.sendError": "Nachricht konnte nicht gesendet werden.",
      "auth.initError": "Firebase Auth wurde nicht richtig initialisiert.",
      "auth.signupSuccess": "Registrierung erfolgreich! Bitte melde dich jetzt an.",
      "auth.signupFailed": "Registrierung fehlgeschlagen.",
      "auth.emailInUse": "Diese E-Mail-Adresse wird bereits verwendet.",
      "auth.invalidEmail": "Die E-Mail-Adresse ist ungültig.",
      "auth.weakPassword": "Das Passwort ist zu schwach (mindestens 6 Zeichen).",
      "auth.notEnabled": "E-Mail-/Passwort-Registrierung ist in Firebase nicht aktiviert.",
      "auth.loginSuccess": "Erfolgreich angemeldet! Weiterleitung...",
      "auth.loginFailed": "Login fehlgeschlagen.",
      "auth.credentials": "E-Mail oder Passwort ist falsch.",
      "auth.disabled": "Dieser Benutzer wurde deaktiviert."
    }
  };

  const translate = (key, values = {}) => {
    let text = translations[language][key] || translations.en[key] || key;
    Object.entries(values).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, value);
    });
    return text;
  };

  window.appLanguage = language;
  window.translate = translate;

  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = translate(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-value]").forEach((element) => {
    element.value = translate(element.dataset.i18nValue);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = translate(element.dataset.i18nTitle);
  });
})();
