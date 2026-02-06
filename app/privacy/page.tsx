import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6 sm:px-12 lg:px-24 text-slate-800">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 mb-10 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Política de Privacidad
        </h1>
        <p className="text-slate-500 mb-10 font-medium">
          Última actualización: 6 de febrero de 2026
        </p>

        <div className="prose prose-orange max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              1. Información que recopilamos
            </h2>
            <p className="leading-relaxed text-slate-600">
              En NextSpot, la privacidad de nuestros usuarios es una prioridad. Recopilamos los siguientes datos:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-slate-600">
              <li>
                <strong>Información de cuenta:</strong> Al registrarte o usar Google OAuth, obtenemos tu nombre, correo electrónico y foto de perfil.
              </li>
              <li>
                <strong>Datos de ubicación:</strong> Solicitamos acceso a tu ubicación GPS únicamente para encontrar lugares cercanos. Esta ubicación se procesa en tiempo real y no se almacena en nuestros servidores a menos que decidas guardar un lugar específico.
              </li>
              <li>
                <strong>Historial y Favoritos:</strong> Almacenamos los lugares que has buscado y los que has marcado como favoritos para mejorar tu experiencia personal.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              2. Uso de la información
            </h2>
            <p className="leading-relaxed text-slate-600">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-slate-600">
              <li>Proporcionar y mantener el servicio de descubrimiento de lugares.</li>
              <li>Personalizar tu experiencia basada en tus preferencias de búsqueda.</li>
              <li>Permitirte gestionar tu historial y lista de favoritos.</li>
              <li>Mejorar la seguridad y funcionalidad de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              3. Servicios de terceros
            </h2>
            <p className="leading-relaxed text-slate-600">
              NextSpot utiliza <strong>Google Maps Platform (Places API)</strong> para proporcionar datos de ubicación y mapas. Al utilizar nuestra aplicación, también estás sujeto a los{" "}
              <a
                href="https://www.google.com/intl/es/help/terms_maps/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline"
              >
                Términos de servicio adicionales de Google Maps/Google Earth
              </a>{" "}
              y a la{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline"
              >
                Política de privacidad de Google
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              4. Control de tus datos
            </h2>
            <p className="leading-relaxed text-slate-600">
              Creemos en el control total del usuario sobre sus datos. En cualquier momento puedes:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-slate-600">
              <li>Ver y eliminar elementos de tu historial de búsqueda.</li>
              <li>Eliminar lugares de tu lista de favoritos.</li>
              <li>
                <strong>Eliminar tu cuenta:</strong> A través de la configuración de tu perfil, puedes eliminar tu cuenta permanentemente. Esta acción borrará todos tus datos personales de nuestra base de datos de forma irreversible.
              </li>
            </ul>
          </section>

          <section className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <h2 className="text-lg font-bold text-orange-900 mb-2">
              Contacto
            </h2>
            <p className="text-orange-800 text-sm">
              Si tienes preguntas sobre esta política, puedes contactarnos a través del soporte de la aplicación.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
