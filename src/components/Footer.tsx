import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

const footerSections = [
  {
    title: "Plataforma",
    links: [
      { href: "/buscar", label: "Buscar mascota" },
      { href: "/reportar", label: "Reportar perdida" },
      { href: "/mapa", label: "Mapa interactivo" },
      { href: "/#historias", label: "Historias de exito" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { href: "/#ongs", label: "ONGs asociadas" },
      { href: "/#veterinarias", label: "Veterinarias" },
      { href: "/#blog", label: "Blog" },
      { href: "/#faq", label: "Preguntas frecuentes" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidad", label: "Privacidad" },
      { href: "/terminos", label: "Terminos de uso" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="Vuelve a tu Casa"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-base font-semibold tracking-tight">
                Vuelve <span className="text-petrol">a tu Casa</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              La red colaborativa mas grande de Latinoamerica para encontrar
              mascotas perdidas.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-petrol transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Vuelve a tu Casa. Todos los derechos
              reservados.
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              Hecho con{" "}
              <Heart className="w-3 h-3 text-red-400 fill-red-400" /> para las
              mascotas de Latinoamerica
            </p>
          </div>
          <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
            <p className="text-xs text-gray-400">
              Construido por{" "}
              <span className="font-semibold text-gray-600">
                EcoAves Ingenieria y Software
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
