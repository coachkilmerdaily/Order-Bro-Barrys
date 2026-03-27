const STORAGE_KEY = "barrys-burgers-ordering-brain-v2";
const LEGACY_STORAGE_KEY = "barrys-burgers-ordering-brain-v1";
const ADELAIDE_TIMEZONE = "Australia/Adelaide";
const STORE_LOCATION = "13 Semaphore Road, Semaphore, South Australia 5091";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SUPABASE_STATE_ROW_ID = "barrys-main";

const southAustraliaHolidays2026 = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-26", name: "Australia Day" },
  { date: "2026-03-09", name: "Adelaide Cup Day" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-04", name: "Easter Saturday" },
  { date: "2026-04-05", name: "Easter Sunday" },
  { date: "2026-04-06", name: "Easter Monday" },
  { date: "2026-04-25", name: "Anzac Day" },
  { date: "2026-06-08", name: "King's Birthday" },
  { date: "2026-10-05", name: "Labour Day" },
  { date: "2026-12-24", name: "Christmas Eve evening public holiday" },
  { date: "2026-12-25", name: "Christmas Day" }
];

const scheduleLibrary = {
  daily: { label: "Daily", days: [0, 1, 2, 3, 4, 5, 6] },
  weekdays: { label: "Monday to Friday", days: [1, 2, 3, 4, 5] },
  monToSat: { label: "Monday to Saturday", days: [1, 2, 3, 4, 5, 6] }
};

const defaultContext = {
  tradeExpectation: "normal",
  weatherMode: "neutral",
  eventImpact: "none",
  eventName: "",
  contextNote: "",
  liveWeatherSummary: "",
  liveWeatherMeta: "",
  lastWeatherSync: ""
};

const defaultManagerContact = {
  phone: "0478043619",
  email: "barrylovesburgers@gmail.com",
  smsWebhookUrl: "",
  emailWebhookUrl: ""
};

const defaultWeeklyChecklist = [
  { id: "bun-week", title: "Bun orders for the week", note: "To be done on Monday", dayIndex: 1 },
  { id: "bun-weekend", title: "Bun orders for the weekend", note: "To be done on Friday", dayIndex: 5 },
  { id: "till-change", title: "Check change levels for the till", note: "Do this on Sunday night", dayIndex: 0 },
  { id: "packaging-check", title: "Check packaging levels for orders", note: "To be done on Wednesday", dayIndex: 3 }
];

const dailyOrderSchedule = {
  0: ["buns", "galipo", "meat", "fv"],
  1: [],
  2: ["meat"],
  3: ["meat", "fv", "galipo", "packaging"],
  4: ["meat", "galipo"],
  5: ["meat", "fv", "buns"],
  6: ["meat"]
};

const tradeMultipliers = {
  quiet: 0.92,
  normal: 1,
  busy: 1.1,
  "very-busy": 1.2
};

const categoryDemandMultipliers = {
  quiet: 0.9,
  steady: 1,
  busy: 1.08
};

const weatherProfiles = {
  neutral: { label: "Typical Semaphore weather", byTag: {}, severe: false },
  hot: { label: "Hot / warm", byTag: { dessert: 1.08, chips: 1.05, fresh: 1.04, packaging: 1.03 }, severe: false },
  cold: { label: "Cold / wet / windy", byTag: { dessert: 0.95, fresh: 0.96 }, severe: false },
  severe: { label: "Severe weather warning", byTag: {}, severe: true }
};

const eventProfiles = {
  none: { label: "No known event", multiplier: 1 },
  local: { label: "Local activity", multiplier: 1.05 },
  major: { label: "Major event", multiplier: 1.1 }
};

