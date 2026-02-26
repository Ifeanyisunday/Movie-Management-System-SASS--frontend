// // tailwind.config.cjs
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         background: {
//           DEFAULT: "hsl(var(--background) / <alpha-value>)",
//         },
//         foreground: {
//           DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card) / <alpha-value>)",
//           foreground: "hsl(var(--card-foreground) / <alpha-value>)",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover) / <alpha-value>)",
//           foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
//         },
//         primary: {
//           DEFAULT: "hsl(var(--primary) / <alpha-value>)",
//           foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
//           foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted) / <alpha-value>)",
//           foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent) / <alpha-value>)",
//           foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
//           foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
//         },
//         border: {
//           DEFAULT: "hsl(var(--border) / <alpha-value>)",
//         },
//         input: {
//           DEFAULT: "hsl(var(--input) / <alpha-value>)",
//         },
//         ring: {
//           DEFAULT: "hsl(var(--ring) / <alpha-value>)",
//         },
//         sidebar: {
//           DEFAULT: "hsl(var(--sidebar-background) / <alpha-value>)",
//           foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
//           primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
//           "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
//           accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
//           "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
//           border: "hsl(var(--sidebar-border) / <alpha-value>)",
//           ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// };


import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", ".dark"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
