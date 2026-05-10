(function () {
  const ADMIN_VIEWS = ["broadcast", "schedule", "queue", "soundboard", "fx", "lore", "chat"];

  function createApi(request) {
    const jsonBody = (body = {}) => JSON.stringify(body);
    return {
      admin: {
        load: () => request("/api/admin")
      },
      continuity: {
        loadBrain: () => request("/api/admin/continuity-brain")
      },
      broadcast: {
        setMode: (mode) => request("/api/broadcast-mode", { method: "POST", body: jsonBody({ mode }) })
      },
      community: {
        submitSuggestion: ({ title, note }) => request("/api/community-suggestions", { method: "POST", body: jsonBody({ title, note }) }),
        updateSettings: (settings) => request("/api/admin/community", { method: "POST", body: jsonBody(settings) }),
        updateSuggestion: (payload) => request("/api/admin/community-suggestion", { method: "POST", body: jsonBody(payload) }),
        updateSupporterTier: (payload) => request("/api/admin/supporter-tier", { method: "POST", body: jsonBody(payload) })
      },
      lore: {
        upsertEntry: (entry) => request("/api/admin/lore-entry", { method: "POST", body: jsonBody(entry) }),
        search: (query = "") => request(`/api/admin/lore?q=${encodeURIComponent(query)}`)
      },
      fx: {
        trigger: (payload) => request("/api/fx", { method: "POST", body: jsonBody(payload) }),
        clear: () => request("/api/fx", { method: "DELETE" }),
        saveSnapshot: (payload) => request("/api/admin/fx-snapshots", { method: "POST", body: jsonBody(payload) }),
        launchSnapshot: (payload) => request("/api/admin/fx-snapshots/launch", { method: "POST", body: jsonBody(payload) })
      },
      soundboard: {
        load: () => request("/api/dj-soundboard"),
        fire: (soundId) => request("/api/fx", { method: "POST", body: jsonBody({ id: "soundboard-sample", params: { soundId } }) })
      }
    };
  }

  function createRailController({ shell, chatPanel, panels = {}, buttons = {}, onViewChange = () => {} } = {}) {
    let view = "broadcast";

    const normalizeView = (nextView) => (ADMIN_VIEWS.includes(nextView) ? nextView : "broadcast");

    const apply = ({ shellOpen = true } = {}) => {
      const hiddenFor = (name) => !shellOpen || view !== name;
      Object.entries(panels).forEach(([name, panel]) => {
        panel?.classList.toggle("hidden", hiddenFor(name));
      });
      const showingChat = shellOpen && view === "chat";
      chatPanel?.classList.toggle("hidden", !showingChat);
      if (chatPanel) {
        chatPanel.classList.remove("collapsed");
      }
      shell?.classList.remove("chat-collapsed");
      Object.entries(buttons).forEach(([name, group]) => {
        (group || []).forEach((button) => button.classList.toggle("active", name === view));
      });
    };

    return {
      getView: () => view,
      setView(nextView) {
        view = normalizeView(nextView);
        apply({ shellOpen: true });
        onViewChange(view);
        return view;
      },
      syncShellOpen(isOpen) {
        apply({ shellOpen: Boolean(isOpen) });
      },
      hideAdminPanels() {
        Object.values(panels).forEach((panel) => panel?.classList.add("hidden"));
      },
      bind() {
        Object.entries(buttons).forEach(([name, group]) => {
          (group || []).forEach((button) => button.addEventListener("click", () => this.setView(name)));
        });
      }
    };
  }

  window.DoinkAdminCockpit = {
    views: ADMIN_VIEWS,
    createApi,
    createRailController
  };
}());
