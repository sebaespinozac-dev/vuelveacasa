import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  city: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  color: string | null;
  status: "lost" | "found" | "reunited";
  location: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  photo_url: string | null;
  reward: string | null;
  contact_phone: string | null;
  contact_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Sighting = {
  id: string;
  pet_id: string;
  reporter_id: string | null;
  lat: number;
  lng: number;
  location: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
};