const categorySeeds = [
  {
    id: "buns",
    name: "Buns",
    supplier: "Buns",
    accent: "Burger buns and rolls",
    scheduleKey: "weekdays",
    demandMode: "steady",
    notes: "",
    items: [
      { id: "burger-buns", name: "Burger Buns", supplier: "Buns", packSize: "tray", parLevel: 3, currentStock: 1, dailyUse: 1, preferredMax: 5, hardMax: 6, storage: "Dry store", tags: ["core", "event"] }
    ]
  },
  {
    id: "meat",
    name: "Saint Meat",
    supplier: "Saint Meat",
    accent: "Patty, chicken, bacon, mince",
    scheduleKey: "daily",
    demandMode: "steady",
    notes: "",
    items: [
      {
        id: "beef-patties",
        name: "Beef Patties",
        supplier: "Saint Meat",
        orderedIn: "boxes",
        countedIn: "boxes",
        orderPackLabel: "box",
        parLevel: 4,
        currentStock: 3,
        dailyUse: 1,
        preferredMax: 5,
        hardMax: 6,
        totalStorageMax: "Hard fridge limit 6 boxes",
        maxOrderedStock: 6,
        maxPreppedStock: null,
        prepStorageLabel: "",
        storage: "Cool room",
        category: "Meat",
        conversionRule: "",
        tags: ["core", "event"]
      },
      {
        id: "beef-balls",
        name: "Beef Balls",
        supplier: "Saint Meat",
        orderedIn: "boxes",
        countedIn: "boxes",
        orderPackLabel: "box",
        parLevel: 1,
        currentStock: 1,
        dailyUse: 0.25,
        preferredMax: 2,
        hardMax: 2,
        totalStorageMax: "Hard fridge limit 2 boxes",
        maxOrderedStock: 2,
        maxPreppedStock: null,
        prepStorageLabel: "",
        storage: "Cool room",
        category: "Meat",
        conversionRule: "",
        tags: ["core"]
      },
      {
        id: "chicken",
        name: "Chicken",
        supplier: "Saint Meat",
        orderedIn: "kg",
        countedIn: "prepped tubs",
        orderPackLabel: "kg",
        parLevel: 5,
        currentStock: 18,
        dailyUse: 6,
        preferredMax: 24,
        hardMax: 28,
        totalStorageMax: "Hard raw limit 8 kg",
        maxOrderedStock: 8,
        maxPreppedStock: 28,
        prepStorageLabel: "Hard prepped limit 28 tubs",
        storage: "Prep fridge",
        category: "Meat",
        conversionRule: "User-defined later if known",
        tags: ["core", "event", "prepped"]
      },
      {
        id: "bacon",
        name: "Bacon",
        supplier: "Saint Meat",
        orderedIn: "kg",
        countedIn: "prepped tubs",
        orderPackLabel: "kg",
        parLevel: 4,
        currentStock: 8,
        dailyUse: 3,
        preferredMax: 12,
        hardMax: 14,
        totalStorageMax: "Hard raw limit 8 kg",
        maxOrderedStock: 8,
        maxPreppedStock: 14,
        prepStorageLabel: "Hard prepped limit 14 tubs",
        storage: "Prep fridge",
        category: "Meat",
        conversionRule: "User-defined later if known",
        tags: ["core", "event", "prepped"]
      },
      {
        id: "pork",
        name: "Pork",
        supplier: "Saint Meat",
        orderedIn: "weekly requirement",
        countedIn: "weekly requirement",
        orderPackLabel: "per week",
        parLevel: 4,
        currentStock: 2,
        dailyUse: 0.6,
        preferredMax: 4,
        hardMax: 4,
        totalStorageMax: "Hard weekly limit 4 units",
        maxOrderedStock: 4,
        maxPreppedStock: null,
        prepStorageLabel: "",
        storage: "Cool room",
        category: "Meat",
        conversionRule: "Exact unit to define later",
        tags: ["core"]
      }
    ]
  },
  {
    id: "fv",
    name: "Fruit & Veg",
    supplier: "Fruit & Veg",
    accent: "Produce and garnish",
    scheduleKey: "monToSat",
    demandMode: "steady",
    notes: "",
    items: [
      { id: "iceberg", name: "Iceberg Lettuce", supplier: "Fruit & Veg", packSize: "box of 10", parLevel: 2, currentStock: 1, dailyUse: 1.4, preferredMax: 4, hardMax: 5, storage: "Cool room", tags: ["fresh"] },
      { id: "tomato", name: "Burger Tomato", supplier: "Fruit & Veg", packSize: "7kg crate", parLevel: 3, currentStock: 1, dailyUse: 1.1, preferredMax: 4, hardMax: 5, storage: "Prep fridge", tags: ["fresh"] },
      { id: "onion", name: "Brown Onion", supplier: "Fruit & Veg", packSize: "10kg bag", parLevel: 2, currentStock: 2, dailyUse: 0.6, preferredMax: 3, hardMax: 4, storage: "Dry store", tags: ["fresh"] }
    ]
  },
  {
    id: "galipo",
    name: "Galipo",
    supplier: "Galipo",
    accent: "Sauces and pantry items",
    scheduleKey: "weekdays",
    demandMode: "steady",
    notes: "",
    items: [
      { id: "burger-sauce", name: "Burger Sauce", supplier: "Galipo", packSize: "12 x 1L", parLevel: 2, currentStock: 1, dailyUse: 0.35, preferredMax: 3, hardMax: 4, storage: "Dry store", tags: ["sauce", "event"] },
      { id: "pickles", name: "Sliced Pickles", supplier: "Galipo", packSize: "4 x 2kg", parLevel: 2, currentStock: 1, dailyUse: 0.45, preferredMax: 3, hardMax: 4, storage: "Dry store", tags: ["sauce"] },
      { id: "seasoning", name: "Signature Seasoning", supplier: "Galipo", packSize: "5kg tub", parLevel: 1, currentStock: 1, dailyUse: 0.15, preferredMax: 2, hardMax: 2, storage: "Dry store", tags: ["sauce"] }
    ]
  },
  {
    id: "bidfood",
    name: "Bidfood",
    supplier: "Bidfood",
    accent: "Frozen and pantry support",
    scheduleKey: "weekdays",
    demandMode: "steady",
    notes: "",
    items: [
      { id: "fries", name: "Fries", supplier: "Bidfood", packSize: "15kg carton", parLevel: 10, currentStock: 4, dailyUse: 2.8, preferredMax: 12, hardMax: 14, storage: "Freezer", tags: ["chips", "event"] },
      { id: "nuggets", name: "Chicken Nuggets", supplier: "Bidfood", packSize: "5kg box", parLevel: 3, currentStock: 1, dailyUse: 0.8, preferredMax: 4, hardMax: 5, storage: "Freezer", tags: ["core"] },
      { id: "onion-rings", name: "Onion Rings", supplier: "Bidfood", packSize: "4kg box", parLevel: 2, currentStock: 1, dailyUse: 0.5, preferredMax: 3, hardMax: 4, storage: "Freezer", tags: ["chips"] }
    ]
  },
  {
    id: "packaging",
    name: "Packaging",
    supplier: "Packaging",
    accent: "Boxes, cups, wraps",
    scheduleKey: "weekdays",
    demandMode: "steady",
    notes: "",
    items: [
      { id: "burger-box", name: "Burger Boxes", supplier: "Packaging", packSize: "250 ct carton", parLevel: 4, currentStock: 1, dailyUse: 0.8, preferredMax: 5, hardMax: 6, storage: "Dry store", tags: ["packaging", "event"] },
      { id: "chip-cup", name: "Chip Cups", supplier: "Packaging", packSize: "500 ct sleeve", parLevel: 3, currentStock: 1, dailyUse: 0.65, preferredMax: 4, hardMax: 5, storage: "Dry store", tags: ["packaging", "event"] },
      { id: "wrap-paper", name: "Wrap Paper", supplier: "Packaging", packSize: "1000 ct", parLevel: 2, currentStock: 2, dailyUse: 0.4, preferredMax: 3, hardMax: 4, storage: "Dry store", tags: ["packaging"] }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    supplier: "Desserts",
    accent: "Shakes and sweets",
    scheduleKey: "weekdays",
    demandMode: "steady",
    notes: "",
    items: [
      { id: "soft-serve", name: "Soft Serve Mix", supplier: "Desserts", packSize: "10L bag", parLevel: 3, currentStock: 1, dailyUse: 0.9, preferredMax: 4, hardMax: 5, storage: "Cool room", tags: ["dessert"] },
      { id: "choc-fudge", name: "Chocolate Fudge", supplier: "Desserts", packSize: "6 x 1L", parLevel: 2, currentStock: 1, dailyUse: 0.35, preferredMax: 3, hardMax: 4, storage: "Dry store", tags: ["dessert"] },
      { id: "oreo-crumb", name: "Oreo Crumb", supplier: "Desserts", packSize: "2kg bag", parLevel: 2, currentStock: 0, dailyUse: 0.3, preferredMax: 3, hardMax: 4, storage: "Dry store", tags: ["dessert"] }
    ]
  }
];

const defaultSupplierMemory = buildDefaultSupplierMemory();
const appState = loadState();
let activeCategoryId = null;
let clockTimer = null;
let supabaseClient = null;
let syncReady = false;
let syncSession = null;
let syncSaveTimer = null;
let syncHydrating = false;
let drawerTouchStartY = 0;
let drawerTouchStartX = 0;
let totalListVisible = false;

const refs = {
  todayLabel: document.getElementById("todayLabel"),
  currentTimeLabel: document.getElementById("currentTimeLabel"),
  authPanel: document.querySelector(".auth-panel"),
  authEmailInput: document.getElementById("authEmailInput"),
  authPasswordInput: document.getElementById("authPasswordInput"),
  authSignInButton: document.getElementById("authSignInButton"),
  authSignUpButton: document.getElementById("authSignUpButton"),
  authSignOutButton: document.getElementById("authSignOutButton"),
  authStatus: document.getElementById("authStatus"),
  todayRunTitle: document.getElementById("todayRunTitle"),
  todayRunNote: document.getElementById("todayRunNote"),
  todayRunSuppliers: document.getElementById("todayRunSuppliers"),
  viewTotalListButton: document.getElementById("viewTotalListButton"),
  categoryGrid: document.getElementById("categoryGrid"),
  allCategoryGrid: document.getElementById("allCategoryGrid"),
  totalListPanel: document.getElementById("totalListPanel"),
  stockPanel: document.getElementById("stockPanel"),
  stockDrawerScrim: document.getElementById("stockDrawerScrim"),
  stockDrawerPanel: document.querySelector(".stock-drawer-panel"),
  categoryTitle: document.getElementById("categoryTitle"),
  categorySubtext: document.getElementById("categorySubtext"),
  backToSuppliersButton: document.getElementById("backToSuppliersButton"),
  markSupplierCheckedButton: document.getElementById("markSupplierCheckedButton"),
  tradeExpectationSelect: document.getElementById("tradeExpectationSelect"),
  weatherModeSelect: document.getElementById("weatherModeSelect"),
  eventImpactSelect: document.getElementById("eventImpactSelect"),
  eventNameInput: document.getElementById("eventNameInput"),
  contextNoteInput: document.getElementById("contextNoteInput"),
  contextHints: document.getElementById("contextHints"),
  liveWeatherStatus: document.getElementById("liveWeatherStatus"),
  liveWeatherMeta: document.getElementById("liveWeatherMeta"),
  syncWeatherButton: document.getElementById("syncWeatherButton"),
  todayAvailabilityValue: document.getElementById("todayAvailabilityValue"),
  nextDeliveryValue: document.getElementById("nextDeliveryValue"),
  coverDaysValue: document.getElementById("coverDaysValue"),
  categoryDemandSelect: document.getElementById("categoryDemandSelect"),
  orderNotesInput: document.getElementById("orderNotesInput"),
  deliveryWarnings: document.getElementById("deliveryWarnings"),
  itemTable: document.getElementById("itemTable"),
  clearSupplierButton: document.getElementById("clearSupplierButton"),
  todayOrderList: document.getElementById("todayOrderList"),
  weeklyReminderList: document.getElementById("weeklyReminderList"),
  weeklyChecklist: document.getElementById("weeklyChecklist"),
  managerPhoneInput: document.getElementById("managerPhoneInput"),
  managerEmailInput: document.getElementById("managerEmailInput"),
  smsWebhookInput: document.getElementById("smsWebhookInput"),
  emailWebhookInput: document.getElementById("emailWebhookInput"),
  textManagerButton: document.getElementById("textManagerButton"),
  emailManagerButton: document.getElementById("emailManagerButton"),
  checklistPopup: document.getElementById("checklistPopup"),
  checklistPopupScrim: document.getElementById("checklistPopupScrim"),
  checklistPopupList: document.getElementById("checklistPopupList"),
  closeChecklistPopupButton: document.getElementById("closeChecklistPopupButton"),
  totalLineCount: document.getElementById("totalLineCount"),
  totalUnitCount: document.getElementById("totalUnitCount"),
  warningCount: document.getElementById("warningCount"),
  summaryHints: document.getElementById("summaryHints"),
  documentUploadInput: document.getElementById("documentUploadInput"),
  uploadDropzone: document.getElementById("uploadDropzone"),
  uploadStatus: document.getElementById("uploadStatus"),
  reviewQueue: document.getElementById("reviewQueue"),
  supplierMemoryList: document.getElementById("supplierMemoryList")
};

init();

function init() {
  applyDailyRolloverIfNeeded();
  updateHeaderClock();
  clockTimer = window.setInterval(updateHeaderClock, 30000);

  refs.authEmailInput.value = defaultManagerContact.email;
  refs.authSignInButton.addEventListener("click", onAuthSignIn);
  refs.authSignUpButton.addEventListener("click", onAuthSignUp);
  refs.authSignOutButton.addEventListener("click", onAuthSignOut);
  refs.viewTotalListButton.addEventListener("click", onViewTotalList);
  refs.tradeExpectationSelect.addEventListener("change", onContextChange);
  refs.weatherModeSelect.addEventListener("change", onContextChange);
  refs.eventImpactSelect.addEventListener("change", onContextChange);
  refs.eventNameInput.addEventListener("input", onContextChange);
  refs.contextNoteInput.addEventListener("input", onContextChange);
  refs.syncWeatherButton.addEventListener("click", syncLiveWeather);
  refs.categoryDemandSelect.addEventListener("change", onCategoryMetaChange);
  refs.orderNotesInput.addEventListener("input", onCategoryMetaChange);
  refs.backToSuppliersButton.addEventListener("click", () => {
    activeCategoryId = null;
    render();
  });
  refs.stockDrawerScrim.addEventListener("click", () => {
    activeCategoryId = null;
    render();
  });
  refs.stockDrawerPanel.addEventListener("touchstart", onDrawerTouchStart, { passive: true });
  refs.stockDrawerPanel.addEventListener("touchend", onDrawerTouchEnd, { passive: true });
  refs.markSupplierCheckedButton.addEventListener("click", markActiveSupplierChecked);
  refs.clearSupplierButton.addEventListener("click", clearActiveSupplier);
  refs.managerPhoneInput.addEventListener("input", onManagerContactChange);
  refs.managerEmailInput.addEventListener("input", onManagerContactChange);
  refs.smsWebhookInput.addEventListener("input", onManagerContactChange);
  refs.emailWebhookInput.addEventListener("input", onManagerContactChange);
  refs.textManagerButton.addEventListener("click", textManager);
  refs.emailManagerButton.addEventListener("click", emailManager);
  refs.checklistPopupScrim.addEventListener("click", dismissChecklistPopup);
  refs.closeChecklistPopupButton.addEventListener("click", dismissChecklistPopup);
  refs.weeklyChecklist.addEventListener("change", onWeeklyChecklistToggle);
  refs.documentUploadInput.addEventListener("change", onUploadInputChange);
  refs.uploadDropzone.addEventListener("dragover", onDropzoneDragOver);
  refs.uploadDropzone.addEventListener("dragleave", onDropzoneDragLeave);
  refs.uploadDropzone.addEventListener("drop", onDropzoneDrop);

  render();
  bootstrapSupabase();
}

function render() {
  const today = getTodayInfo();
  renderAuthPanel();
  renderContextPanel();
  renderRunBoard(today);
  renderCategoryGrid(today);
  renderAllCategoryGrid();
  renderActiveCategory(today);
  renderTodayOrderList(today);
  renderWeeklyReminderList();
  renderWeeklyChecklist(today);
  renderChecklistPopup(today);
  renderReviewQueue();
  renderSupplierMemory();
}

function renderAuthPanel() {
  const locked = !syncSession;
  document.querySelectorAll("main.layout > section:not(.auth-panel)").forEach((section) => {
    section.classList.toggle("hidden", locked);
  });
  refs.stockPanel.classList.toggle("hidden", locked || !getActiveCategory());
  refs.authPanel?.classList.toggle("hidden", !locked);
  refs.authPanel?.classList.remove("compact-auth");

  if (!supabaseClient) {
    refs.authStatus.textContent = "Sync setup is loading.";
    refs.authSignInButton.disabled = true;
    refs.authSignUpButton.disabled = true;
    refs.authSignOutButton.disabled = true;
    return;
  }

  refs.authSignInButton.disabled = false;
  refs.authSignUpButton.disabled = false;
  refs.authSignOutButton.disabled = !syncSession;

  if (syncSession?.user?.email) {
    refs.authStatus.textContent = `Synced as ${syncSession.user.email}.`;
    refs.authEmailInput.value = syncSession.user.email;
    return;
  }

  refs.authStatus.textContent = "Sign in with the shared Barry's login to sync between phone and desktop.";
}

async function bootstrapSupabase() {
  try {
    const config = await loadSupabaseConfig();
    if (!config?.url || !config?.anonKey || !window.supabase?.createClient) {
      refs.authStatus.textContent = "Supabase config was not found. Check the Vercel environment variables.";
      render();
      return;
    }

    supabaseClient = window.supabase.createClient(config.url, config.anonKey);
    const { data } = await supabaseClient.auth.getSession();
    syncSession = data.session;

    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      syncSession = session;
      if (session) {
        await hydrateStateFromSupabase();
      }
      render();
    });

    if (syncSession) {
      await hydrateStateFromSupabase();
    }
  } catch {
    refs.authStatus.textContent = "Could not connect to Supabase yet.";
  }

  render();
}

