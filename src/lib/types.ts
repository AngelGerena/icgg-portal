// Types mirror the live ICGG-SITE schema exactly (project zyvfvjrhnuwapfwipukd).

export type Lang = 'es' | 'en';
export type Theme = 'light' | 'dark';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'staff';
  is_super_admin: boolean;
}

export interface EventRow {
  id: string;
  title_es: string;
  title_en: string | null;
  date: string | null;
  date_label_es: string | null;
  date_label_en: string | null;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  description: string | null;      // Spanish (primary)
  description_en: string | null;
  flyer_url: string | null;
  type: string | null;
  color: string | null;
  is_weekly: boolean | null;
  weekly_day: number | null;
  is_active: boolean | null;
  status: 'draft' | 'published';
  featured: boolean;
  share_slug: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SermonRow {
  id: string;
  title_es: string;
  title_en: string | null;
  series: string | null;
  verse: string | null;
  speaker: string | null;
  preached_on: string | null;
  minutes: number | null;
  video_url: string | null;
  cover_url: string | null;
  audio_url: string | null;
  status: 'draft' | 'published';
}

export interface PrayerRow {
  id: string;
  name: string | null;
  contact: string | null;
  body: string;
  is_shared: boolean;
  consent: boolean;
  status: 'new' | 'praying' | 'answered' | 'archived';
  created_at: string;
}

export interface MessageRow {
  id: string;
  name: string;
  email: string | null;
  subject: string | null;
  body: string;
  is_read: boolean;
  status: 'new' | 'replied' | 'archived';
  created_at: string;
}

export interface MediaRow {
  id: string;
  name: string;
  path: string;
  bucket: string | null;
  url: string | null;
  tag: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_en: string | null;
  alt_es: string | null;
  created_at: string;
}

export interface SiteContentRow {
  key: string;
  section: string;
  label: string;
  hint: string | null;
  kind: 'text' | 'longtext' | 'image' | 'url';
  value_en: string | null;
  value_es: string | null;
  sort_order: number;
}

export interface BusinessSettings {
  id: number;
  name: string;
  short_name: string;
  address: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  facebook_url: string | null;
  sunday_time: string | null;
  thursday_time: string | null;
  ai_enabled: boolean;
}

export type Channel = 'blog' | 'facebook' | 'instagram' | 'google_business';

export interface ContentQueueRow {
  id: string;
  channel: Channel;
  status: 'draft' | 'scheduled' | 'published' | 'cancelled' | 'failed';
  source_kind: string | null;
  source_id: string | null;
  title: string | null;
  body_en: string | null;
  body_es: string | null;
  meta_en: string | null;
  meta_es: string | null;
  publish_at: string | null;
  published_at: string | null;
  edit_distance: number | null;
  created_at: string;
}

export interface AutopilotRow {
  channel: Channel;
  enabled: boolean;
  approved_streak: number;
  max_per_week: number;
  review_window_hr: number;
  quiet_until: string | null;
}

export interface AuditRow {
  id: string;
  actor: string;
  action: string;
  kind: string | null;
  created_at: string;
}

export interface AiRunRow {
  id: string;
  kind: string;
  input_tokens: number | null;
  output_tokens: number | null;
  created_at: string;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title_es: string;
  title_en: string | null;
  excerpt_es: string | null;
  excerpt_en: string | null;
  body_es: string | null;
  body_en: string | null;
  cover_url: string | null;
  scripture_ref: string | null;
  scripture_text_es: string | null;
  scripture_text_en: string | null;
  keywords: string[] | null;
  author: string | null;
  status: 'draft' | 'scheduled' | 'published';
  featured: boolean;
  reading_minutes: number | null;
  meta_title_es: string | null;
  meta_title_en: string | null;
  meta_description_es: string | null;
  meta_description_en: string | null;
  publish_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
