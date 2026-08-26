import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "public/libheif/**",
      "lib/worker/libheif-vendor/**",
    ],
  },
];

export default eslintConfig;