async function loadSupabaseConfig() {
  const response = await fetch("/api/config");
  if (!response.ok) {
    throw new Error("Missing config");
  }
  return response.json();
}

async function onAuthSignIn() {
  if (!supabaseClient) {
    return;
  }

  const email = refs.authEmailInput.value.trim();
  const password = refs.authPasswordInput.value;
  if (!email || !password) {
    refs.authStatus.textContent = "Enter the shared email and password first.";
    return;
  }

  refs.authStatus.textContent = "Signing in...";
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    refs.authStatus.textContent = `Sign in failed: ${error.message}`;
    return;
  }
}

async function onAuthSignUp() {
  if (!supabaseClient) {
    return;
  }

  const email = refs.authEmailInput.value.trim();
  const password = refs.authPasswordInput.value;
  if (!email || !password) {
    refs.authStatus.textContent = "Enter an email and password first.";
    return;
  }

  refs.authStatus.textContent = "Creating shared login...";
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    refs.authStatus.textContent = `Create login failed: ${error.message}`;
    return;
  }

  refs.authStatus.textContent = "Login created. If email confirmation is enabled in Supabase, confirm it before signing in.";
}

async function onAuthSignOut() {
  if (!supabaseClient) {
    return;
  }

  await supabaseClient.auth.signOut();
  syncSession = null;
  refs.authStatus.textContent = "Signed out of shared sync.";
  render();
}

async function hydrateStateFromSupabase() {
  if (!supabaseClient || !syncSession) {
    return;
  }

  syncHydrating = true;
  try {
    const { data, error } = await supabaseClient
      .from("app_state")
      .select("payload")
      .eq("id", SUPABASE_STATE_ROW_ID)
      .maybeSingle();

    if (error) {
      refs.authStatus.textContent = `Sync load failed: ${error.message}`;
      return;
    }

    if (!data?.payload) {
      await saveStateToSupabase();
      syncReady = true;
      return;
    }

    const hydrated = hydrateParsedState(data.payload);
    Object.keys(appState).forEach((key) => delete appState[key]);
    Object.assign(appState, hydrated);
    syncReady = true;
  } finally {
    syncHydrating = false;
  }
}

function queueSupabaseSave() {
  if (!supabaseClient || !syncSession || !syncReady || syncHydrating) {
    return;
  }

  window.clearTimeout(syncSaveTimer);
  syncSaveTimer = window.setTimeout(() => {
    saveStateToSupabase();
  }, 350);
}

async function saveStateToSupabase() {
  if (!supabaseClient || !syncSession || syncHydrating) {
    return;
  }

  const payload = structuredClone(appState);
  const { error } = await supabaseClient
    .from("app_state")
    .upsert({
      id: SUPABASE_STATE_ROW_ID,
      payload,
      updated_at: new Date().toISOString()
    });

  if (error) {
    refs.authStatus.textContent = `Sync save failed: ${error.message}`;
  }
}

function renderContextPanel() {
  const context = appState.context;
  refs.tradeExpectationSelect.value = context.tradeExpectation;
  refs.weatherModeSelect.value = context.weatherMode;
  refs.eventImpactSelect.value = context.eventImpact;
  refs.eventNameInput.value = context.eventName;
  refs.contextNoteInput.value = context.contextNote;

  const weatherProfile = weatherProfiles[context.weatherMode];
  const eventProfile = eventProfiles[context.eventImpact];
  const eventLine = context.eventImpact === "none"
    ? "No local event uplift is active."
    : `${context.eventName || "Semaphore / PAE event"} is marked as ${eventProfile.label.toLowerCase()}, so event-sensitive lines get a modest uplift.`;
  const weatherLine = weatherProfile.severe
    ? "Severe weather is flagged. Recommendations stay cautious and the app asks for operator judgement instead of auto-cutting stock."
    : `${weatherProfile.label} is active. Weather only nudges weather-sensitive lines rather than moving the whole order heavily.`;
  const tradeLine = `Manual trade expectation is set to ${labelForTradeExpectation(context.tradeExpectation).toLowerCase()}, which carries more weight than weather or event signals.`;

  refs.liveWeatherStatus.textContent = context.liveWeatherSummary || "Live weather not synced yet";
  refs.liveWeatherMeta.textContent = context.liveWeatherMeta || "Manual weather setting is active until a live fetch succeeds.";

  refs.contextHints.innerHTML = [
    { title: "Manual trade setting", body: tradeLine },
    { title: "Weather context", body: weatherLine },
    { title: "Event context", body: eventLine },
    ...(context.contextNote ? [{ title: "Operator note", body: context.contextNote }] : [])
  ]
    .map((hint) => `
      <div class="hint-card">
        <strong>${hint.title}</strong>
        <p>${hint.body}</p>
      </div>
    `)
    .join("");
}

function renderCategoryGrid(today) {
  refs.categoryGrid.innerHTML = "";
  const dayPlan = getTodayOrderChecklist(today);
  if (dayPlan.closed) {
    refs.categoryGrid.className = "category-grid single-column-grid";
    refs.categoryGrid.innerHTML = `
      <div class="category-card checklist-empty-card">
        <div>
          <h3>Closed today</h3>
          <p>No supplier runs are scheduled for ${today.dayName}.</p>
        </div>
      </div>
    `;
    return;
  }

  refs.categoryGrid.className = "category-grid single-column-grid";
  dayPlan.entries.forEach(({ category, status }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category-card ${category.id === activeCategoryId ? "active" : ""}`;
    const supplierMark = getSupplierMark(category);
    const supplierAccent = getSupplierAccent(category);
    const statusLabel = getChecklistStatusLabel(status);
    button.innerHTML = `
      <div class="category-card-top">
        <div>
          <h3>${category.name}</h3>
          <p>${category.items.length} item${category.items.length === 1 ? "" : "s"} to check</p>
        </div>
        <span class="category-card-count">${supplierMark}</span>
      </div>
      <div class="category-card-meta">
        <span class="category-card-accent">${supplierAccent}</span>
        <span class="category-card-caption status-${status}">${status === "done" ? "Checked for today" : status === "in-progress" ? "In progress" : "Ready to check"}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      activeCategoryId = category.id;
      render();
    });

    refs.categoryGrid.appendChild(button);
  });
}

function renderRunBoard(today) {
  const dayPlan = getTodayOrderChecklist(today);
  if (dayPlan.closed) {
    refs.todayRunTitle.textContent = "Closed today";
    refs.todayRunNote.textContent = `No supplier runs are scheduled for ${today.dayName}.`;
    refs.todayRunSuppliers.innerHTML = "";
    refs.viewTotalListButton.disabled = !getSanitizedTodayOrderEntries().length;
    refs.totalListPanel.classList.toggle("hidden", !totalListVisible);
    return;
  }

  const doneCount = dayPlan.entries.filter((entry) => entry.status === "done").length;
  refs.todayRunTitle.textContent = `${doneCount} of ${dayPlan.entries.length} checked`;
  refs.todayRunNote.textContent = doneCount === dayPlan.entries.length
    ? "Today's supplier checks are complete."
    : "Tap a supplier below, enter what is on hand, then mark it checked.";
  refs.todayRunSuppliers.innerHTML = dayPlan.entries
    .map(({ category, status }) => `
      <div class="run-supplier-pill ${status}">
        <span>${category.name}</span>
        <strong>${status === "done" ? "Checked" : status === "in-progress" ? "In progress" : "To do"}</strong>
      </div>
    `)
    .join("");

  const hasTotalList = getSanitizedTodayOrderEntries().length > 0;
  refs.viewTotalListButton.disabled = !hasTotalList;
  refs.viewTotalListButton.textContent = hasTotalList ? "View total list" : "Total list empty";
  refs.totalListPanel.classList.toggle("hidden", !totalListVisible || !hasTotalList);
}

function renderAllCategoryGrid() {
  refs.allCategoryGrid.innerHTML = "";
  appState.categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category-card compact-card ${category.id === activeCategoryId ? "active" : ""}`;
    button.innerHTML = `
      <div class="category-card-top">
        <div>
          <h3>${category.name}</h3>
          <p>${category.items.length} items</p>
        </div>
        <span class="category-card-count">${getSupplierMark(category)}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      activeCategoryId = category.id;
      render();
    });
    refs.allCategoryGrid.appendChild(button);
  });
}

