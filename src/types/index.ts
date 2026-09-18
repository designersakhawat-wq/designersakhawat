// ── Media ────────────────────────────────────────────────────────────────────
export interface MediaRecord {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  focal_x: number | null;
  focal_y: number | null;
  storage_path: string;
  thumb_path: string | null;
  medium_path: string | null;
  webp_path: string | null;
  created_at: string;
}

// ── Service ──────────────────────────────────────────────────────────────────
export type PricingMode = "quote_only" | "pricing" | "both";

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_media_id: number | null;
  pricing_mode: PricingMode;
  display_order: number;
  visible: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  cover?: MediaRecord | null;
}

export interface ServicePackage {
  id: number;
  service_id: number;
  name: string;
  price: number | null;
  currency: string;
  is_starting_from: number;
  description: string | null;
  features_json: string | null;
  display_order: number;
  visible: number;
  created_at: string;
  updated_at: string;
  // parsed
  features?: string[];
}

// ── Project ──────────────────────────────────────────────────────────────────
export type ProjectStatus = "draft" | "published" | "trashed";

export interface Project {
  id: number;
  title: string;
  slug: string;
  cover_media_id: number | null;
  service_id: number | null;
  client: string | null;
  industry: string | null;
  short_description: string | null;
  challenge: string | null;
  solution: string | null;
  result: string | null;
  services_provided: string | null;
  featured: number;
  display_order: number;
  status: ProjectStatus;
  seo_title: string | null;
  seo_description: string | null;
  og_image_id: number | null;
  deleted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  cover?: MediaRecord | null;
  service?: Service | null;
  media?: ProjectMediaItem[];
}

export interface ProjectMediaItem {
  id: number;
  project_id: number;
  media_id: number | null;
  video_url: string | null;
  video_type: "file" | "youtube" | "vimeo" | null;
  poster_id: number | null;
  display_order: number;
  type: "image" | "video";
  media?: MediaRecord | null;
  poster?: MediaRecord | null;
}

// ── Testimonial ──────────────────────────────────────────────────────────────
export interface Testimonial {
  id: number;
  client_name: string;
  designation: string | null;
  company: string | null;
  photo_media_id: number | null;
  text: string;
  display_order: number;
  visible: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  photo?: MediaRecord | null;
}

// ── ClientLogo ───────────────────────────────────────────────────────────────
export interface ClientLogo {
  id: number;
  name: string;
  media_id: number | null;
  website_url: string | null;
  display_order: number;
  visible: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  media?: MediaRecord | null;
}

// ── Industry ─────────────────────────────────────────────────────────────────
export interface Industry {
  id: number;
  name: string;
  icon: string | null;
  display_order: number;
  visible: number;
  created_at: string;
}

// ── Inquiry ──────────────────────────────────────────────────────────────────
export interface Inquiry {
  id: number;
  name: string;
  email: string;
  service: string | null;
  message: string;
  budget: string | null;
  ip_hash: string | null;
  read_at: string | null;
  created_at: string;
}

// ── Admin User ───────────────────────────────────────────────────────────────
export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
  last_login: string | null;
}

// ── Activity Log ─────────────────────────────────────────────────────────────
export interface ActivityLog {
  id: number;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  detail: string | null;
  created_at: string;
}

// ── Settings ─────────────────────────────────────────────────────────────────
export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  hero_headline: string;
  hero_subline: string;
  hero_cta_primary_label: string;
  hero_cta_primary_href: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_href: string;
  about_bio: string;
  contact_whatsapp: string;
  contact_whatsapp_url: string;
  contact_email: string;
  contact_location: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_behance: string;
  social_youtube: string;
  seo_title_template: string;
  seo_default_description: string;
  [key: string]: string;
}
