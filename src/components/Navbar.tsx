"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, PawPrint, MapPin, LogIn, LogOut, UserCircle2, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/reportar", label: "Reportar", icon: PawPrint },
  { href: "/mapa", label: "Mapa", icon: MapPin },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Vuelve a tu Casa"
              width={36}
              height={36}
              className="rounded-lg transition-transform group-hover:scale-105"
            />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Vuelve <span className="text-petrol">a tu Casa</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-petrol hover:bg-petrol-light transition-all"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-petrol-light transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-petrol/10 flex items-center justify-center text-petrol font-semibold text-sm">
                    {profile?.display_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {profile?.display_name ?? user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <Link
                        href="/perfil"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-petrol-light hover:text-petrol transition-all"
                      >
                        <UserCircle2 className="w-4 h-4" />
                        Mi perfil
                      </Link>
                      <Link
                        href="/reportar"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-petrol-light hover:text-petrol transition-all"
                      >
                        <PawPrint className="w-4 h-4" />
                        Reportar mascota
                      </Link>
                      <hr className="border-gray-100" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-petrol hover:bg-petrol-light transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesion
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol/90 transition-all shadow-sm hover:shadow-md"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-petrol-light hover:text-petrol transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {user ? (
                <>
                  <Link
                    href="/perfil"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-petrol-light hover:text-petrol transition-all"
                  >
                    <UserCircle2 className="w-4 h-4" />
                    {profile?.display_name ?? "Mi perfil"}
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-petrol-light hover:text-petrol transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar sesion
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol/90 transition-all"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