function renderActiveCategory(today) {
  const category = getActiveCategory();
  const checklist = getTodayOrderChecklist(today);
  const checklistEntry = checklist.entries?.find((entry) => entry.category.id === category?.id);
  const isChecked = checklistEntry?.status === "done";
  if (!category) {
    refs.stockPanel.classList.add("hidden");
    refs.itemTable.className = "item-table empty-state";
    refs.itemTable.textContent = "Tap a supplier to start entering current stock counts.";
    refs.categoryTitle.textContent = "Select a supplier";
    refs.deliveryWarnings.innerHTML = "";
    refs.categorySubtext.textContent = "";
    refs.todayAvailabilityValue.textContent = "-";
    refs.nextDeliveryValue.textContent = "-";
    refs.coverDaysValue.textContent = "-";
    refs.markSupplierCheckedButton.disabled = true;
    refs.markSupplierCheckedButton.textContent = "Mark checked";
    refs.clearSupplierButton.disabled = true;
    return;
  }

  refs.stockPanel.classList.remove("hidden");
  refs.markSupplierCheckedButton.disabled = false;
  refs.markSupplierCheckedButton.textContent = isChecked ? "Checked for today" : "Mark checked";
  refs.clearSupplierButton.disabled = false;
  const plan = getSupplierPlan(category, today);
  refs.categoryTitle.textContent = category.name;
  refs.categorySubtext.textContent = isChecked
    ? `Checked off for ${today.dayName}. Next delivery ${plan.nextDeliveryLabel}.`
    : `Enter what is on hand, then mark this supplier checked. Next delivery ${plan.nextDeliveryLabel}.`;
  refs.todayAvailabilityValue.textContent = plan.availableToday ? `Yes - ${today.dayName}` : `No - ${today.dayName}`;
  refs.nextDeliveryValue.textContent = plan.nextDeliveryLabel;
  refs.coverDaysValue.textContent = `${plan.coverDays} day${plan.coverDays === 1 ? "" : "s"}`;
  refs.categoryDemandSelect.value = category.demandMode ?? "steady";
  refs.orderNotesInput.value = category.notes ?? "";

  const warnings = [];
  if (plan.holidayWarning) {
    warnings.push({ title: "Public holiday disruption", body: plan.holidayWarning });
  }
  warnings.push({
    title: "Supplier timing",
    body: `${category.name} follows a ${scheduleLibrary[category.scheduleKey].label.toLowerCase()} delivery pattern. Planning horizon is set to the next valid delivery after today.`
  });
  if (appState.context.weatherMode !== "neutral") {
    warnings.push({ title: "Weather modifier active", body: buildWeatherExplanation(appState.context.weatherMode, category) });
  }
  if (appState.context.eventImpact !== "none") {
    warnings.push({ title: "Event modifier active", body: buildEventExplanation(appState.context, category) });
  }

  refs.deliveryWarnings.innerHTML = warnings
    .map((warning) => `
      <div class="hint-card">
        <strong>${warning.title}</strong>
        <p>${warning.body}</p>
      </div>
    `)
    .join("");

  refs.itemTable.className = "item-table";
  refs.itemTable.innerHTML = "";

  category.items.forEach((item) => {
    const result = calculateRecommendation(item, category, plan, appState.context);
    const countedUnit = getCountedUnit(item);
    const capacityLabel = getCapacityLabel(item, result.hardStorageLimit);
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div class="item-header">
        <div>
          <h3 class="item-name">${item.name}</h3>
        </div>
      </div>
      <div class="simple-input-row">
        <div class="stock-count-row">
          <label class="field">
            <span>How many do we have? (${countedUnit})</span>
            <input type="number" min="0" step="1" value="${item.currentStock}" data-item-input="${item.id}" />
          </label>
          <span class="stock-capacity">${capacityLabel}</span>
        </div>
      </div>
      <div class="item-toggle-row">
        <button
          type="button"
          class="item-toggle-button ${item.notRequiredTomorrow ? "active" : ""}"
          data-item-toggle="${item.id}"
          aria-pressed="${item.notRequiredTomorrow ? "true" : "false"}"
        >
          ${item.notRequiredTomorrow ? "Not required for tomorrow" : "Mark not required"}
        </button>
      </div>
      ${result.warning ? `<p class="item-meta">${result.warning}</p>` : ""}
    `;

    row.querySelector(`[data-item-input="${item.id}"]`).addEventListener("input", (event) => {
      const nextValue = Number.parseInt(event.target.value, 10);
      item.currentStock = Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 0;
      delete appState.todayOrderList[category.id];
      setOrderChecklistDone(getTodayInfo().isoDate, category.id, false);
      persistState();
    });

    row.querySelector(`[data-item-input="${item.id}"]`).addEventListener("change", () => {
      render();
    });

    row.querySelector(`[data-item-toggle="${item.id}"]`).addEventListener("click", () => {
      item.notRequiredTomorrow = !item.notRequiredTomorrow;
      delete appState.todayOrderList[category.id];
      setOrderChecklistDone(getTodayInfo().isoDate, category.id, false);
      persistState();
      render();
    });

    refs.itemTable.appendChild(row);
  });
}

function renderTodayOrderList(today) {
  sanitizeTodayOrderList();
  refs.managerPhoneInput.value = appState.managerContact.phone;
  refs.managerEmailInput.value = appState.managerContact.email;
  refs.smsWebhookInput.value = appState.managerContact.smsWebhookUrl;
  refs.emailWebhookInput.value = appState.managerContact.emailWebhookUrl;

  const groups = appState.todayOrderList || {};
  const entries = Object.values(groups).filter((group) => Array.isArray(group.lines) && group.lines.length);

  if (!entries.length) {
    refs.todayOrderList.className = "summary-preview empty-state";
    refs.todayOrderList.textContent = "Checked supplier totals will appear here.";
    return;
  }

  refs.todayOrderList.className = "summary-preview";
  refs.todayOrderList.innerHTML = entries
    .map((group) => `
      <div class="order-list-group">
        <h3>${group.supplier}</h3>
        <p class="order-list-timestamp">${group.checkedAtLabel || ""}</p>
        ${group.lines.map((line) => `
          <div class="order-list-line">
            <strong>${line.name}</strong>
            <span>${line.notRequiredTomorrow ? "Not required tomorrow" : `${line.quantity} ${line.unit}`}</span>
          </div>
        `).join("")}
      </div>
    `)
    .join("");
}

function renderWeeklyReminderList() {
  sanitizeWeeklyReminderList();
  const entries = Object.values(appState.weeklyReminderList || {}).filter((group) => Array.isArray(group.lines) && group.lines.length);

  if (!entries.length) {
    refs.weeklyReminderList.className = "summary-preview empty-state";
    refs.weeklyReminderList.textContent = "Weekly reminder items will appear here.";
    return;
  }

  refs.weeklyReminderList.className = "summary-preview";
  refs.weeklyReminderList.innerHTML = entries
    .map((group) => `
      <div class="order-list-group">
        <h3>${group.supplier}</h3>
        ${group.lines.map((line) => `
          <div class="order-list-line">
            <strong>${line.name}</strong>
            <span>${line.quantity} ${line.unit}</span>
          </div>
        `).join("")}
      </div>
    `)
    .join("");
}

function renderWeeklyChecklist(today) {
  const items = getWeeklyChecklistItems(today);
  refs.weeklyChecklist.className = "summary-preview";
  refs.weeklyChecklist.innerHTML = items
    .map((item) => `
      <div class="checklist-item ${item.isToday ? "today" : ""}">
        <label class="checklist-item-head">
          <input type="checkbox" data-checklist-id="${item.id}" ${item.completed ? "checked" : ""} />
          <div>
            <strong>${item.title}</strong>
            <span>${item.note}</span>
          </div>
        </label>
        ${item.status ? `<span class="checklist-status">${item.status}</span>` : ""}
      </div>
    `)
    .join("");
}

function renderChecklistPopup(today) {
  if (!refs.checklistPopup || !refs.checklistPopupList) {
    return;
  }

  refs.checklistPopup.classList.add("hidden");
  refs.checklistPopupList.innerHTML = "";
}

function markActiveSupplierChecked() {
  const category = getActiveCategory();
  if (!category) {
    return;
  }

  const today = getTodayInfo();
  appState.todayOrderList[category.id] = buildCheckedSupplierSnapshot(category);
  setOrderChecklistDone(today.isoDate, category.id, true);
  persistState();
  activeCategoryId = null;
  totalListVisible = true;
  render();
}

function buildCheckedSupplierSnapshot(category) {
  const now = new Date();
  const checkedAtLabel = now.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ADELAIDE_TIMEZONE
  });

  return {
    supplier: category.supplier,
    checkedAt: now.toISOString(),
    checkedAtLabel: `Checked ${checkedAtLabel}`,
    lines: category.items.map((item) => ({
      name: item.name,
      quantity: Number.isFinite(Number(item.currentStock)) ? Number(item.currentStock) : 0,
      unit: getCountedUnit(item),
      capped: false,
      notRequiredTomorrow: Boolean(item.notRequiredTomorrow)
    }))
  };
}

function onViewTotalList() {
  if (!getSanitizedTodayOrderEntries().length) {
    return;
  }

  totalListVisible = true;
  render();
  refs.totalListPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function dismissChecklistPopup() {
  if (!refs.checklistPopup) {
    return;
  }

  refs.checklistPopup.classList.add("hidden");
}

function onDrawerTouchStart(event) {
  const touch = event.changedTouches?.[0];
  if (!touch) {
    return;
  }
  drawerTouchStartY = touch.clientY;
  drawerTouchStartX = touch.clientX;
}

function onDrawerTouchEnd(event) {
  const touch = event.changedTouches?.[0];
  if (!touch || !activeCategoryId) {
    return;
  }

  const deltaY = touch.clientY - drawerTouchStartY;
  const deltaX = Math.abs(touch.clientX - drawerTouchStartX);
  if (refs.stockDrawerPanel.scrollTop <= 10 && deltaY > 110 && deltaX < 80) {
    activeCategoryId = null;
    render();
  }
}

function onWeeklyChecklistToggle(event) {
  const checklistId = event.target.dataset.checklistId;
  if (!checklistId) {
    return;
  }

  const today = getTodayInfo();
  const completionKey = `${today.isoDate}:${checklistId}`;
  appState.weeklyChecklistCompletions[completionKey] = event.target.checked;
  persistState();
  render();
}

function calculateRecommendation(item, category, plan, context) {
  const baseCoverNeed = Math.ceil(item.dailyUse * plan.coverDays);
  const baseTarget = Math.max(item.parLevel, baseCoverNeed);

  const adjustments = [
    manualTradeAdjustment(context.tradeExpectation),
    categoryDemandAdjustment(category.demandMode ?? "steady"),
    weatherAdjustment(item, context.weatherMode),
    eventAdjustment(item, context)
  ].filter((entry) => entry.multiplier !== 1 || entry.alwaysShow);

  const combinedMultiplier = adjustments.reduce((product, entry) => product * entry.multiplier, 1);
  const adjustedCoverNeed = Math.max(baseCoverNeed, Math.ceil(baseCoverNeed * combinedMultiplier));
  const idealTarget = Math.max(baseTarget, adjustedCoverNeed);
  const orderedStockEquivalent = item.conversionRule ? Math.ceil(item.currentStock / 4) : item.currentStock;
  const hardStorageLimit = item.maxPreppedStock ?? item.hardMax;
  const preferredStorageLimit = item.preferredMax ?? hardStorageLimit;
  const preferredTarget = Math.min(idealTarget, item.preferredMax);
  const uncappedOrder = Math.max(0, preferredTarget - item.currentStock);
  const maxAllowedOrder = Math.max(0, hardStorageLimit - item.currentStock);
  const suggestedOrder = Math.min(uncappedOrder, maxAllowedOrder);
  const daysCoveredNow = item.dailyUse > 0 ? item.currentStock / item.dailyUse : Number.POSITIVE_INFINITY;
  const preferredCapHit = idealTarget > preferredStorageLimit;
  const storageCapHit = suggestedOrder < uncappedOrder;
  const overCapacity = item.currentStock > hardStorageLimit;
  const storageConstraintLabel = getStorageConstraintLabel(item, hardStorageLimit);
  const capReason = storageCapHit
    ? `Capped at ${suggestedOrder} ${getOrderedUnit(item)} due to storage limit (${storageConstraintLabel}).`
    : "";

  let warning = "";
  if (overCapacity) {
    warning = `Over storage capacity (${storageConstraintLabel}). Check stock count or storage load.`;
  } else if (daysCoveredNow < plan.coverDays && suggestedOrder === 0) {
    warning = "Current stock will not last to the next valid delivery.";
  } else if (preferredCapHit) {
    warning = `Storage limit is constraining the ideal target (${storageConstraintLabel}).`;
  }
  if (!warning && storageCapHit) {
    warning = capReason;
  }
  if (!warning && weatherProfiles[context.weatherMode].severe) {
    warning = "Severe weather is flagged. Confirm expected trade before ordering tightly.";
  }

  let statusLabel = "Covered";
  if (daysCoveredNow < 1) {
    statusLabel = "Urgent";
  } else if (daysCoveredNow < plan.coverDays || suggestedOrder > 0) {
    statusLabel = "Top up";
  }

  return {
    baseCoverNeed,
    adjustedCoverNeed,
    targetLevel: preferredTarget,
    suggestedOrder,
    orderedStockEquivalent,
    hardStorageLimit,
    overCapacity,
    capReason,
    storageConstraintLabel,
    warning,
    storageCapHit,
    preferredCapHit,
    statusLabel,
    driverCount: adjustments.length,
    adjustments: adjustments.map(({ title, body }) => ({ title, body }))
  };
}

function manualTradeAdjustment(tradeExpectation) {
  const multiplier = tradeMultipliers[tradeExpectation] ?? 1;
  return {
    multiplier,
    title: "Manual trade setting",
    body: `${labelForTradeExpectation(tradeExpectation)} applies a ${toPercent(multiplier - 1)} adjustment before weather or events.`
  };
}

function categoryDemandAdjustment(demandMode) {
  const multiplier = categoryDemandMultipliers[demandMode] ?? 1;
  return {
    multiplier,
    title: "Category demand lean",
    body: `${labelForCategoryDemand(demandMode)} keeps this supplier lane slightly ${multiplier >= 1 ? "higher" : "lower"} than neutral.`
  };
}

function weatherAdjustment(item, weatherMode) {
  const profile = weatherProfiles[weatherMode];
  if (profile.severe) {
    return {
      multiplier: 1,
      alwaysShow: true,
      title: "Weather context",
      body: "Severe weather is flagged. The app avoids aggressive cuts and asks for operator judgement instead."
    };
  }

  const multiplier = resolveTagMultiplier(item.tags, profile.byTag);
  return {
    multiplier,
    title: "Weather context",
    body: `${profile.label} creates a ${toPercent(multiplier - 1)} nudge for weather-sensitive lines like this one.`
  };
}

function eventAdjustment(item, context) {
  if (context.eventImpact === "none") {
    return {
      multiplier: 1,
      title: "Event context",
      body: "No local event uplift is active."
    };
  }

  const applies = (item.tags || []).some((tag) => ["event", "chips", "packaging", "core", "sauce"].includes(tag));
  const multiplier = applies ? eventProfiles[context.eventImpact].multiplier : 1;
  return {
    multiplier,
    title: "Event context",
    body: `${context.eventName || "Semaphore / PAE event"} is active, so event-sensitive lines get a ${toPercent(multiplier - 1)} uplift.`
  };
}

function renderReviewQueue() {
  if (!appState.pendingReviews.length) {
    refs.reviewQueue.innerHTML = `
      <div class="hint-card">
        <strong>No pending uploads</strong>
        <p>Upload invoice PDFs, photos, screenshots, or supplier docs to review extracted supplier memory before saving it.</p>
      </div>
    `;
    return;
  }

  refs.reviewQueue.innerHTML = appState.pendingReviews
    .map((review) => {
      const lineItems = review.lines.slice(0, 4).map((line) => {
        const options = buildProductOptions(line.matchProductId);
        return `
          <div class="hint-card">
            <strong>${line.rawName}</strong>
            <p>${line.packSize || "Pack unknown"} | ${line.quantity || "Qty unknown"} | ${line.unit || "Unit unknown"}</p>
            <label class="field">
              <span>Match to Barry's product</span>
              <select data-review-line-match="${review.id}|${line.id}">
                <option value="">Ignore for now</option>
                ${options}
                <option value="__new__">Create new product later</option>
              </select>
            </label>
          </div>
        `;
      }).join("");

      return `
        <div class="hint-card">
          <strong>${review.fileName}</strong>
          <p>Supplier detected: ${review.detectedSupplier || "Unknown"} | Invoice date: ${review.invoiceDate || "Unknown"} | ${review.lines.length} line(s) found</p>
          <p>${review.notesSummary}</p>
          <div class="summary-hints">${lineItems}</div>
          <div class="review-actions">
            <button class="ghost-button" type="button" data-review-action="ignore" data-review-id="${review.id}">Ignore</button>
            <button class="primary-button" type="button" data-review-action="save" data-review-id="${review.id}">Confirm and save</button>
          </div>
        </div>
      `;
    })
    .join("");

  refs.reviewQueue.querySelectorAll("[data-review-action]").forEach((button) => {
    button.addEventListener("click", onReviewAction);
  });
  refs.reviewQueue.querySelectorAll("[data-review-line-match]").forEach((select) => {
    select.addEventListener("change", onReviewMatchChange);
  });
}

function renderSupplierMemory() {
  const memories = Object.values(appState.supplierMemory);
  refs.supplierMemoryList.innerHTML = memories
    .map((memory) => `
      <div class="hint-card">
        <strong>${memory.supplierName}</strong>
        <p>Known products: ${memory.itemAliases.length ? memory.itemAliases.map((alias) => alias.productName).filter((value, index, array) => array.indexOf(value) === index).join(", ") : "None yet"}</p>
        <p>Known units: ${memory.units.length ? memory.units.join(", ") : "None yet"}</p>
        <p>Known pack terms: ${memory.packSizes.length ? memory.packSizes.join(", ") : "None yet"}</p>
        <p>Mapped items: ${memory.itemAliases.length ? memory.itemAliases.map((alias) => `${alias.invoiceName} -> ${alias.productName}`).join(" | ") : "No confirmed matches yet"}</p>
        <p>Supplier notes: ${memory.notes.length ? memory.notes.join(" | ") : "No notes yet"}</p>
        <div class="review-actions">
          <input class="memory-note-input" type="text" placeholder="Add supplier note" data-memory-note-input="${normalizeSupplierKey(memory.supplierName)}" />
          <button class="ghost-button" type="button" data-memory-note-save="${normalizeSupplierKey(memory.supplierName)}">Save note</button>
        </div>
      </div>
    `)
    .join("");

  refs.supplierMemoryList.querySelectorAll("[data-memory-note-save]").forEach((button) => {
    button.addEventListener("click", onSupplierNoteSave);
  });
}

async function syncLiveWeather() {
  refs.syncWeatherButton.disabled = true;
  refs.syncWeatherButton.textContent = "Syncing...";

  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-34.8392&longitude=138.4796&current=temperature_2m,wind_speed_10m,weather_code&timezone=Australia%2FAdelaide";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Weather fetch failed");
    }

    const data = await response.json();
    const current = data.current || {};
    const mappedMode = mapLiveWeatherMode(current.temperature_2m, current.wind_speed_10m, current.weather_code);
    appState.context.weatherMode = mappedMode;
    appState.context.liveWeatherSummary = `Live weather: ${describeLiveWeather(current.temperature_2m, current.wind_speed_10m, current.weather_code)}`;
    appState.context.liveWeatherMeta = `Fetched for Semaphore using coordinates near ${STORE_LOCATION} at ${formatSyncTime(new Date())}. Weather mode auto-set to ${weatherProfiles[mappedMode].label}.`;
    appState.context.lastWeatherSync = new Date().toISOString();
    refs.weatherModeSelect.value = mappedMode;
    persistState();
    render();
  } catch {
    appState.context.liveWeatherSummary = "Live weather sync failed";
    appState.context.liveWeatherMeta = "The static app could not fetch live weather just now. Manual weather selection is still available.";
    persistState();
    render();
  } finally {
    refs.syncWeatherButton.disabled = false;
    refs.syncWeatherButton.textContent = "Sync live weather";
  }
}

function onUploadInputChange(event) {
  queueUploadedFiles(Array.from(event.target.files || []));
  refs.documentUploadInput.value = "";
}

function onDropzoneDragOver(event) {
  event.preventDefault();
  refs.uploadDropzone.classList.add("dragover");
}

function onDropzoneDragLeave() {
  refs.uploadDropzone.classList.remove("dragover");
}

function onDropzoneDrop(event) {
  event.preventDefault();
  refs.uploadDropzone.classList.remove("dragover");
  queueUploadedFiles(Array.from(event.dataTransfer?.files || []));
}

function queueUploadedFiles(files) {
  if (!files.length) {
    return;
  }

  refs.uploadStatus.textContent = `Processing ${files.length} file${files.length === 1 ? "" : "s"}...`;
  Promise.all(files.map(parseUploadedFile)).then((reviews) => {
    appState.pendingReviews.unshift(...reviews.filter(Boolean));
    refs.uploadStatus.textContent = `${reviews.length} file${reviews.length === 1 ? "" : "s"} added to the review queue.`;
    persistState();
    render();
  });
}

async function parseUploadedFile(file) {
  const review = {
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    detectedSupplier: detectSupplierFromText(file.name),
    invoiceDate: detectInvoiceDate(file.name),
    lines: [],
    notesSummary: "Lightweight browser extraction only. Review all detected details before saving.",
    fileType: file.type || "unknown"
  };

  const text = await readFileAsTextMaybe(file);
  const sourceText = text || file.name;
  review.detectedSupplier = detectSupplierFromText(sourceText) || review.detectedSupplier || "Unknown";
  review.invoiceDate = detectInvoiceDate(sourceText) || review.invoiceDate || "";
  review.lines = extractInvoiceLines(sourceText).map((line, index) => ({
    id: `${review.id}-line-${index + 1}`,
    rawName: line.rawName,
    quantity: line.quantity,
    unit: line.unit,
    packSize: line.packSize,
    matchProductId: suggestProductMatchId(line.rawName)
  }));

  if (!review.lines.length) {
    review.lines = [{
      id: `${review.id}-line-1`,
      rawName: file.name.replace(/\.[^.]+$/, ""),
      quantity: "",
      unit: "",
      packSize: "",
      matchProductId: suggestProductMatchId(file.name)
    }];
    review.notesSummary = "No structured line items could be read in-browser. Use the suggested match fields to confirm anything worth learning.";
  }

  return review;
}

function onReviewMatchChange(event) {
  const [reviewId, lineId] = event.target.dataset.reviewLineMatch.split("|");
  const review = appState.pendingReviews.find((entry) => entry.id === reviewId);
  const line = review?.lines.find((entry) => entry.id === lineId);
  if (!line) {
    return;
  }
  line.matchProductId = event.target.value;
  persistState();
}

function onReviewAction(event) {
  const reviewId = event.target.dataset.reviewId;
  const action = event.target.dataset.reviewAction;
  const reviewIndex = appState.pendingReviews.findIndex((entry) => entry.id === reviewId);
  if (reviewIndex === -1) {
    return;
  }

  if (action === "ignore") {
    appState.pendingReviews.splice(reviewIndex, 1);
    persistState();
    render();
    return;
  }

  applyReviewToSupplierMemory(appState.pendingReviews[reviewIndex]);
  appState.pendingReviews.splice(reviewIndex, 1);
  persistState();
  render();
}

function applyReviewToSupplierMemory(review) {
  const supplierKey = normalizeSupplierKey(review.detectedSupplier);
  if (!appState.supplierMemory[supplierKey]) {
    appState.supplierMemory[supplierKey] = {
      supplierName: review.detectedSupplier || "Unknown supplier",
      units: [],
      packSizes: [],
      itemAliases: [],
      notes: []
    };
  }

  const memory = appState.supplierMemory[supplierKey];
  memory.supplierName = review.detectedSupplier || memory.supplierName;
  pushUnique(memory.notes, review.notesSummary);
  if (review.invoiceDate) {
    pushUnique(memory.notes, `Seen on invoice dated ${review.invoiceDate}`);
  }

  review.lines.forEach((line) => {
    if (line.unit) {
      pushUnique(memory.units, line.unit);
    }
    if (line.packSize) {
      pushUnique(memory.packSizes, line.packSize);
    }

    const product = getProductById(line.matchProductId);
    if (product) {
      const existing = memory.itemAliases.find((alias) => alias.invoiceName === line.rawName);
      if (existing) {
        existing.productId = product.id;
        existing.productName = product.name;
      } else {
        memory.itemAliases.push({
          invoiceName: line.rawName,
          productId: product.id,
          productName: product.name
        });
      }
    }
  });
}

function onSupplierNoteSave(event) {
  const supplierKey = event.target.dataset.memoryNoteSave;
  const input = refs.supplierMemoryList.querySelector(`[data-memory-note-input="${supplierKey}"]`);
  const note = input?.value.trim();
  if (!note) {
    return;
  }

  if (!appState.supplierMemory[supplierKey]) {
    appState.supplierMemory[supplierKey] = {
      supplierName: supplierKey,
      units: [],
      packSizes: [],
      itemAliases: [],
      notes: []
    };
  }

  pushUnique(appState.supplierMemory[supplierKey].notes, note);
  input.value = "";
  persistState();
  render();
}

function getSupplierPlan(category, today) {
  const schedule = scheduleLibrary[category.scheduleKey] ?? scheduleLibrary.weekdays;
  const todayHoliday = getHolidayByDate(today.isoDate);
  const availableToday = schedule.days.includes(today.dayIndex) && !todayHoliday;
  const nextDelivery = findNextValidDelivery(today.date, schedule.days);
  const coverDays = Math.max(1, diffDays(today.date, nextDelivery.date));
  const holidayWarning = nextDelivery.skippedHoliday
    ? `${nextDelivery.skippedHoliday.name} on ${formatShortDateString(nextDelivery.skippedHoliday.date)} pushes the next valid delivery to ${formatLongDate(nextDelivery.date)}.`
    : todayHoliday
      ? `${todayHoliday.name} falls today, so normal supplier timing should be treated as a risk.`
      : "";

  return {
    availableToday,
    nextDeliveryDate: nextDelivery.date,
    nextDeliveryLabel: `${nextDelivery.dayName}, ${formatShortDate(nextDelivery.date)}`,
    nextDeliveryShort: nextDelivery.shortLabel,
    coverDays,
    holidayWarning
  };
}

function findNextValidDelivery(fromDate, scheduleDays) {
  let cursor = addDays(fromDate, 1);
  let skippedHoliday = null;

  for (let offset = 1; offset <= 14; offset += 1) {
    const isoDate = toIsoDate(cursor);
    const holiday = getHolidayByDate(isoDate);
    const dayIndex = cursor.getDay();
    const isScheduledDay = scheduleDays.includes(dayIndex);

    if (holiday && isScheduledDay && !skippedHoliday) {
      skippedHoliday = holiday;
    }

    if (isScheduledDay && !holiday) {
      return {
        date: cursor,
        skippedHoliday,
        dayName: DAY_NAMES[dayIndex],
        shortLabel: `${shortDayName(cursor)} ${cursor.getDate()}`
      };
    }

    cursor = addDays(cursor, 1);
  }

  return {
    date: cursor,
    skippedHoliday,
    dayName: DAY_NAMES[cursor.getDay()],
    shortLabel: `${shortDayName(cursor)} ${cursor.getDate()}`
  };
}

function onContextChange() {
  appState.context.tradeExpectation = refs.tradeExpectationSelect.value;
  appState.context.weatherMode = refs.weatherModeSelect.value;
  appState.context.eventImpact = refs.eventImpactSelect.value;
  appState.context.eventName = refs.eventNameInput.value.trim();
  appState.context.contextNote = refs.contextNoteInput.value.trim();
  persistState();
  render();
}

function onCategoryMetaChange() {
  const category = getActiveCategory();
  if (!category) {
    return;
  }

  category.demandMode = refs.categoryDemandSelect.value;
  category.notes = refs.orderNotesInput.value.trim();
  persistState();
  render();
}

function sendActiveSupplierToOrderList() {
  const category = getActiveCategory();
  if (!category) {
    return;
  }

  const today = getTodayInfo();
  const plan = getSupplierPlan(category, today);
  const lines = category.items
    .map((item) => ({ item, calc: calculateRecommendation(item, category, plan, appState.context) }))
    .filter(({ calc }) => calc.suggestedOrder > 0)
    .map(({ item, calc }) => ({
      name: getSupplierOrderLabel(category.supplier, item),
      quantity: calc.suggestedOrder,
      unit: getOrderedUnit(item),
      capped: Boolean(calc.capReason)
    }));

  if (!lines.length) {
    delete appState.todayOrderList[category.id];
    persistState();
    render();
    return;
  }

  appState.todayOrderList[category.id] = {
    supplier: category.supplier,
    createdAt: new Date().toISOString(),
    lines
  };
  setOrderChecklistDone(getTodayInfo().isoDate, category.id, true);
  persistState();
  render();
}

function sendActiveSupplierToWeeklyList() {
  const category = getActiveCategory();
  if (!category) {
    return;
  }

  const today = getTodayInfo();
  const plan = getSupplierPlan(category, today);
  const lines = category.items
    .map((item) => ({ item, calc: calculateRecommendation(item, category, plan, appState.context) }))
    .filter(({ calc }) => calc.suggestedOrder > 0)
    .map(({ item, calc }) => ({
      name: getSupplierOrderLabel(category.supplier, item),
      quantity: calc.suggestedOrder,
      unit: getOrderedUnit(item),
      capped: Boolean(calc.capReason)
    }));

  if (!lines.length) {
    delete appState.weeklyReminderList[category.id];
    persistState();
    render();
    return;
  }

  appState.weeklyReminderList[category.id] = {
    supplier: category.supplier,
    createdAt: new Date().toISOString(),
    lines
  };
  persistState();
  render();
}

function clearActiveSupplier() {
  const category = getActiveCategory();
  if (!category) {
    return;
  }

  category.items.forEach((item) => {
    item.currentStock = 0;
    item.notRequiredTomorrow = false;
  });
  delete appState.todayOrderList[category.id];
  delete appState.weeklyReminderList[category.id];
  setOrderChecklistDone(getTodayInfo().isoDate, category.id, false);
  persistState();
  render();
}

function onManagerContactChange() {
  appState.managerContact.phone = refs.managerPhoneInput.value.trim();
  appState.managerContact.email = refs.managerEmailInput.value.trim();
  appState.managerContact.smsWebhookUrl = refs.smsWebhookInput.value.trim();
  appState.managerContact.emailWebhookUrl = refs.emailWebhookInput.value.trim();
  persistState();
}

async function textManager() {
  const body = buildManagerOrderMessage();
  const phone = appState.managerContact.phone.replace(/\s+/g, "");
  if (!phone) {
    window.alert("Add the manager mobile number first.");
    return;
  }

  if (appState.managerContact.smsWebhookUrl) {
    const result = await sendViaWebhook(appState.managerContact.smsWebhookUrl, {
      channel: "sms",
      phone,
      message: body,
      orderList: getSanitizedTodayOrderEntries()
    });
    window.alert(result);
    return;
  }

  const smsUrl = `sms:${encodeURIComponent(phone)}?body=${encodeURIComponent(body)}`;
  window.location.href = smsUrl;
}

async function emailManager() {
  const body = buildManagerOrderMessage();
  const email = appState.managerContact.email.trim();
  if (!email) {
    window.alert("Add the manager email first.");
    return;
  }

  const subject = `Barry's Burgers checked list for ${formatShortDate(getTodayInfo().date)}`;
  if (appState.managerContact.emailWebhookUrl) {
    const result = await sendViaWebhook(appState.managerContact.emailWebhookUrl, {
      channel: "email",
      email,
      subject,
      message: body,
      orderList: getSanitizedTodayOrderEntries()
    });
    window.alert(result);
    return;
  }

  const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}

function buildManagerOrderMessage() {
  const today = getTodayInfo();
  const entries = getSanitizedTodayOrderEntries();
  if (!entries.length) {
    return `Today's Checked List\n${formatLongDate(today.date)}\n\nNo supplier checks added yet.`;
  }

  const lines = [
    "Today's Checked List",
    formatLongDate(today.date),
    ""
  ];

  entries.forEach((group) => {
    lines.push(group.supplier);
    if (group.checkedAtLabel) {
      lines.push(group.checkedAtLabel);
    }
    group.lines.forEach((line) => {
      lines.push(
        line.notRequiredTomorrow
          ? `${line.name} - Not required for tomorrow`
          : `${line.name} - ${line.quantity} ${line.unit}`
      );
    });
    lines.push("");
  });

  return lines.join("\n").trim();
}

async function sendViaWebhook(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return "One-tap send failed. Check the webhook URL or service response.";
    }

    return "Sent to manager.";
  } catch {
    return "One-tap send failed. Check browser network access and webhook setup.";
  }
}

