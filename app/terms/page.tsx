import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          Términos de Servicio
        </h1>
        <p className="text-slate-500 mb-10 font-medium">
          Última actualización: 6 de febrero de 2026
        </p>

        <div className="prose prose-orange max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              1. Aceptación de los términos
            </h2>
            <p className="leading-relaxed text-slate-600">
              Al acceder y utilizar NextSpot, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no estás de acuerdo con alguna parte de estos términos, no podrás utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              2. Uso del servicio
            </h2>
            <p className="leading-relaxed text-slate-600">
              NextSpot es una herramienta de descubrimiento de lugares basada en la ubicación. Te comprometes a:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-slate-600">
              <li>Utilizar el servicio de manera legal y ética.</li>
              <li>No intentar extraer datos de forma automatizada (scraping) sin autorización.</li>
              <li>No interferir con la seguridad o el funcionamiento de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              3. Propiedad Intelectual
            </h2>
            <p className="leading-relaxed text-slate-600">
              El diseño, el código y los logotipos de NextSpot son propiedad intelectual de sus creadores. Los datos de los lugares y los mapas son proporcionados por Google Maps y están sujetos a sus propios derechos de autor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              4. Limitación de responsabilidad
            </h2>
            <p className="leading-relaxed text-slate-600">
              NextSpot proporciona información basada en servicios de terceros. No garantizamos la exactitud, disponibilidad o estado de los lugares mostrados. El uso de la información para navegar o visitar establecimientos es bajo tu propio riesgo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              5. Modificaciones
            </h2>
            <p className="leading-relaxed text-slate-600">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la aplicación tras dichos cambios constituirá tu aceptación de los nuevos términos.
            </p>
          </section>

          <section className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <h2 className="text-lg font-bold text-orange-900 mb-2">
              Nota Legal
            </h2>
            <p className="text-orange-800 text-sm">
              Este es un proyecto diseñado para mejorar la experiencia de descubrimiento de ciudades. Disfruta explorando de manera responsable.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
