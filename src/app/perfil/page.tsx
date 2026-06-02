"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Shield,
  PawPrint,
  Edit,
  Plus,
  Eye,
  Clock,
  Settings,
  Bell,
  Loader2,
  X,
  LogOut,
  Save,
  ImagePlus,
} from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { useAuth } from "@/lib/auth-context";
import { supabase, type Pet } from "@/lib/supabase";
import Link from "next/link";

export default function PerfilPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toast, setToast] = useState("");
  const [editForm, setEditForm] = useState({
    display_name: "",
    phone: "",
    city: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("pets")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPets((data as Pet[]) ?? []);
        setLoadingPets(false);
      });
  }, [user]);

  function openEditModal() {
    setEditForm({
      display_name: profile?.display_name || "",
      phone: profile?.phone || "",
      city: profile?.city || "",
      bio: profile?.bio || "",
    });
    setShowEditModal(true);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);

    const fields = {
      display_name: editForm.display_name || null,
      phone: editForm.phone || null,
      city: editForm.city || null,
      bio: editForm.bio || null,
      updated_at: new Date().toISOString(),
    };

    let { error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("id", user.id);

    if (error) {
      const upsertResult = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...fields }, { onConflict: "id" });
      error = upsertResult.error;
    }

    setSaving(false);
    if (!error) {
      await refreshProfile();
      setShowEditModal(false);
      notify("Perfil actualizado");
    } else {
      console.error("Error saving profile:", error);
      notify(`Error: ${error.message || "No se pudo guardar"}`);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      notify("Solo se permiten imagenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("La imagen debe ser menor a 5MB");
      return;
    }

    setUploadingAvatar(true);

    const ext = file.name.split(".").pop() || "jpg";
    const path = `avatars/${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("pet-photos")
      .upload(path, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      notify("Error al subir imagen. Verifica el bucket en Supabase.");
      setUploadingAvatar(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("pet-photos").getPublicUrl(path);

    let { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      const fallback = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, avatar_url: publicUrl, updated_at: new Date().toISOString() },
          { onConflict: "id" }
        );
      updateError = fallback.error;
    }

    setUploadingAvatar(false);

    if (!updateError) {
      await refreshProfile();
      notify("Foto de perfil actualizada");
    } else {
      console.error("Profile update error:", updateError);
      notify("Imagen subida pero no se pudo actualizar el perfil");
    }

    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  async function handleSignOut() {
    setShowSettings(false);
    await signOut();
    router.push("/");
  }

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }

  if (loading || !user) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-petrol animate-spin" />
      </div>
    );
  }

  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "Usuario";
  const lostCount = pets.filter((p) => p.status === "lost").length;
  const reunitedCount = pets.filter((p) => p.status === "reunited").length;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      {/* Hidden file input for avatar */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-2xl shadow-2xl max-w-sm text-center">
          {toast}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Editar perfil
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Avatar in modal */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-petrol-light border-2 border-gray-100 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-petrol/40" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-petrol text-white hover:bg-petrol-dark transition-all shadow-md disabled:opacity-50"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editForm.display_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, display_name: e.target.value })
                  }
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  placeholder="+56 9 XXXX XXXX"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                  placeholder="Ej: Santiago, Antofagasta..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  placeholder="Cuentanos sobre ti y tus mascotas..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-petrol text-white font-semibold rounded-xl hover:bg-petrol-dark transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <AnimatedSection className="mb-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-32 sm:h-44 bg-gradient-to-r from-petrol to-petrol-dark relative" />
            <div className="px-6 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-petrol-light border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-2xl">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 sm:w-14 sm:h-14 text-petrol/40" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-petrol text-white hover:bg-petrol-dark transition-all shadow-md disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-0 sm:pb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {displayName}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-petrol/10 text-petrol text-xs font-semibold">
                        <Shield className="w-3 h-3" />
                        Verificado
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                      {profile?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {profile.city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <PawPrint className="w-3.5 h-3.5" />
                        {pets.length}{" "}
                        {pets.length === 1 ? "mascota" : "mascotas"}
                      </span>
                    </div>
                    {profile?.bio && (
                      <p className="text-sm text-gray-500 mt-2 max-w-md">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Ajustes
                      </button>
                      {showSettings && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowSettings(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-20">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
                            >
                              <LogOut className="w-4 h-4" />
                              Cerrar sesion
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={openEditModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol-dark transition-all shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Editar perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Informacion personal
                </h3>
                <div className="space-y-3">
                  {profile?.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {profile.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {user.email}
                  </div>
                  {profile?.city && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {profile.city}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    Email verificado
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Estadisticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: String(pets.length), label: "Mascotas" },
                    { value: String(lostCount), label: "Perdidas" },
                    {
                      value: String(
                        pets.filter((p) => p.status === "found").length
                      ),
                      label: "Encontradas",
                    },
                    { value: String(reunitedCount), label: "Reunidas" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 rounded-xl bg-gray-50"
                    >
                      <p className="text-lg font-bold text-petrol">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notificaciones
                  </h3>
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 text-center py-4">
                  Sin notificaciones nuevas
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Mis mascotas
                </h2>
                <Link
                  href="/reportar"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-petrol bg-petrol-light rounded-xl hover:bg-petrol/10 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Agregar mascota
                </Link>
              </div>
            </AnimatedSection>

            {loadingPets ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-petrol animate-spin" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {pets.map((pet, i) => (
                  <AnimatedCard key={pet.id} delay={i * 0.1}>
                    <Link href={`/mascota/${pet.id}`} className="block">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                        <div className="flex">
                          <div
                            className="w-28 bg-cover bg-center flex-shrink-0 bg-petrol-light min-h-[100px]"
                            style={
                              pet.photo_url
                                ? { backgroundImage: `url(${pet.photo_url})` }
                                : {}
                            }
                          />
                          <div className="p-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {pet.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {pet.species}{" "}
                                  {pet.breed ? `· ${pet.breed}` : ""}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  pet.status === "lost"
                                    ? "bg-red-50 text-red-600"
                                    : pet.status === "found"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-green-50 text-hope"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    pet.status === "lost"
                                      ? "bg-red-500"
                                      : pet.status === "found"
                                        ? "bg-amber-500"
                                        : "bg-hope"
                                  }`}
                                />
                                {pet.status === "lost"
                                  ? "Perdido"
                                  : pet.status === "found"
                                    ? "Encontrado"
                                    : "Reunido"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />0
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(pet.created_at).toLocaleDateString(
                                  "es-CL"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedCard>
                ))}

                <AnimatedCard delay={pets.length * 0.1}>
                  <Link
                    href="/reportar"
                    className="w-full h-full min-h-[120px] bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-petrol/30 hover:bg-petrol-light/30 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <Plus className="w-8 h-8 text-gray-300 group-hover:text-petrol transition-colors" />
                    <span className="text-sm text-gray-400 group-hover:text-petrol font-medium transition-colors">
                      Agregar mascota
                    </span>
                  </Link>
                </AnimatedCard>
              </div>
            )}

            {/* Activity */}
            {pets.length > 0 && (
              <AnimatedSection delay={0.2}>
                <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">
                  Actividad reciente
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                  {pets.slice(0, 3).map((pet, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <div className="w-9 h-9 rounded-xl bg-petrol/5 flex items-center justify-center flex-shrink-0">
                        <PawPrint className="w-4 h-4 text-petrol" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          Reporto la{" "}
                          {pet.status === "lost"
                            ? "perdida"
                            : pet.status === "found"
                              ? "busqueda"
                              : "reunion"}{" "}
                          de {pet.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(pet.created_at).toLocaleDateString(
                            "es-CL",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