function sanitizeTodayOrderList() {
  const before = JSON.stringify(appState.todayOrderList || {});
  const sanitized = {};
  Object.entries(appState.todayOrderList || {}).forEach(([key, group]) => {
    const lines = Array.isArray(group?.lines)
      ? group.lines.filter((line) => Number.isFinite(Number(line.quantity)) && Number(line.quantity) >= 0 && line.name && line.unit)
      : [];
    if (lines.length) {
      sanitized[key] = {
        ...group,
        lines
      };
    }
  });
  appState.todayOrderList = sanitized;
  if (JSON.stringify(sanitized) !== before) {
    persistState();
  }
}

function getSanitizedTodayOrderEntries() {
  sanitizeTodayOrderList();
  return Object.values(appState.todayOrderList || {}).filter((group) => Array.isArray(group.lines) && group.lines.length);
}

function sanitizeWeeklyReminderList() {
  const before = JSON.stringify(appState.weeklyReminderList || {});
  const sanitized = {};
  Object.entries(appState.weeklyReminderList || {}).forEach(([key, group]) => {
    const lines = Array.isArray(group?.lines)
      ? group.lines.filter((line) => Number.isFinite(Number(line.quantity)) && Number(line.quantity) > 0 && line.name && line.unit)
      : [];
    if (lines.length) {
      sanitized[key] = {
        ...group,
        lines
      };
    }
  });
  appState.weeklyReminderList = sanitized;
  if (JSON.stringify(sanitized) !== before) {
    persistState();
  }
}

