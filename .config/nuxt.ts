import { SITE } from "../shared/utils/site";

export default defineNuxtConfig({
  // future: { compatibilityVersion: 5 },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
    "@nuxthub/core",
    "@nuxt/ui",
    "@nuxtjs/turnstile",
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "nuxt-mailchannels",
    "nuxt-email-renderer"
  ],

  $env: {
    test: {
      hub: { dir: ".data/test" }
    }
  },

  $production: {
    nitro: {
      preset: "cloudflare-module"
    }
  },

  devtools: { enabled: true },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: SITE.name,
      htmlAttrs: {
        lang: "en"
      },
      link: [],
      meta: [
        { name: "robots", content: "index, follow" }
      ]
    }
  },

  css: [
    "~/assets/css/ui.tailwind.css",
    "~/assets/scss/app.scss"
  ],

  site: {
    url: SITE.host
  },

  colorMode: {
    preference: "light",
    fallback: "light",
    storageKey: "nuxt-color-mode"
  },

  ui: {
    colorMode: true,
    fonts: false
  },

  appConfig: {
    ui: {
      colors: {
        primary: "blue",
        secondary: "green"
      }
    }
  },

  runtimeConfig: {
    session: {
      password: ""
    },
    secure: {
      salt: "",
      secret: ""
    },
    turnstile: {
      secretKey: ""
    },
    mailchannels: {
      apiKey: "",
      dkim: {
        domain: SITE.rootDomain,
        privateKey: "",
        selector: ""
      }
    }
  },

  routeRules: {

  },

  features: {
    inlineStyles: false
  },

  experimental: {
    typedPages: true
  },

  compatibilityDate: "2025-12-22",

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: false,
      routes: ["/sitemap.xml"]
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/images/*"]
        }
      }
    },
    experimental: {
      tasks: true
    }
  },

  hub: {
    db: {
      dialect: "sqlite",
      casing: "snake_case"
    },
    blob: true,
    cache: true
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["color-functions", "import", "global-builtin", "if-function"]
        }
      }
    }
  },

  typescript: {
    tsConfig: {
      include: [
        "../emails/**/*"
      ]
    },
    nodeTsConfig: {
      include: [
        "../test/**/*",
        "../shared/**/*.d.ts"
      ]
    }
  },

  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },

  icon: {
    mode: "svg",
    provider: "none"
  },

  mailchannels: {
    from: {
      email: `brandam@${SITE.rootDomain}`,
      name: `${SITE.name} Support`
    }
  },

  sitemap: {
    exclude: ["/app/**"],
    discoverImages: false,
    defaults: { priority: 0.8, lastmod: new Date().toISOString() },
    urls: [
      { loc: "/", priority: 1.0 }
    ],
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },

  turnstile: {
    siteKey: "0x4AAAAAAB_7RZVN4AGQKW4Q",
    addValidateEndpoint: false
  }
});
