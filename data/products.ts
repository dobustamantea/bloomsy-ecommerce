import type { Product } from "@/types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&fit=crop`;

export const products: Product[] = [
  // ─── POLERAS (3) ────────────────────────────────────────────────────────────
  {
    id: "1",
    slug: "polera-essential-negra",
    name: "Polera Essential Negra",
    category: "poleras",
    price: 14990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Blanco", hex: "#FFFFFF" },
      { name: "Gris", hex: "#9B9B9B" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL", "4XL"],
    images: [
      img("1515886657613-9f3515b0c78f"),
      img("1483985988355-763728e1935b"),
      img("1509631179647-0177331693ae"),
    ],
    description:
      "La polera que siempre buscaste. Confeccionada en algodón pima peruano con caída perfecta, ideal para el día a día. Corte recto con hombros levemente caídos para una silueta moderna y cómoda.",
    care: [
      "Lavar a máquina en ciclo delicado a 30°C",
      "No usar blanqueador",
      "Secar a la sombra",
      "Planchar a temperatura baja",
    ],
    isNew: false,
    isFeatured: true,
    reviews: [
      {
        author: "Valentina R.",
        rating: 5,
        comment: "Calidad increíble, el algodón es suave y no se deforma. La uso todo el tiempo.",
        date: "2026-01-15",
      },
      {
        author: "Camila S.",
        rating: 4,
        comment: "Hermosa polera, el largo es perfecto. Pedí talla XL y quedó ideal.",
        date: "2026-02-03",
      },
    ],
  },
  {
    id: "2",
    slug: "polera-oversize-crema",
    name: "Polera Oversize Crema",
    category: "poleras",
    price: 17990,
    originalPrice: 22990,
    colors: [
      { name: "Beige", hex: "#EFECDA" },
      { name: "Negro", hex: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL"],
    images: [
      img("1525507119028-ed4c629a60a3"),
      img("1558618666-fcd25c85cd64"),
      img("1554568218-0f1715e72254"),
    ],
    description:
      "Corte oversize con largo extendido, perfecta para combinar con leggins o jeans. Tela suave y liviana, con bajo redondeado y puños ribeteados. Un básico premium que nunca falla.",
    care: [
      "Lavar a mano con agua fría",
      "No retorcer",
      "Secar extendida sobre superficie plana",
      "Planchar al revés con temperatura media",
    ],
    isNew: false,
    isFeatured: false,
    reviews: [
      {
        author: "Francisca M.",
        rating: 5,
        comment: "Me encantó el oversize, se ve muy elegante. La tela es de primera.",
        date: "2026-01-28",
      },
    ],
  },
  {
    id: "3",
    slug: "polera-ribbed-gris",
    name: "Polera Ribbed Acanalada",
    category: "poleras",
    price: 15990,
    colors: [
      { name: "Gris", hex: "#9B9B9B" },
      { name: "Negro", hex: "#000000" },
      { name: "Beige", hex: "#EFECDA" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL", "4XL"],
    images: [
      img("1572804013427-4d7ca7268217"),
      img("1539109136881-3be0616acf4b"),
      img("1567401893414-76b7b1e5a7a5"),
    ],
    description:
      "Tejido acanalado que se adapta perfectamente a la figura. Cuello redondo y manga larga. La textura ribbed añade profundidad visual y define la silueta de forma elegante.",
    care: [
      "Lavar a máquina en delicado a 30°C",
      "No secar en secadora",
      "Guardar doblada, no colgada",
    ],
    isNew: true,
    isFeatured: true,
    reviews: [
      {
        author: "Isidora L.",
        rating: 5,
        comment: "Súper bonita, el acanalado es de buena calidad. El gris es precioso.",
        date: "2026-02-12",
      },
      {
        author: "Daniela P.",
        rating: 4,
        comment: "Muy linda, pedí 2XL y quedó perfecta. La recomiendo.",
        date: "2026-02-20",
      },
    ],
  },

  // ─── TOPS (2) ────────────────────────────────────────────────────────────────
  {
    id: "4",
    slug: "top-tirantes-sedoso",
    name: "Top Tirantes Sedoso",
    category: "tops",
    price: 12990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Beige", hex: "#EFECDA" },
      { name: "Blanco", hex: "#FFFFFF" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL"],
    images: [
      img("1564257631407-4deb1f99d992"),
      img("1583743814966-8d4f4c47c2b6"),
      img("1594938298603-c8148c4dae35"),
    ],
    description:
      "Top con tirantes finos en tela satinada con efecto sedoso. Escote en V suave y largo crop que termina justo sobre la cadera. Perfecto para el verano o para combinar bajo blazer.",
    care: [
      "Lavar a mano con agua fría",
      "No usar secadora",
      "Planchar a temperatura muy baja o al vapor",
    ],
    isNew: true,
    isFeatured: true,
    reviews: [
      {
        author: "Andrea V.",
        rating: 5,
        comment: "Se ve carísimo y es muy cómodo. La tela cae perfecto.",
        date: "2026-01-10",
      },
    ],
  },
  {
    id: "5",
    slug: "top-off-shoulder-minimal",
    name: "Top Off-Shoulder Minimal",
    category: "tops",
    price: 19990,
    originalPrice: 24990,
    colors: [
      { name: "Blanco", hex: "#FFFFFF" },
      { name: "Negro", hex: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL"],
    images: [
      img("1487222477099-a33fc91f7c35"),
      img("1488161628813-04466f872be2"),
      img("1515886657613-9f3515b0c78f"),
    ],
    description:
      "Top hombros descubiertos con elástico interior suave para un ajuste cómodo sin tirantes. Manga corta tipo mariposa. Silueta fluida y femenina, ideal para ocasiones especiales.",
    care: [
      "Lavar a mano",
      "No escurrir con fuerza",
      "Secar a la sombra extendida",
    ],
    isNew: false,
    isFeatured: false,
    reviews: [
      {
        author: "Sofía B.",
        rating: 5,
        comment: "Perfecto para salidas. El elástico es cómodo y no marca.",
        date: "2025-12-20",
      },
      {
        author: "Catalina A.",
        rating: 4,
        comment: "Bonito top, el blanco es muy limpio. Me quedó perfecto en talla 1XL.",
        date: "2026-01-05",
      },
    ],
  },

  // ─── FALDAS (1) ──────────────────────────────────────────────────────────────
  {
    id: "6",
    slug: "falda-midi-envolvente",
    name: "Falda Midi Envolvente",
    category: "faldas",
    price: 24990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Café", hex: "#6B4C3B" },
      { name: "Azul", hex: "#2C3E6B" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL", "4XL"],
    images: [
      img("1583743814966-8d4f4c47c2b6"),
      img("1554568218-0f1715e72254"),
      img("1572804013427-4d7ca7268217"),
    ],
    description:
      "Falda midi con abertura envolvente lateral y cierre invisible. Longitud bajo la rodilla con vuelo moderado. Cintura elástica en la espalda para mayor comodidad. Versátil para oficina y salidas.",
    care: [
      "Lavar a máquina a 30°C",
      "Colgar inmediatamente para evitar arrugas",
      "Planchar a temperatura media con vapor",
    ],
    isNew: true,
    isFeatured: true,
    reviews: [
      {
        author: "Paz M.",
        rating: 5,
        comment: "Me enamoré de esta falda. El corte envolvente me hace sentir increíble.",
        date: "2026-02-15",
      },
    ],
  },

  // ─── ABRIGOS (2) ─────────────────────────────────────────────────────────────
  {
    id: "7",
    slug: "abrigo-clasico-oversized",
    name: "Abrigo Clásico Oversized",
    category: "abrigos",
    price: 49990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Café", hex: "#6B4C3B" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL", "4XL"],
    images: [
      img("1567401893414-76b7b1e5a7a5"),
      img("1539109136881-3be0616acf4b"),
      img("1509631179647-0177331693ae"),
    ],
    description:
      "El abrigo definitivo. Corte oversized largo hasta la rodilla, con solapas estructuradas y botonería dorada. Mezcla de lana y poliéster que te mantiene abrigada sin perder estilo.",
    care: [
      "Lavar en seco recomendado",
      "Lavar a mano con detergente suave si es necesario",
      "Guardar colgado en funda protectora",
      "Airear regularmente",
    ],
    isNew: false,
    isFeatured: true,
    reviews: [
      {
        author: "Renata C.",
        rating: 5,
        comment: "El abrigo más bonito que he comprado. La calidad es excepcional.",
        date: "2025-11-30",
      },
      {
        author: "Gabriela T.",
        rating: 5,
        comment: "Lo pedí en 2XL y queda perfecto. Muy abrigador y elegante.",
        date: "2025-12-10",
      },
    ],
  },
  {
    id: "8",
    slug: "abrigo-cocoon-beige",
    name: "Abrigo Cocoon Camel",
    category: "abrigos",
    price: 44990,
    originalPrice: 52990,
    colors: [
      { name: "Beige", hex: "#EFECDA" },
      { name: "Gris", hex: "#9B9B9B" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL"],
    images: [
      img("1558618666-fcd25c85cd64"),
      img("1525507119028-ed4c629a60a3"),
      img("1483985988355-763728e1935b"),
    ],
    description:
      "Silueta cocoon redondeada con tejido borreguillo exterior suave al tacto. Bolsillos laterales con costura invisible. Sin cierre para una apertura limpia y moderna.",
    care: [
      "Lavar en seco",
      "No mojar en exceso",
      "Cepillar suavemente con cepillo de ropa",
    ],
    isNew: true,
    isFeatured: false,
    reviews: [
      {
        author: "Martina O.",
        rating: 4,
        comment: "Adorable y muy abrigador. El color camel es exactamente como en la foto.",
        date: "2026-01-20",
      },
    ],
  },

  // ─── PANTALONES (2) ──────────────────────────────────────────────────────────
  {
    id: "9",
    slug: "pantalon-palazzo-negro",
    name: "Pantalón Palazzo Premium",
    category: "pantalones",
    price: 27990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Gris", hex: "#9B9B9B" },
      { name: "Azul", hex: "#2C3E6B" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL", "4XL"],
    images: [
      img("1594938298603-c8148c4dae35"),
      img("1564257631407-4deb1f99d992"),
      img("1515886657613-9f3515b0c78f"),
    ],
    description:
      "Pantalón de pierna ancha tipo palazzo en tela fluida de alta caída. Pretina elástica cómoda con bolsillos laterales funcionales. Largo tiro alto que estiliza la figura.",
    care: [
      "Lavar a máquina a 30°C en delicado",
      "Colgar inmediatamente",
      "Planchar con vapor a temperatura media",
    ],
    isNew: false,
    isFeatured: true,
    reviews: [
      {
        author: "Emilia F.",
        rating: 5,
        comment: "El mejor pantalón que he comprado. La tela cae increíble.",
        date: "2026-01-08",
      },
      {
        author: "Javiera N.",
        rating: 5,
        comment: "Súper cómodo, pedí 3XL y me quedó perfecto. Vale cada peso.",
        date: "2026-01-25",
      },
    ],
  },
  {
    id: "10",
    slug: "pantalon-recto-cafe",
    name: "Pantalón Recto Chocolate",
    category: "pantalones",
    price: 22990,
    colors: [
      { name: "Café", hex: "#6B4C3B" },
      { name: "Negro", hex: "#000000" },
      { name: "Beige", hex: "#EFECDA" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL"],
    images: [
      img("1572804013427-4d7ca7268217"),
      img("1558618666-fcd25c85cd64"),
      img("1554568218-0f1715e72254"),
    ],
    description:
      "Pantalón de corte recto con pinzas delanteras para un look estructurado. Cierre lateral invisible y pretina alta. Confeccionado en gabardina de calidad que mantiene la forma.",
    care: [
      "Lavar a máquina a 30°C",
      "No usar secadora",
      "Planchar del revés a temperatura media",
    ],
    isNew: false,
    isFeatured: false,
    reviews: [
      {
        author: "Belén G.",
        rating: 4,
        comment: "Muy lindo el chocolate, se ve muy premium. Talla bien.",
        date: "2026-02-01",
      },
    ],
  },

  // ─── BODYS (1) ───────────────────────────────────────────────────────────────
  {
    id: "11",
    slug: "body-manga-larga-negro",
    name: "Body Manga Larga Esencial",
    category: "bodys",
    price: 18990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Blanco", hex: "#FFFFFF" },
      { name: "Beige", hex: "#EFECDA" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL"],
    images: [
      img("1539109136881-3be0616acf4b"),
      img("1525507119028-ed4c629a60a3"),
      img("1487222477099-a33fc91f7c35"),
    ],
    description:
      "Body manga larga con cuello redondo y cierre a presión en la entrepierna. Tela elastizada suave al tacto que se adapta a la figura. Perfecto para usar con falda, pantalón o solo.",
    care: [
      "Lavar a máquina en ciclo delicado a 30°C",
      "No usar blanqueador",
      "Secar a la sombra",
    ],
    isNew: true,
    isFeatured: false,
    reviews: [
      {
        author: "Constanza H.",
        rating: 5,
        comment: "Finalmente un body que se ve bien y es cómodo. La tela es de muy buena calidad.",
        date: "2026-02-18",
      },
    ],
  },

  // ─── CHALECOS (2) ────────────────────────────────────────────────────────────
  {
    id: "12",
    slug: "chaleco-tejido-artesanal",
    name: "Chaleco Tejido Artesanal",
    category: "chalecos",
    price: 32990,
    colors: [
      { name: "Beige", hex: "#EFECDA" },
      { name: "Gris", hex: "#9B9B9B" },
      { name: "Café", hex: "#6B4C3B" },
    ],
    sizes: ["Talla Única", "0XL", "1XL", "2XL"],
    images: [
      img("1583743814966-8d4f4c47c2b6"),
      img("1567401893414-76b7b1e5a7a5"),
      img("1509631179647-0177331693ae"),
    ],
    description:
      "Chaleco en punto grueso con patrón artesanal. Sin mangas con escote V profundo y largo hasta la cadera. Pieza statement que transforma cualquier look básico.",
    care: [
      "Lavar a mano con agua fría",
      "Jabón específico para lana",
      "No retorcer ni escurrir con fuerza",
      "Secar horizontal sobre superficie plana",
    ],
    isNew: false,
    isFeatured: true,
    reviews: [
      {
        author: "Trinidad V.",
        rating: 5,
        comment: "Hermoso chaleco, muy de tendencia. El tejido es grueso y de calidad.",
        date: "2026-01-30",
      },
      {
        author: "Rocío M.",
        rating: 5,
        comment: "Lo pedí en talla 1XL y me quedó perfecto. Muy recomendable.",
        date: "2026-02-08",
      },
    ],
  },
  {
    id: "13",
    slug: "chaleco-largo-abierto",
    name: "Chaleco Largo Abierto",
    category: "chalecos",
    price: 28990,
    originalPrice: 35990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Azul", hex: "#2C3E6B" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL"],
    images: [
      img("1488161628813-04466f872be2"),
      img("1594938298603-c8148c4dae35"),
      img("1564257631407-4deb1f99d992"),
    ],
    description:
      "Chaleco largo estilo cardigan abierto, llega hasta la rodilla. Tela fluida con textura suave, sin cierre. Crea un efecto abrigo liviano ideal para primavera y otoño.",
    care: [
      "Lavar a mano o en bolsa de lavado en delicado",
      "No centrifugar",
      "Secar a la sombra colgado",
    ],
    isNew: false,
    isFeatured: false,
    reviews: [
      {
        author: "Amanda R.",
        rating: 4,
        comment: "Muy elegante y versátil. El azul es hermoso y diferente.",
        date: "2025-12-15",
      },
    ],
  },

  // ─── CONJUNTOS (2) ───────────────────────────────────────────────────────────
  {
    id: "14",
    slug: "conjunto-loungewear-satinado",
    name: "Conjunto Loungewear Satinado",
    category: "conjuntos",
    price: 39990,
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Beige", hex: "#EFECDA" },
      { name: "Rojo", hex: "#C0392B" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL", "3XL", "4XL"],
    images: [
      img("1515886657613-9f3515b0c78f"),
      img("1483985988355-763728e1935b"),
      img("1539109136881-3be0616acf4b"),
    ],
    description:
      "Conjunto de dos piezas en tela satinada: top tirantes con escote en V y pantalón recto de tiro alto. Elástico suave en pretina. Perfecto para estar en casa con estilo o salir de noche.",
    care: [
      "Lavar a mano con agua fría",
      "Separar por colores",
      "No usar secadora",
      "Planchar al vapor a temperatura muy baja",
    ],
    isNew: true,
    isFeatured: true,
    reviews: [
      {
        author: "Lorena C.",
        rating: 5,
        comment: "Increíble conjunto. El rojo es espectacular y la tela es súper lujosa.",
        date: "2026-02-25",
      },
      {
        author: "Karla D.",
        rating: 5,
        comment: "Lo pedí en 4XL y me quedó como un guante. Hermoso!",
        date: "2026-03-01",
      },
    ],
  },
  {
    id: "15",
    slug: "conjunto-crop-pantalon",
    name: "Conjunto Crop + Pantalón",
    category: "conjuntos",
    price: 34990,
    colors: [
      { name: "Gris", hex: "#9B9B9B" },
      { name: "Negro", hex: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "0XL", "1XL", "2XL"],
    images: [
      img("1572804013427-4d7ca7268217"),
      img("1558618666-fcd25c85cd64"),
      img("1525507119028-ed4c629a60a3"),
    ],
    description:
      "Conjunto deportivo-casual con top crop de manga corta y pantalón de pierna ancha en tela french terry. Banda elástica ancha en cintura. Cómodo y estiloso para el día completo.",
    care: [
      "Lavar a máquina a 30°C",
      "No usar suavizante",
      "Secar a la sombra",
    ],
    isNew: false,
    isFeatured: false,
    reviews: [
      {
        author: "Nicole V.",
        rating: 4,
        comment: "Muy cómodo para el día a día. El gris es bonito y versátil.",
        date: "2026-01-18",
      },
    ],
  },
];

export const CATEGORIES: { value: string; label: string }[] = [
  { value: "poleras", label: "Poleras" },
  { value: "tops", label: "Tops" },
  { value: "camisas", label: "Camisas" },
  { value: "blusas", label: "Blusas" },
  { value: "faldas", label: "Faldas" },
  { value: "abrigos", label: "Abrigos" },
  { value: "pantalones", label: "Pantalones" },
  { value: "bodys", label: "Bodys" },
  { value: "chalecos", label: "Chalecos" },
  { value: "conjuntos", label: "Conjuntos" },
];

export const ALL_SIZES = [
  "S", "M", "L", "XL", "XXL",
  "0XL", "1XL", "2XL", "3XL", "4XL", "Talla Única",
];

export const CURVY_SIZES = ["0XL", "1XL", "2XL", "3XL", "4XL"];

export const ALL_COLORS = [
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Negro", hex: "#000000" },
  { name: "Rojo", hex: "#C0392B" },
  { name: "Gris", hex: "#9B9B9B" },
  { name: "Café", hex: "#6B4C3B" },
  { name: "Azul", hex: "#2C3E6B" },
  { name: "Beige", hex: "#EFECDA" },
];

export const MIN_PRICE = 5990;
export const MAX_PRICE = 49990;