function getWeeklyChecklistItems(today) {
  return defaultWeeklyChecklist.map((item) => ({
    ...item,
    isToday: item.dayIndex === today.dayIndex,
    completed: Boolean(appState.weeklyChecklistCompletions[`${today.isoDate}:${item.id}`]),
    overdue: item.dayIndex === today.dayIndex && getCurrentAdelaideHour() >= 21 && !appState.weeklyChecklistCompletions[`${today.isoDate}:${item.id}`],
    status: item.dayIndex !== today.dayIndex
      ? `Due ${DAY_NAMES[item.dayIndex]}`
      : appState.weeklyChecklistCompletions[`${today.isoDate}:${item.id}`]
        ? "Done"
        : getCurrentAdelaideHour() >= 21
          ? "Overdue tonight"
          : "Due today"
  }));
}

function getTodayOrderChecklist(today) {
  const scheduledIds = dailyOrderSchedule[today.dayIndex] || [];
  if (!scheduledIds.length) {
    return { closed: true, entries: [] };
  }

  const completionMap = appState.dailyOrderChecklist?.[today.isoDate] || {};
  const entries = scheduledIds
    .map((id) => appState.categories.find((category) => category.id === id))
    .filter(Boolean)
    .map((category) => ({
      category,
      status: getOrderChecklistStatus(today.isoDate, category, completionMap[category.id])
    }))
    .sort((left, right) => checklistStatusRank(left.status) - checklistStatusRank(right.status));

  return { closed: false, entries };
}

