// The source of truth for UI strings: rw.ts must match this shape.
// Longer prose with links or emphasis (FAQ, terms, privacy, install steps)
// lives next to its page as per-language JSX instead.

const items = (n: number) => `${n} ${n === 1 ? "item" : "items"}`;

export const en = {
  meta: {
    title: "Bukiaa — Women's fashion boutique",
    description:
      "Dresses, matching sets, jeans and boubous from Bukiaa. Browse the whole catalog, then order on WhatsApp. Pay with MoMo or cash.",
    ogLocale: "en_RW",
  },
  common: {
    home: "Home",
    shop: "Shop",
    shopAll: "Shop all",
    favorites: "Favorites",
    contact: "Contact",
    howToOrder: "How to order / FAQ",
    close: "Close",
    back: "Back",
    tryAgain: "Try again",
    loading: "Loading…",
    items,
    soldOut: "Sold out",
    sale: "Sale",
    size: "Size",
    colour: "Colour",
    fit: "Fit",
    material: "Material",
    orderOnWhatsApp: "Order on WhatsApp",
    payAndDelivery:
      "Pay with MoMo or cash on delivery · Motard delivery or pickup at CHIC Building B30A",
    signIn: "Sign in",
    register: "Register",
    logOut: "Log out",
    account: "Account",
    thisItem: "this item",
  },
  language: {
    label: "Language",
  },
  topBar: {
    pickupShort: "Pickup at CHIC B30A",
    pickupLong: "Pickup at CHIC Building B30A · Motard delivery across Kigali",
    call: (phone: string) => `Call ${phone}`,
    onSocial: (network: string) => `Bukiaa on ${network}`,
  },
  nav: {
    site: "Site",
    main: "Main",
    homeLink: "Bukiaa home",
    openMenu: "Open menu",
    accountMenu: "Account menu",
    signInOrRegister: "Sign in or register",
    signInRegister: "Sign In / Register",
  },
  /** The mobile tab bar: labels must stay short. */
  tabs: {
    label: "Quick links",
    home: "Home",
    categories: "Categories",
    search: "Search",
    favorites: "Favorites",
    menu: "Menu",
  },
  browse: {
    title: "Categories",
    seeAll: (name: string) => `See all ${name}`,
    backTo: "All categories",
    moreIn: (name: string) => `Show the types of ${name}`,
    shopByCategory: "Shop by category",
    orBrowse: "Or pick a category",
  },
  authSheet: {
    title: "Save your favorites",
    description: "Create an account to save favorites across devices.",
  },
  search: {
    placeholder: "Search items, codes (BQ-0142), occasions…",
    label: "Search products",
  },
  footer: {
    tagline:
      "Women's fashion in Kigali: dresses, matching sets, jeans and boubous. Browse here, order on WhatsApp.",
    getTheApp: "Get the Bukiaa app",
    shop: "Shop",
    newArrivals: "New arrivals",
    promos: "Promos",
    occasions: "Occasions",
    help: "Help",
    legal: "Legal",
    terms: "Terms",
    privacy: "Privacy",
    call: "Call",
    email: "Email",
    visit: "Visit",
    bottomLine: "Kigali, Rwanda · Pay with MoMo · Cash",
  },
  home: {
    heading: "Bukiaa — women's fashion boutique",
    howItWorks: "How ordering works",
    step: (n: number) => `Step ${n}`,
    steps: [
      { title: "Browse", text: "Find a look you love." },
      {
        title: "Pick size & colour",
        text: "See what's available right away.",
      },
      {
        title: "Order on WhatsApp",
        text: "One tap sends us the exact item.",
      },
      {
        title: "Pay & receive",
        text: "MoMo or cash on delivery, or pick up at CHIC Building B30A.",
      },
    ],
    delivery:
      "Delivery by motard across Kigali, arranged with you on WhatsApp.",
    moreQuestions: "Got more questions?",
    visitFaq: "Visit our FAQ",
  },
  listing: {
    emptyTitle: "Nothing matches these filters",
    emptyText: "Try removing a filter or two to see more styles.",
    clearFilters: "Clear filters",
    loadingProducts: "Loading products…",
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    loadMoreFailed: "Couldn't load more items. Please try again.",
    loadMore: "Load more",
  },
  filters: {
    filters: "Filters",
    filter: "Filter",
    clearAll: "Clear all",
    clear: "Clear",
    updating: "Updating…",
    show: (n: number) => `Show ${items(n)}`,
    category: "Category",
    occasion: "Occasion",
    price: "Price",
    min: "Min (RWF)",
    max: "Max (RWF)",
    apply: "Apply",
    onSale: "On sale",
    inStock: "In stock only",
  },
  sort: {
    label: "Sort by",
    newest: "Newest",
    price_asc: "Price: low to high",
    price_desc: "Price: high to low",
  },
  price: {
    sale: "Sale price ",
    original: "Original price ",
  },
  card: {
    viewItem: (colours: string) =>
      colours ? `View item in ${colours}` : "View item",
    colours: (list: string) => `Colours: ${list}`,
  },
  product: {
    detailsFallback: "Product details",
    colourCount: (n: number) => `${n} colours`,
    sizeList: (list: string) => `Sizes ${list}`,
    occasions: "Occasions",
    related: "You may also like",
    unavailable: (option: string) => `${option} (unavailable)`,
    selectSize: "Select a size",
    selectColour: "Select a colour",
    askIfComingBack: "Ask if it's coming back",
    share: "Share this item",
    linkCopied: "Link copied",
    copyFailed: "Couldn't copy the link",
    saveFavorite: (name: string) => `Save ${name} to favorites`,
    removeFavorite: (name: string) => `Remove ${name} from favorites`,
  },
  gallery: {
    photos: "Photos",
    photosOf: (name: string) => `${name} photos`,
    photoAlt: (name: string, n: number) => `${name}, photo ${n}`,
    photo: (n: number) => `Photo ${n}`,
    showPhoto: (n: number) => `Show photo ${n}`,
    viewPhoto: (n: number) => `View photo ${n} full screen`,
    viewAll: "View photos full screen",
    closePhotos: "Close photos",
  },
  order: {
    whichColour: "Which colour would you like?",
    whichSize: "Which size do you wear?",
    review: "Check your order",
    stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
    soldOutInSize: (size: string) => `Sold out in size ${size}`,
    fit: "Fit: ",
    notSure: "Not sure? Pick the closest — we'll help you confirm on WhatsApp.",
    opensWhatsApp:
      "This opens WhatsApp with your order written for you. Just press send.",
    soldOutNow:
      "This one is sold out right now. Ask us if it's coming back, or go back and pick another option.",
    change: "Change",
  },
  askUs: {
    aboutLabel: (name: string) => `Ask us about ${name} on WhatsApp`,
    generalLabel: "Ask us a question on WhatsApp",
    aboutThis: "Ask about this",
    askUs: "Ask us",
  },
  /** Prefilled WhatsApp questions (orders use the admin's templates). */
  inquiry: {
    general: "Hi Bukiaa! I have a question.",
    about: (item: string, url: string) =>
      `Hi Bukiaa! I have a question about ${item}. ${url}`,
    size: (size: string) => `size ${size}`,
    colour: (colour: string) => `colour ${colour}`,
  },
  favorites: {
    loading: "Loading favorites…",
    emptyTitle: "No favorites yet",
    emptyText: "Tap ♥ on anything you like and it will be saved here.",
    startShopping: "Start shopping",
    saveFailed: "Couldn't save this favorite",
    removeFailed: "Couldn't remove this favorite",
  },
  auth: {
    email: "Email",
    password: "Password",
    invalidEmail: "Invalid email address",
    passwordMin: "Password must be at least 6 characters",
    somethingWrong: "Something went wrong. Please try again.",
  },
  login: {
    subtitle: "Sign in to see your favorites",
    invalidCredentials: "Invalid credentials",
    signedIn: "Signed in",
    signedInSaved: "Signed in — saved to favorites",
    signingIn: "Signing in…",
    noAccount: "Don't have an account?",
  },
  register: {
    subtitle: "Create an account to save favorites across devices",
    preferredName: "Preferred Name",
    optional: "(optional)",
    confirmPassword: "Confirm Password",
    confirmRequired: "Confirm password is required",
    mismatch: "Passwords do not match",
    failed: "Registration failed",
    created: "Account created. Please sign in.",
    welcome: "Welcome to Bukiaa!",
    welcomeSaved: "Welcome! Saved to your favorites",
    networkError: "Network error. Please try again.",
    creating: "Creating account…",
    haveAccount: "Already have an account?",
  },
  pwa: {
    getTheApp: "Get the Bukiaa app",
    installTheApp: "Install the app",
    bannerLabel: "Install the Bukiaa app",
    bannerText: "Faster browsing, and your viewed pieces work offline.",
    install: "Install",
    notNow: "Not now",
    installedTitle: "Bukiaa is on your home screen",
    installedText: "Open it from there any time.",
    updateReady: "A new version of Bukiaa is ready",
    refresh: "Refresh",
    offlineTitle: "You're offline",
    offlineText: "Pages you've already opened still work.",
    backOnline: "Back online",
    iosHelp:
      "Add Bukiaa to your home screen. It opens full screen, loads faster and keeps the pieces you've viewed for when you're offline.",
    inAppHelp:
      "This app's built-in browser can't install apps. Open Bukiaa in your phone's browser first.",
    gotIt: "Got it",
  },
  install: {
    metaTitle: "Get the app",
    metaDescription:
      "Install Bukiaa on your phone: it opens full screen, loads faster and keeps the pieces you've viewed for when you're offline.",
    ogDescription: "Add Bukiaa to your home screen in one tap.",
    text: "It opens full screen from your home screen, loads faster and keeps the pieces you've viewed for when you're offline. Free, and no app store needed.",
    browse: "Browse the shop",
    alreadyInApp: "You're already using the app.",
    installBukiaa: "Install Bukiaa",
    oneMoment: "One moment…",
  },
  offline: {
    text: "This page isn't saved on your phone yet. Check your connection and try again. It reloads by itself once you're back online.",
    saved: "Saved on this device",
    category: "Category",
    collection: "Collection",
    occasion: "Occasion",
  },
  error: {
    title: "We couldn't load this page",
    text: "Our shop is waking up — this can take a few seconds. Please try again.",
  },
  notFound: {
    title: "This item isn't available anymore",
    text: "It may have been removed from the shop. Have a look at what's new.",
  },
  shop: {
    description:
      "Browse every dress, matching set, jeans and more at Bukiaa. Order on WhatsApp.",
    search: "Search",
    searchTitle: (q: string) => `Search: ${q}`,
    resultsFor: (q: string) => `Results for “${q}”`,
  },
  category: {
    description: (name: string) =>
      `Shop ${name.toLowerCase()} at Bukiaa. See sizes, colours and prices, then order on WhatsApp.`,
    subcategories: "Subcategories",
    all: "All",
  },
  collection: {
    description: (name: string) => `${name} at Bukiaa.`,
    empty: "Nothing here yet — check back soon.",
  },
  occasions: {
    title: "Shop by occasion",
    description:
      "Wedding guest, church, office, party: find the right outfit for the occasion at Bukiaa.",
    crumb: "Occasions",
    pageTitle: (name: string) => `${name} outfits`,
    pageDescription: (name: string) =>
      `${name} looks at Bukiaa: dresses and sets for the occasion. Order on WhatsApp.`,
  },
  productPage: {
    fallbackTitle: "Product",
  },
  contact: {
    description:
      "Chat with Bukiaa on WhatsApp, call us, or visit us at CHIC Building B30A, Kigali.",
    intro:
      "The fastest way to reach us is WhatsApp — that's also where every order happens.",
    chat: "Chat with us",
    phone: "Phone",
    call: "Call",
    email: "Email",
    sendEmail: "Send an email",
    visit: "Visit / pickup",
    openMaps: "Open in Maps",
  },
  faq: {
    title: "How to order & FAQ",
    description:
      "How ordering on WhatsApp works at Bukiaa: payment with MoMo or cash, motard delivery or pickup at CHIC Building B30A, exchanges and sizing.",
    crumb: "FAQ",
    stillQuestion: "Still have a question?",
    contactUs: "Contact us",
  },
  legal: {
    terms: "Terms of use",
    privacy: "Privacy",
  },
};

export type Dictionary = typeof en;
