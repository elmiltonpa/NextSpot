export type CategoryKey = "food" | "drink" | "coffee" | "snacks" | "outdoors";

export const CATEGORY_OPTIONS: { id: CategoryKey; label: string }[] = [
  { id: "food", label: "Comida" },
  { id: "snacks", label: "Dulces" },
  { id: "drink", label: "Bebida" },
  { id: "coffee", label: "Café" },
  { id: "outdoors", label: "Aire Libre" },
];

export const GOOGLE_PRIMARY_TYPE_MAPPING: Record<CategoryKey, string[]> = {
  food: [
    "restaurant",
    "meal_takeaway",
    "meal_delivery",
    "sandwich_shop",
    "pizza_restaurant",
    "hamburger_restaurant",
    "sushi_restaurant",
    "seafood_restaurant",
    "steak_house",
    "brunch_restaurant",
    "fast_food_restaurant",
    "vegetarian_restaurant",
    "vegan_restaurant",
    "mexican_restaurant",
    "italian_restaurant",
    "chinese_restaurant",
    "japanese_restaurant",
    "indian_restaurant",
    "thai_restaurant",
    "korean_restaurant",
    "turkish_restaurant",
    "lebanese_restaurant",
    "greek_restaurant",
    "spanish_restaurant",
    "french_restaurant",
    "brazilian_restaurant",
    "vietnamese_restaurant",
    "indonesian_restaurant",
    "middle_eastern_restaurant",
    "mediterranean_restaurant",
    "american_restaurant",
    "barbecue_restaurant",
    "ramen_restaurant",
  ],

  snacks: [
    "bakery",
    "ice_cream_shop",
    "confectionery",
    "dessert_shop",
    "dessert_restaurant",
    "candy_store",
    "chocolate_factory",
    "chocolate_shop",
    "donut_shop",
    "pastry_shop",
  ],

  drink: [
    "bar",
    "night_club",
    "pub",
    "wine_bar",
    "cocktail_bar",
    "brewery",
  ],

  coffee: [
    "cafe",
    "coffee_shop",
  ],

  outdoors: [
    "park",
    "tourist_attraction",
    "amusement_park",
    "aquarium",
    "zoo",
    "hiking_area",
    "national_park",
    "marina",
    "dog_park",
    "garden",
    "playground",
  ],
};

export const GOOGLE_EXCLUDED_TYPE_MAPPING: Record<CategoryKey, string[]> = {
  food: ["lodging", "hotel"],
  snacks: ["lodging", "hotel"],
  drink: ["lodging", "hotel", "casino"],
  coffee: ["lodging", "hotel"],
  outdoors: [],
};

export const PRICE_LEVEL_MAPPING: Record<string, string> = {
  low: "PRICE_LEVEL_INEXPENSIVE",
  medium: "PRICE_LEVEL_MODERATE",
  high: "PRICE_LEVEL_EXPENSIVE",
};