function getOrderChecklistStatus(isoDate, category, isDone) {
  if (isDone) {
    return "done";
  }
  const hasStarted = category.items.some((item) => Number(item.currentStock) > 0);
  return hasStarted ? "in-progress" : "not-started";
}

function checklistStatusRank(status) {
  const order = {
    "not-started": 0,
    "in-progress": 1,
    done: 2
  };
  return order[status] ?? 99;
}

function getChecklistStatusLabel(status) {
  if (status === "done") return "Done";
  if (status === "in-progress") return "In progress";
  return "Not started";
}

function setOrderChecklistDone(isoDate, categoryId, value) {
  if (!appState.dailyOrderChecklist[isoDate]) {
    appState.dailyOrderChecklist[isoDate] = {};
  }

  if (value) {
    appState.dailyOrderChecklist[isoDate][categoryId] = true;
    return;
  }

  delete appState.dailyOrderChecklist[isoDate][categoryId];
}

function resetState() {
  if (!window.confirm("Reset all counts, live weather status, and supplier memory back to the sample Barry's Burgers data?")) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  Object.assign(appState, structuredClone({
    context: defaultContext,
    categories: categorySeeds,
    pendingReviews: [],
    supplierMemory: defaultSupplierMemory,
    todayOrderList: {},
    weeklyReminderList: {},
    managerContact: defaultManagerContact,
    dailyOrderChecklist: {},
    weeklyChecklistCompletions: {},
    checklistPopupDismissed: {},
    lastCycleDate: getTodayInfo().isoDate
  }));
  activeCategoryId = null;
  persistState();
  render();
}

function applyDailyRolloverIfNeeded() {
  const today = getTodayInfo();
  if (appState.lastCycleDate === today.isoDate) {
    return;
  }

  appState.categories.forEach((category, categoryIndex) => {
    category.demandMode = categorySeeds[categoryIndex]?.demandMode ?? "steady";
    category.notes = "";
    category.items.forEach((item) => {
      item.currentStock = 0;
    });
  });

  appState.context = {
    ...defaultContext,
    contextNote: `New day started. Stock counts reset for ${today.dayName}, ${today.day} ${today.monthName} ${today.year}.`
  };
  appState.todayOrderList = {};
  appState.weeklyReminderList = {};
  appState.weeklyChecklistCompletions = {};
  appState.checklistPopupDismissed = {};
  appState.dailyOrderChecklist = {};
  appState.lastCycleDate = today.isoDate;
  activeCategoryId = null;
  persistState();
}

function getActiveCategory() {
  return appState.categories.find((category) => category.id === activeCategoryId) ?? null;
}

function resolveTagMultiplier(tags, ruleSet) {
  return (tags || []).reduce((multiplier, tag) => {
    return tag in ruleSet ? multiplier * ruleSet[tag] : multiplier;
  }, 1);
}

function buildWeatherExplanation(weatherMode, category) {
  if (weatherMode === "hot") {
    return `Hot weather slightly lifts chips, desserts, packaging, and fresh lines where relevant in ${category.name}.`;
  }
  if (weatherMode === "cold") {
    return `Cold, wet, or windy weather slightly softens weather-sensitive dessert and fresh lines in ${category.name}.`;
  }
  return "Severe weather is flagged as a caution signal rather than a hard stock cut.";
}

function buildEventExplanation(context, category) {
  return `${context.eventName || "Semaphore / PAE event"} is marked as ${eventProfiles[context.eventImpact].label.toLowerCase()}, so event-sensitive lines in ${category.name} get a modest uplift.`;
}

function eventSummaryLine(context) {
  if (context.eventImpact === "none") {
    return "No known event";
  }
  return `${context.eventName || "Semaphore / PAE event"} (${eventProfiles[context.eventImpact].label})`;
}

function labelForTradeExpectation(value) {
  if (value === "quiet") return "Quiet";
  if (value === "busy") return "Busy";
  if (value === "very-busy") return "Very busy";
  return "Normal";
}

function labelForCategoryDemand(value) {
  if (value === "quiet") return "Quiet lean";
  if (value === "busy") return "Busy lean";
  return "Steady lean";
}

function toPercent(decimal) {
  const value = Math.round(decimal * 100);
  if (value === 0) return "0%";
  return `${value > 0 ? "+" : ""}${value}%`;
}

function buildDefaultSupplierMemory() {
  return categorySeeds.reduce((memoryMap, category) => {
    const supplierKey = normalizeSupplierKey(category.supplier);
    memoryMap[supplierKey] = {
      supplierName: category.supplier,
      units: category.items.map((item) => getOrderedUnit(item)).filter((value, index, array) => array.indexOf(value) === index),
      packSizes: category.items.map((item) => getOrderedUnit(item)).filter((value, index, array) => array.indexOf(value) === index),
      itemAliases: category.items.map((item) => ({
        invoiceName: item.name,
        productId: item.id,
        productName: item.name
      })),
      notes: [`Starter product list built from Barry's current ${category.supplier} stock setup.`]
    };

    if (supplierKey === "saint-meat") {
      memoryMap[supplierKey].itemAliases = [
        { invoiceName: "Beef Patties", productId: "beef-patties", productName: "Beef Patties" },
        { invoiceName: "Beef Balls", productId: "beef-balls", productName: "Beef Balls" },
        { invoiceName: "Chicken", productId: "chicken", productName: "Chicken" },
        { invoiceName: "Bacon", productId: "bacon", productName: "Bacon" },
        { invoiceName: "Pork", productId: "pork", productName: "Pork" }
      ];
      memoryMap[supplierKey].notes = [
        "Example Barry order email: 2 X Pork, 2 X Beef Balls, 4 X Chicken, 3 X Beef Patties, 3KG Bacon.",
        "Barry's ordering language may differ from invoice wording; confirm Saint Meat invoice names before hard-mapping supplier terms.",
        "Chicken unit is still unresolved: the current stock model says kg, but the example order writes 4 X Chicken."
      ];
    }

    if (supplierKey === "galipo") {
      memoryMap[supplierKey].notes.push(
        "Recognised supplier document: galipo.pdf.",
        "File looks like a Galipo order confirmation, but line-item text was not readable enough to hard-map invoice wording yet."
      );
    }

    if (supplierKey === "fruit-veg") {
      memoryMap[supplierKey].notes.push(
        "Recognised likely produce supplier documents: AMJ.pdf and T&M.pdf.",
        "Both files appear to be Fresho-generated produce documents, so this supplier list is a reasonable starting point for Fruit & Veg."
      );
    }

    if (supplierKey === "bidfood") {
      memoryMap[supplierKey].notes.push(
        "Customer-order PDFs are present in Downloads, but exact supplier mapping still needs clearer invoice text before hard-linking them to Bidfood."
      );
    }

    return memoryMap;
  }, {});
}

function mergeSupplierMemory(savedMemory) {
  const merged = structuredClone(defaultSupplierMemory);
  Object.entries(savedMemory || {}).forEach(([key, value]) => {
    merged[key] = {
      supplierName: value?.supplierName || merged[key]?.supplierName || key,
      units: Array.isArray(value?.units) ? value.units : [],
      packSizes: Array.isArray(value?.packSizes) ? value.packSizes : [],
      itemAliases: Array.isArray(value?.itemAliases) ? value.itemAliases : [],
      notes: Array.isArray(value?.notes) ? value.notes : []
    };
  });
  return merged;
}

