import { HomeClient } from "@/components/home-client";

export default function Home() {
  return (
    <main>
      <HomeClient />

      <section className="sr-only" aria-hidden="false">
        <h1>NextSpot - Descubre restaurantes, bares y lugares cerca de ti</h1>
        <p>
          NextSpot es una app para descubrir lugares para comer, tomar algo,
          tomar un café o pasear cerca de tu ubicación. Filtrá por categoría,
          distancia, precio y disponibilidad, y dejá que NextSpot te recomiende
          el lugar perfecto.
        </p>
        <h2>¿Cómo funciona NextSpot?</h2>
        <p>
          Compartí tu ubicación o buscá una dirección. Elegí qué tipo de lugar
          querés: restaurantes, bares, cafeterías, heladerías, panaderías o
          lugares al aire libre. Configurá la distancia máxima y el rango de
          precio. Tocá el botón y NextSpot te recomienda un lugar al azar,
          priorizando los mejor valorados.
        </p>
        <h2>Encontra restaurantes cerca de ti</h2>
        <p>
          Buscá restaurantes, pizzerías, hamburgueserías, sushi, parrillas,
          comida mexicana, italiana, china, japonesa, india, thai, coreana,
          turca, libanesa, griega, francesa, brasileña, vietnamita,
          mediterránea, americana y más cerca de tu ubicación actual.
        </p>
        <h2>Descubre bares y vida nocturna</h2>
        <p>
          Encontrá bares, pubs, cervecerías artesanales, wine bars, cocktail
          bars y boliches cerca tuyo.
        </p>
        <h2>Cafeterías y dulces</h2>
        <p>
          Descubrí cafeterías, coffee shops, panaderías, heladerías,
          chocolaterías, pastelerías y tiendas de postres en tu zona.
        </p>
        <h2>Lugares al aire libre</h2>
        <p>
          Explorá parques, atracciones turísticas, parques de diversiones,
          acuarios, zoológicos, senderos para caminar, parques nacionales y
          jardines cerca de donde estés.
        </p>
      </section>
    </main>
  );
}
