import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser },
    rules:{
      "no-var":2,//不能用var
      "no-console":1,//开发时用，上线后不用
      "quotes":["error","double"],
      "semi":["error","always"],
      "indent":["error",2],//缩进两个空格
    } 
  },
  tseslint.configs.recommended,
]);
