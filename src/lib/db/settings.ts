import { queryOne, execute, query } from "@/lib/db";

/** Hard-coded defaults so the site renders even when DB is offline */
const SETTING_DEFAULTS: Record<string, string> = {
  site_name: "Md Sakhawat Hossain",
  site_tagline: "Creative Graphic Designer",
  contact_email: "designersakhawat86@gmail.com",
  contact_whatsapp: "+8801781955355",
  contact_whatsapp_url: "https://wa.me/8801781955355",
  contact_location: "Dhaka, Bangladesh",
  about_bio:
    "I'm a passionate creative graphic designer with years of experience crafting visual identities, social media content, packaging, and AI-enhanced video edits for brands worldwide.",
  seo_default_title: "Md Sakhawat Hossain | Creative Graphic Designer",
  seo_default_description:
    "Creative Graphic Designer specialising in logo & branding, social media design, packaging, and AI video editing. Let's bring your vision to life.",
};

/**
 * Get a single setting value
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await queryOne<{ value: string }>(
      "SELECT value FROM settings WHERE `key` = ?",
      [key]
    );
    return row?.value ?? SETTING_DEFAULTS[key] ?? null;
  } catch {
    return SETTING_DEFAULTS[key] ?? null;
  }
}

/**
 * Get multiple settings by keys — returns object { key: value }
 * Falls back to SETTING_DEFAULTS when DB is unavailable.
 */
export async function getSettings(
  keys: string[]
): Promise<Record<string, string>> {
  if (keys.length === 0) return {};

  // Build defaults for requested keys first
  const result: Record<string, string> = {};
  for (const k of keys) {
    if (SETTING_DEFAULTS[k]) result[k] = SETTING_DEFAULTS[k];
  }

  try {
    const placeholders = keys.map(() => "?").join(", ");
    const allRows = await query<{ key: string; value: string }>(
      `SELECT \`key\`, value FROM settings WHERE \`key\` IN (${placeholders})`,
      keys
    );
    for (const row of allRows) {
      result[row.key] = row.value ?? "";
    }
  } catch {
    // DB unavailable — return defaults silently
  }

  return result;
}

/**
 * Set a setting value
 */
export async function setSetting(key: string, value: string): Promise<void> {
  await execute(
    "INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)",
    [key, value]
  );
}

/**
 * Set multiple settings at once
 */
export async function setSettings(
  settings: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(settings)) {
    await setSetting(key, value);
  }
}
