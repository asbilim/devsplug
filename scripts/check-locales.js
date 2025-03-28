/**
 * This script checks for missing translations between locale files
 * Run with: node scripts/check-locales.js
 */

const fs = require("fs");
const path = require("path");

// Configuration
const localesDir = path.join(__dirname, "../messages");
const baseLocale = "en.json"; // Base locale to compare against

// Helper functions
function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : "";
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    return acc;
  }, {});
}

function getMissingKeys(baseKeys, compareKeys) {
  return Object.keys(baseKeys).filter(
    (key) => !compareKeys.hasOwnProperty(key)
  );
}

// Main function
async function checkLocales() {
  try {
    // Read directory
    const files = fs
      .readdirSync(localesDir)
      .filter((file) => file.endsWith(".json"));

    // Read base locale
    const baseLocalePath = path.join(localesDir, baseLocale);
    const baseLocaleContent = JSON.parse(
      fs.readFileSync(baseLocalePath, "utf8")
    );
    const flattenedBaseLocale = flattenObject(baseLocaleContent);

    console.log(
      `Base locale (${baseLocale}) has ${
        Object.keys(flattenedBaseLocale).length
      } keys`
    );

    // Check each locale against the base
    let hasErrors = false;

    for (const file of files) {
      if (file === baseLocale) continue;

      const localePath = path.join(localesDir, file);
      const localeContent = JSON.parse(fs.readFileSync(localePath, "utf8"));
      const flattenedLocale = flattenObject(localeContent);

      // Check for missing keys
      const missingKeys = getMissingKeys(flattenedBaseLocale, flattenedLocale);
      const extraKeys = getMissingKeys(flattenedLocale, flattenedBaseLocale);

      console.log(`\nChecking ${file}:`);
      console.log(`- Has ${Object.keys(flattenedLocale).length} keys`);

      if (missingKeys.length > 0) {
        hasErrors = true;
        console.log(`- Missing ${missingKeys.length} keys:`);
        missingKeys.forEach((key) => console.log(`  - ${key}`));
      } else {
        console.log("- No missing keys! 👍");
      }

      if (extraKeys.length > 0) {
        console.log(`- Has ${extraKeys.length} extra keys:`);
        extraKeys.forEach((key) => console.log(`  - ${key}`));
      }
    }

    if (hasErrors) {
      console.log("\n⚠️ Some locales are missing translations!");
      process.exit(1);
    } else {
      console.log("\n✅ All locales have the required translations!");
    }
  } catch (error) {
    console.error("Error checking locales:", error);
    process.exit(1);
  }
}

checkLocales();