function normalizeSupplierKey(value) {
  return (value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getSupplierOrderLabel(supplierName, item) {
  const memory = appState.supplierMemory[normalizeSupplierKey(supplierName)];
  const alias = memory?.itemAliases.find((entry) => entry.productId === item.id);
  return alias?.invoiceName || item.name;
}

function getOrderedUnit(item) {
  return item.orderedIn || item.packSize || "units";
}

function getCountedUnit(item) {
  return item.countedIn || item.packSize || "units";
}

function getStorageSummary(item) {
  return item.totalStorageMax || `Storage max ${item.hardMax} ${getCountedUnit(item)}`;
}

function getStorageConstraintLabel(item, limit) {
  if (item.maxPreppedStock && item.countedIn) {
    return `max ${limit} ${item.countedIn}`;
  }
  if (item.maxOrderedStock && item.orderedIn === item.countedIn) {
    return `max ${limit} ${item.orderedIn}`;
  }
  if (item.maxOrderedStock && item.orderedIn && item.countedIn !== item.orderedIn) {
    return `${item.maxOrderedStock} ${item.orderedIn} raw / ${limit} ${item.countedIn}`;
  }
  return `max ${limit} ${getCountedUnit(item)}`;
}

function getCapacityLabel(item, limit) {
  const countedUnit = getCountedUnit(item);
  if (item.maxPreppedStock && item.countedIn) {
    return `Out of ${limit} ${countedUnit}`;
  }
  if (item.maxOrderedStock && item.orderedIn === item.countedIn) {
    return `Out of ${limit} ${countedUnit}`;
  }
  if (item.maxOrderedStock && item.orderedIn && item.countedIn !== item.orderedIn) {
    return `Out of ${limit} ${countedUnit}`;
  }
  return `Out of ${limit} ${countedUnit}`;
}

function getSupplierMark(category) {
  const marks = {
    meat: "SM",
    fv: "FV",
    galipo: "GA",
    bidfood: "BI",
    desserts: "DE",
    packaging: "PK"
  };
  return marks[category.id] || category.name.slice(0, 2).toUpperCase();
}

function getSupplierAccent(category) {
  const accents = {
    meat: "Meat and prep",
    fv: "Fresh produce",
    galipo: "Pantry and sauces",
    bidfood: "Frozen support",
    desserts: "Shakes and sweets",
    packaging: "Serviceware"
  };
  return accents[category.id] || category.accent || "";
}

function buildProductOptions(selectedValue) {
  return categorySeeds
    .flatMap((category) => category.items)
    .map((item) => `<option value="${item.id}" ${selectedValue === item.id ? "selected" : ""}>${item.name}</option>`)
    .join("");
}

function getProductById(productId) {
  return categorySeeds.flatMap((category) => category.items).find((item) => item.id === productId) ?? null;
}

function suggestProductMatchId(rawName) {
  const normalized = normalizeText(rawName);
  let bestMatch = null;
  let bestScore = 0;

  categorySeeds.flatMap((category) => category.items).forEach((item) => {
    const itemName = normalizeText(item.name);
    const score = scoreTextSimilarity(normalized, itemName);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item.id;
    }
  });

  return bestScore >= 0.32 ? bestMatch : "";
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreTextSimilarity(a, b) {
  const aWords = new Set(a.split(" ").filter(Boolean));
  const bWords = new Set(b.split(" ").filter(Boolean));
  if (!aWords.size || !bWords.size) {
    return 0;
  }
  const overlap = [...aWords].filter((word) => bWords.has(word)).length;
  return overlap / Math.max(aWords.size, bWords.size);
}

function detectSupplierFromText(text) {
  const normalized = normalizeText(text);
  return categorySeeds.find((category) => normalized.includes(normalizeText(category.supplier)))?.supplier ?? "";
}

function detectInvoiceDate(text) {
  const match = String(text).match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b|\b(\d{1,2})[-/](\d{1,2})[-/](20\d{2})\b/);
  return match ? match[0] : "";
}

function extractInvoiceLines(text) {
  return String(text)
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map((line) => {
      const quantityMatch = line.match(/\b\d+(\.\d+)?\b/);
      const packMatch = line.match(/\b(box|carton|crate|tray|bag|sleeve|tub|pack|kg|ct)\b/i);
      return {
        rawName: line.replace(/\b\d+(\.\d+)?\b/g, "").trim() || line,
        quantity: quantityMatch ? quantityMatch[0] : "",
        unit: packMatch ? packMatch[0].toLowerCase() : "",
        packSize: packMatch ? packMatch[0].toLowerCase() : ""
      };
    });
}

function readFileAsTextMaybe(file) {
  return new Promise((resolve) => {
    if (file.type.startsWith("text/") || /\.(txt|csv|json)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve("");
      reader.readAsText(file);
      return;
    }

    resolve("");
  });
}

function pushUnique(collection, value) {
  if (value && !collection.includes(value)) {
    collection.push(value);
  }
}

function mapLiveWeatherMode(temperature, windSpeed, weatherCode) {
  if ((windSpeed ?? 0) >= 45 || [95, 96, 99].includes(weatherCode)) {
    return "severe";
  }
  if ((temperature ?? 0) >= 27) {
    return "hot";
  }
  if ((temperature ?? 99) <= 15 || [61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    return "cold";
  }
  return "neutral";
}

function describeLiveWeather(temperature, windSpeed, weatherCode) {
  const parts = [];
  if (typeof temperature === "number") {
    parts.push(`${Math.round(temperature)}C`);
  }
  if (typeof windSpeed === "number") {
    parts.push(`${Math.round(windSpeed)} km/h wind`);
  }
  if (typeof weatherCode === "number") {
    parts.push(`code ${weatherCode}`);
  }
  return parts.join(" | ") || "Current conditions received";
}

function formatSyncTime(date) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ADELAIDE_TIMEZONE
  }).format(date);
}

function getTodayInfo() {
  const today = new Date();
  return {
    date: atNoon(today),
    isoDate: toIsoDate(today),
    dayIndex: today.getDay(),
    dayName: DAY_NAMES[today.getDay()],
    shortDay: shortDayName(today),
    day: today.getDate(),
    monthName: new Intl.DateTimeFormat("en-AU", { month: "long", timeZone: ADELAIDE_TIMEZONE }).format(today),
    shortMonth: new Intl.DateTimeFormat("en-AU", { month: "short", timeZone: ADELAIDE_TIMEZONE }).format(today),
    year: today.getFullYear()
  };
}

function getCurrentAdelaideHour() {
  const parts = new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    hour12: false,
    timeZone: ADELAIDE_TIMEZONE
  }).formatToParts(new Date());
  const hourPart = parts.find((part) => part.type === "hour");
  return Number.parseInt(hourPart?.value || "0", 10);
}

function updateHeaderClock() {
  const today = getTodayInfo();
  refs.todayLabel.textContent = `${today.dayName}, ${today.day} ${today.monthName} ${today.year}`;
  refs.currentTimeLabel.textContent = new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ADELAIDE_TIMEZONE
  }).format(new Date());
}

function getHolidayByDate(isoDate) {
  return southAustraliaHolidays2026.find((holiday) => holiday.date === isoDate) ?? null;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: ADELAIDE_TIMEZONE
  }).format(date);
}

function formatShortDateString(isoDate) {
  return formatShortDate(new Date(`${isoDate}T12:00:00`));
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ADELAIDE_TIMEZONE
  }).format(date);
}

function shortDayName(date) {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    timeZone: ADELAIDE_TIMEZONE
  }).format(date);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return atNoon(next);
}

function diffDays(fromDate, toDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((atNoon(toDate) - atNoon(fromDate)) / millisecondsPerDay);
}

function atNoon(date) {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

function loadState() {
  const fallback = getDefaultAppState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.categories)) {
      return fallback;
    }

    return hydrateParsedState(parsed);
  } catch {
    return fallback;
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  queueSupabaseSave();
}

function getDefaultAppState() {
  return structuredClone({
    context: defaultContext,
    categories: categorySeeds,
    pendingReviews: [],
    supplierMemory: defaultSupplierMemory,
    todayOrderList: {},
    weeklyReminderList: {},
    managerContact: defaultManagerContact,
    dailyOrderChecklist: {},
    weeklyChecklistCompletions: {},
    checklistPopupDismissed: {},
    lastCycleDate: getTodayInfo().isoDate
  });
}

function hydrateParsedState(parsed) {
  const fallback = getDefaultAppState();
  const savedCategoriesById = new Map(
    Array.isArray(parsed.categories)
      ? parsed.categories
          .filter((category) => category && category.id)
          .map((category) => [category.id, category])
      : []
  );

  return {
    context: { ...defaultContext, ...(parsed.context || {}) },
    categories: categorySeeds.map((seed) => {
      const saved = savedCategoriesById.get(seed.id) || {};
      const savedItemsById = new Map(
        Array.isArray(saved.items)
          ? saved.items
              .filter((item) => item && item.id)
              .map((item) => [item.id, item])
          : []
      );

      return {
        ...structuredClone(seed),
        ...saved,
        items: seed.items.map((seedItem) => ({
          ...structuredClone(seedItem),
          ...(savedItemsById.get(seedItem.id) || {})
        }))
      };
    }),
    pendingReviews: Array.isArray(parsed.pendingReviews) ? parsed.pendingReviews : [],
    supplierMemory: mergeSupplierMemory(parsed.supplierMemory),
    todayOrderList: parsed.todayOrderList && typeof parsed.todayOrderList === "object" ? parsed.todayOrderList : {},
    weeklyReminderList: parsed.weeklyReminderList && typeof parsed.weeklyReminderList === "object" ? parsed.weeklyReminderList : {},
    managerContact: { ...defaultManagerContact, ...(parsed.managerContact || {}) },
    dailyOrderChecklist: parsed.dailyOrderChecklist && typeof parsed.dailyOrderChecklist === "object" ? parsed.dailyOrderChecklist : {},
    weeklyChecklistCompletions: parsed.weeklyChecklistCompletions && typeof parsed.weeklyChecklistCompletions === "object" ? parsed.weeklyChecklistCompletions : {},
    checklistPopupDismissed: parsed.checklistPopupDismissed && typeof parsed.checklistPopupDismissed === "object" ? parsed.checklistPopupDismissed : {},
    lastCycleDate: parsed.lastCycleDate || fallback.lastCycleDate
  };
}
