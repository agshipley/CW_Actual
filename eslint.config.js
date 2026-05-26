import js from "@eslint/js";
import pluginHtml from "eslint-plugin-html";

export default [
  {
    files: ["**/*.html"],
    plugins: { html: pluginHtml },
    languageOptions: {
      ecmaVersion: 2015,
      globals: {
        // Browser
        window: "readonly", document: "readonly", localStorage: "readonly",
        requestAnimationFrame: "readonly", AudioContext: "readonly",
        webkitAudioContext: "readonly", Image: "readonly", Date: "readonly",
        Math: "readonly", JSON: "readonly", parseInt: "readonly",
        parseFloat: "readonly", isNaN: "readonly", setTimeout: "readonly",
        clearTimeout: "readonly", console: "readonly", location: "readonly",
        alert: "readonly",
      },
    },
    rules: {
      // Catches typos in variable/function names — highest value rule
      "no-undef": "error",
      // Dead code
      "no-unreachable": "error",
      // Data entry mistakes
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-dupe-args": "error",
      // Logic errors
      "no-constant-condition": "error",
      "use-isnan": "error",
      "no-func-assign": "error",
      "no-self-assign": "error",
      "no-sparse-arrays": "error",
      // Top-level functions are called from HTML onclick attributes that
      // ESLint can't see, so "unused" function warnings are all false positives.
      // The valuable rule here is no-undef; leave unused-vars off.
      "no-unused-vars": "off",
    },
  },
];
