import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  LocateFixed,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function Image({
  src,
  alt,
  fill,
  className,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${fill ? 'absolute inset-0 h-full w-full' : ''} ${
        className ?? ''
      }`}
    />
  );
}

type Dish = {
  id: string;
  name: string;
  category: string;
  ingredients: string;
  price: number;
  grams: number;
  color: string;
  imageSrc: string;
};

type Promo = {
  id: string;
  title: string;
  terms: string;
  color: string;
};

const categories = ['Роллы', 'Суши', 'Сеты', 'Закуски', 'Пицца'];

const dishes: Dish[] = [
  {
    id: 'set-vnukovo',
    name: 'Внуково сет',
    category: 'Сеты',
    ingredients: 'Филадельфия, Калифорния, унаги маки, имбирь, васаби',
    price: 1990,
    grams: 960,
    color: 'from-[#ff6b45] via-[#ffb15c] to-[#ffe1a8]',
    imageSrc: '/images/set-1.png',
  },
  {
    id: 'set-family',
    name: 'Семейный сет',
    category: 'Сеты',
    ingredients: 'Роллы с лососем, крабом, огурцом, сыром и кунжутом',
    price: 2390,
    grams: 1180,
    color: 'from-[#f97316] via-[#fdba74] to-[#fff7ed]',
    imageSrc: '/images/set-2.png',
  },
  {
    id: 'set-party',
    name: 'Большой сет',
    category: 'Сеты',
    ingredients: 'Ассорти роллов, суши, имбирь, васаби и соевый соус',
    price: 2890,
    grams: 1420,
    color: 'from-[#dc2626] via-[#fb923c] to-[#fef3c7]',
    imageSrc: '/images/set-3.png',
  },
  {
    id: 'philadelphia',
    name: 'Филадельфия',
    category: 'Роллы',
    ingredients: 'Лосось, сливочный сыр, огурец, рис, нори',
    price: 690,
    grams: 285,
    color: 'from-[#fb7185] via-[#fb923c] to-[#fed7aa]',
    imageSrc: '/images/rolls-1.png',
  },
  {
    id: 'tokyo',
    name: 'Токио спайси',
    category: 'Роллы',
    ingredients: 'Креветка, снежный краб, тобико, спайси соус',
    price: 640,
    grams: 270,
    color: 'from-[#34d399] via-[#a3e635] to-[#fef3c7]',
    imageSrc: '/images/rolls-2.png',
  },
  {
    id: 'california',
    name: 'Калифорния',
    category: 'Роллы',
    ingredients: 'Снежный краб, авокадо, огурец, тобико, рис',
    price: 590,
    grams: 260,
    color: 'from-[#fb923c] via-[#fdba74] to-[#ffedd5]',
    imageSrc: '/images/rolls-3.png',
  },
  {
    id: 'salmon-maki',
    name: 'Сяке маки',
    category: 'Роллы',
    ingredients: 'Лосось, рис, нори',
    price: 420,
    grams: 180,
    color: 'from-[#fb7185] via-[#fda4af] to-[#ffe4e6]',
    imageSrc: '/images/rolls-4.png',
  },
  {
    id: 'ebi-roll',
    name: 'Эби ролл',
    category: 'Роллы',
    ingredients: 'Креветка, сливочный сыр, огурец, рис, нори',
    price: 610,
    grams: 255,
    color: 'from-[#38bdf8] via-[#bae6fd] to-[#f0f9ff]',
    imageSrc: '/images/rolls-5.png',
  },
  {
    id: 'baked-salmon',
    name: 'Запеченный лосось',
    category: 'Роллы',
    ingredients: 'Лосось, сырный соус, рис, нори, кунжут',
    price: 620,
    grams: 300,
    color: 'from-[#dc2626] via-[#fb923c] to-[#fde68a]',
    imageSrc: '/images/rolls-6.png',
  },
  {
    id: 'unagi',
    name: 'Унаги маки',
    category: 'Суши',
    ingredients: 'Угорь, огурец, кунжут, унаги соус',
    price: 540,
    grams: 220,
    color: 'from-[#1f2937] via-[#64748b] to-[#cbd5e1]',
    imageSrc: '/images/sushi-1.png',
  },
  {
    id: 'salmon-sushi',
    name: 'Суши лосось',
    category: 'Суши',
    ingredients: 'Лосось, рис, васаби',
    price: 190,
    grams: 48,
    color: 'from-[#fb7185] via-[#fecdd3] to-[#fff1f2]',
    imageSrc: '/images/sushi-2.png',
  },
  {
    id: 'ebi-sushi',
    name: 'Суши креветка',
    category: 'Суши',
    ingredients: 'Креветка, рис, нори',
    price: 180,
    grams: 45,
    color: 'from-[#f97316] via-[#fed7aa] to-[#fff7ed]',
    imageSrc: '/images/sushi-3.png',
  },
  {
    id: 'tuna-sushi',
    name: 'Суши тунец',
    category: 'Суши',
    ingredients: 'Тунец, рис, васаби',
    price: 210,
    grams: 48,
    color: 'from-[#ef4444] via-[#fca5a5] to-[#fee2e2]',
    imageSrc: '/images/sushi-4.png',
  },
  {
    id: 'pepperoni',
    name: 'Пепперони',
    category: 'Пицца',
    ingredients: 'Пепперони, моцарелла, томатный соус',
    price: 790,
    grams: 520,
    color: 'from-[#dc2626] via-[#fb923c] to-[#ffedd5]',
    imageSrc: '/images/pizza-1.png',
  },
  {
    id: 'cheese-pizza',
    name: 'Сырная пицца',
    category: 'Пицца',
    ingredients: 'Моцарелла, гауда, пармезан, сливочный соус',
    price: 690,
    grams: 500,
    color: 'from-[#facc15] via-[#fde68a] to-[#fff7ed]',
    imageSrc: '/images/pizza-2.png',
  },
  {
    id: 'chicken-pizza',
    name: 'Куриная пицца',
    category: 'Пицца',
    ingredients: 'Курица, шампиньоны, моцарелла, томатный соус',
    price: 760,
    grams: 540,
    color: 'from-[#fb923c] via-[#fdba74] to-[#fff7ed]',
    imageSrc: '/images/pizza-3.png',
  },
  {
    id: 'fries',
    name: 'Картофель фри',
    category: 'Закуски',
    ingredients: 'Хрустящий картофель, соль, соус на выбор',
    price: 240,
    grams: 160,
    color: 'from-[#facc15] via-[#fde68a] to-[#fff7ed]',
    imageSrc: '/images/fries.png',
  },
];

const promos: Promo[] = [
  {
    id: 'telegram',
    title: 'Купон за подписку',
    terms:
      'Подпишитесь на канал и получите купон на первый заказ. Размер скидки и правила применения задаются в админ-панели.',
    color: 'from-[#229ed9] to-[#8bd7ff]',
  },
  {
    id: 'free-delivery',
    title: 'Бесплатная доставка',
    terms:
      'Доставка в радиусе 5 км становится бесплатной при достижении порога заказа. Порог регулируется администратором.',
    color: 'from-[#16a34a] to-[#bbf7d0]',
  },
  {
    id: 'sets',
    title: 'Сеты выгоднее',
    terms:
      'В сетах часть комплектации уже включена: соус, палочки, имбирь и васаби. Состав регулируется в карточке блюда.',
    color: 'from-[#f97316] to-[#fed7aa]',
  },
];

const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const availableAreaWords = ['внуково', 'пыхтино', 'рассказовка', 'солнцево'];
const defaultMapCenter: [number, number] = [55.6119, 37.2967];
const motionDurationMs = 220;
const yandexMapsApiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

declare global {
  interface Window {
    ymaps?: YMapsApi;
  }
}

type YMapsApi = {
  ready: (callback: () => void) => void;
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => YandexMapInstance;
  Placemark: new (
    coords: [number, number],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YandexPlacemark;
  geocode: (value: string | [number, number]) => Promise<YandexGeocodeResult>;
};

type YandexMapInstance = {
  destroy: () => void;
  setCenter: (coords: [number, number], zoom?: number) => void;
  geoObjects: {
    add: (geoObject: YandexPlacemark) => void;
  };
  events: {
    add: (eventName: string, callback: (event: YandexMapEvent) => void) => void;
  };
};

type YandexPlacemark = {
  geometry: {
    setCoordinates: (coords: [number, number]) => void;
    getCoordinates: () => [number, number];
  };
  events: {
    add: (eventName: string, callback: () => void) => void;
  };
};

type YandexMapEvent = {
  get: (key: string) => [number, number];
};

type YandexGeocodeResult = {
  geoObjects: {
    get: (index: number) =>
      | {
          getAddressLine?: () => string;
          geometry?: {
            getCoordinates?: () => [number, number];
          };
        }
      | undefined;
  };
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [draftAddress, setDraftAddress] = useState(
    'Москва, Внуково, Центральная улица, 8',
  );
  const [addressPromptOpen, setAddressPromptOpen] = useState(true);
  const [mapOpen, setMapOpen] = useState(false);
  const [deliveryDeniedOpen, setDeliveryDeniedOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [cartCount, setCartCount] = useState(0);
  const categorySectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const dishesByCategory = useMemo(() => {
    return categories.map((category) => ({
      category,
      dishes: dishes.filter((dish) => dish.category === category),
    }));
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return dishes;
    }

    return dishes.filter((dish) => {
      return (
        dish.name.toLowerCase().includes(query) ||
        dish.ingredients.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  useEffect(() => {
    const updateActiveCategory = () => {
      const activationLine = 150;
      let activeCategory = categories[0];

      for (const category of categories) {
        const section = categorySectionRefs.current[category];

        if (!section) {
          continue;
        }

        if (section.getBoundingClientRect().top <= activationLine) {
          activeCategory = category;
        }
      }

      setSelectedCategory((currentCategory) => {
        return currentCategory === activeCategory
          ? currentCategory
          : activeCategory;
      });
    };

    updateActiveCategory();
    window.addEventListener('scroll', updateActiveCategory, { passive: true });

    return () => window.removeEventListener('scroll', updateActiveCategory);
  }, []);

  useEffect(() => {
    categoryTabRefs.current[selectedCategory]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [selectedCategory]);

  const scrollToCategory = (category: string) => {
    setSelectedCategory(category);
    categorySectionRefs.current[category]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const confirmAddress = () => {
    const normalized = draftAddress.toLowerCase();
    const isAvailable = availableAreaWords.some((word) =>
      normalized.includes(word),
    );

    if (!isAvailable) {
      setMapOpen(false);
      setAddressPromptOpen(false);
      setDeliveryDeniedOpen(true);
      return;
    }

    setAddress(draftAddress);
    setMapOpen(false);
    setAddressPromptOpen(false);
  };

  if (mapOpen) {
    return (
      <YandexMapPicker
        value={draftAddress}
        onBack={() => {
          setMapOpen(false);
          setAddressPromptOpen(true);
        }}
        onChange={setDraftAddress}
        onConfirm={confirmAddress}
      />
    );
  }

  return (
    <main className="mobile-app min-h-screen bg-[#F1EBE6] text-[#171512]">
      <div
        className={`mx-auto min-h-screen w-full max-w-[430px] bg-[#F1EBE6] pb-28 transition duration-200 ${
          addressPromptOpen || deliveryDeniedOpen ? 'blur-[3px]' : ''
        }`}
      >
        <header className="sticky top-0 z-20 bg-[#F1EBE6]/92 px-4 pb-3 pt-4 backdrop-blur">
          <button
            className="text-left"
            onClick={() => setAddressPromptOpen(true)}
          >
            <span className="block text-xs font-semibold text-[#a54b35]">
              Доставка
            </span>
            <span className="mt-0.5 block max-w-[330px] truncate text-sm text-[#8a8277]">
              {address || 'укажите адрес'}
            </span>
          </button>
        </header>

        <section className="px-4 pt-5">
          <h1 className="text-2xl font-semibold tracking-tight">Акции</h1>
          <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
            {promos.map((promo) => (
              <button
                key={promo.id}
                className="relative h-[148px] w-[148px] shrink-0 snap-start overflow-hidden rounded-[12px] text-left shadow-[0_12px_32px_rgba(39,32,20,0.12)]"
                onClick={() => setSelectedPromo(promo)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${promo.color}`} />
                <Image
                  src="/images/sushi-hero.png"
                  alt=""
                  fill
                  className="object-cover opacity-35 mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-lg font-semibold leading-5 text-white">
                  {promo.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="sticky top-[61px] z-10 bg-[#F1EBE6]/94 py-3 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
            <Button
              size="icon"
              variant="secondary"
              className="h-12 w-12 shrink-0 rounded-[8px] bg-[#AA131B] font-normal text-white hover:bg-[#8f1016]"
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
            >
              <Search className="h-4 w-4" />
            </Button>
            {categories.map((category) => (
              <button
                key={category}
                className={`h-12 shrink-0 rounded-[8px] px-4 text-sm font-normal transition ${
                  selectedCategory === category
                    ? 'bg-[#AA131B] text-white'
                    : 'bg-[#FCD997] text-[#171512]'
                }`}
                onClick={() => scrollToCategory(category)}
                ref={(element) => {
                  categoryTabRefs.current[category] = element;
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-6 px-4 pt-4">
          {dishesByCategory.map(({ category, dishes }) => (
            <section
              key={category}
              ref={(element) => {
                categorySectionRefs.current[category] = element;
              }}
              className="scroll-mt-[124px]"
            >
              <h2 className="mb-3 text-xl font-semibold tracking-tight">
                {category}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onAdd={() => setCartCount((count) => count + 1)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {cartCount > 0 && !addressPromptOpen && (
        <div className="fixed inset-x-0 bottom-4 z-30 mx-auto w-full max-w-[430px] px-4">
          <Button className="h-12 w-full rounded-[8px] bg-[#AA131B] text-base font-normal text-white shadow-[0_16px_40px_rgba(23,21,18,0.28)] hover:bg-[#8f1016]">
            <ShoppingBag className="h-5 w-5" />
            Корзина · {cartCount}
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
        </div>
      )}

      <FadePresence show={addressPromptOpen}>
        {(isLeaving) => (
          <div
            className={`fixed inset-0 z-40 flex items-center justify-center bg-black/48 px-5 ${
              isLeaving ? 'mobile-soft-overlay-out' : 'mobile-soft-overlay-in'
            }`}
          >
            <section
              className={`w-full max-w-[360px] rounded-[8px] bg-white p-4 shadow-[0_20px_70px_rgba(0,0,0,0.28)] ${
                isLeaving ? 'mobile-soft-dialog-out' : 'mobile-soft-dialog-in'
              }`}
            >
              <h2 className="text-xl font-semibold">Ваш адрес</h2>
              <button
                className="mt-4 flex h-12 w-full items-center gap-3 rounded-[8px] border border-[#e4ddd1] bg-[#F1EBE6] px-3 text-left font-normal text-[#62594f]"
                onClick={() => {
                  setAddressPromptOpen(false);
                  setMapOpen(true);
                }}
              >
                <MapPin className="h-5 w-5 text-[#AA131B]" />
                <span className="truncate">{address || 'укажите адрес'}</span>
              </button>
            </section>
          </div>
        )}
      </FadePresence>

      {selectedPromo && (
        <BottomSheet onClose={() => setSelectedPromo(null)}>
          <div className="relative aspect-square overflow-hidden rounded-[8px]">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${selectedPromo.color}`}
            />
            <Image
              src="/images/sushi-hero.png"
              alt=""
              fill
              className="object-cover opacity-50 mix-blend-multiply"
            />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight">
            {selectedPromo.title}
          </h2>
          <p className="mt-2 text-base leading-6 text-[#62594f]">
            {selectedPromo.terms}
          </p>
        </BottomSheet>
      )}

      {searchOpen && (
        <BottomSheet onClose={() => setSearchOpen(false)}>
          <div className="flex h-12 items-center gap-2 rounded-[8px] border border-[#d8cbc0] bg-[#F1EBE6] px-3">
            <Search className="h-5 w-5 text-[#8a8277]" />
            <Input
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-12 border-0 bg-transparent px-0 text-base font-normal shadow-none focus-visible:ring-0"
              placeholder="Поиск по блюду или ингредиенту"
            />
          </div>
          <div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pb-2">
            {searchResults.map((dish) => (
              <button
                key={dish.id}
                className="flex w-full items-center gap-3 rounded-[12px] bg-[#F1EBE6] p-3 text-left"
                onClick={() => {
                  scrollToCategory(dish.category);
                  setSearchOpen(false);
                }}
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-[#F1EBE6]">
                  <Image
                    src={dish.imageSrc}
                    alt=""
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{dish.name}</p>
                  <p className="truncate text-sm text-[#766e63]">
                    {dish.ingredients}
                  </p>
                </div>
                <span className="ml-auto shrink-0 font-semibold">
                  {money.format(dish.price)}
                </span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      <FadePresence show={deliveryDeniedOpen}>
        {(isLeaving) => (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/42 px-5 ${
              isLeaving ? 'mobile-soft-overlay-out' : 'mobile-soft-overlay-in'
            }`}
          >
            <section
              className={`w-full max-w-[360px] rounded-[8px] bg-white p-5 text-center shadow-[0_20px_70px_rgba(0,0,0,0.28)] ${
                isLeaving ? 'mobile-soft-dialog-out' : 'mobile-soft-dialog-in'
              }`}
            >
              <div className="relative mx-auto h-36 w-36">
                <Image
                  src="/images/sad-roll.png"
                  alt="Грустная ролла"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="mt-3 text-xl font-semibold">
                К сожалению, доставка не доступна на ваш адрес
              </h2>
              <p className="mt-2 text-sm leading-5 text-[#766e63]">
                Пока доставляем в радиусе 5 км от филиала во Внуково.
              </p>
              <Button
                className="mt-5 h-12 w-full rounded-[8px] bg-[#AA131B] font-normal text-white hover:bg-[#8f1016]"
                onClick={() => {
                  setDeliveryDeniedOpen(false);
                  setTimeout(
                    () => setAddressPromptOpen(true),
                    motionDurationMs,
                  );
                }}
              >
                Указать другой адрес
              </Button>
            </section>
          </div>
        )}
      </FadePresence>
    </main>
  );
}

function YandexMapPicker({
  value,
  onBack,
  onChange,
  onConfirm,
}: {
  value: string;
  onBack: () => void;
  onChange: (value: string) => void;
  onConfirm: () => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const placemarkRef = useRef<YandexPlacemark | null>(null);
  const ymapsRef = useRef<YMapsApi | null>(null);
  const reverseGeocodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [status, setStatus] = useState<
    'missing-key' | 'loading' | 'ready' | 'error'
  >(yandexMapsApiKey ? 'loading' : 'missing-key');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!yandexMapsApiKey) {
      setStatus('missing-key');
      return;
    }

    if (window.ymaps) {
      window.ymaps.ready(() => setStatus('ready'));
      return;
    }

    const scriptId = 'yandex-maps-api';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.ymaps?.ready(() => setStatus('ready'));
      });
      existingScript.addEventListener('error', () => setStatus('error'));
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(
      yandexMapsApiKey,
    )}&lang=ru_RU`;
    script.async = true;
    script.onload = () => window.ymaps?.ready(() => setStatus('ready'));
    script.onerror = () => setStatus('error');
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (status !== 'ready' || !window.ymaps || !mapContainerRef.current) {
      return;
    }

    const ymaps = window.ymaps;
    ymapsRef.current = ymaps;

    const updateAddressByCoordinates = (coords: [number, number]) => {
      if (reverseGeocodeTimeoutRef.current) {
        clearTimeout(reverseGeocodeTimeoutRef.current);
      }

      reverseGeocodeTimeoutRef.current = setTimeout(() => {
        ymaps
          .geocode(coords)
          .then((result) => {
            const geoObject = result.geoObjects.get(0);
            const addressLine = geoObject?.getAddressLine?.();

            if (addressLine) {
              onChange(addressLine);
              setNotice('');
            }
          })
          .catch(() => {
            setNotice('Не получилось определить адрес по точке на карте.');
          });
      }, 250);
    };

    const moveMarker = (coords: [number, number], shouldCenter = false) => {
      placemarkRef.current?.geometry.setCoordinates(coords);

      if (shouldCenter) {
        mapRef.current?.setCenter(coords, 16);
      }

      updateAddressByCoordinates(coords);
    };

    const map = new ymaps.Map(mapContainerRef.current, {
      center: defaultMapCenter,
      controls: ['zoomControl'],
      zoom: 14,
    });
    const placemark = new ymaps.Placemark(
      defaultMapCenter,
      {},
      {
        draggable: true,
        preset: 'islands#redDotIcon',
      },
    );

    map.geoObjects.add(placemark);
    mapRef.current = map;
    placemarkRef.current = placemark;

    map.events.add('click', (event) => moveMarker(event.get('coords')));
    placemark.events.add('dragend', () => {
      moveMarker(placemark.geometry.getCoordinates());
    });

    if (value) {
      ymaps
        .geocode(value)
        .then((result) => {
          const coords = result.geoObjects.get(0)?.geometry?.getCoordinates?.();

          if (coords) {
            moveMarker(coords, true);
          }
        })
        .catch(() => undefined);
    }

    return () => {
      if (reverseGeocodeTimeoutRef.current) {
        clearTimeout(reverseGeocodeTimeoutRef.current);
      }

      map.destroy();
      mapRef.current = null;
      placemarkRef.current = null;
    };
  }, [status]);

  const searchAddressOnMap = () => {
    const ymaps = ymapsRef.current;

    if (!ymaps || !value.trim()) {
      return;
    }

    ymaps
      .geocode(value)
      .then((result) => {
        const coords = result.geoObjects.get(0)?.geometry?.getCoordinates?.();

        if (!coords) {
          setNotice('Не нашли такой адрес. Попробуйте уточнить улицу и дом.');
          return;
        }

        placemarkRef.current?.geometry.setCoordinates(coords);
        mapRef.current?.setCenter(coords, 16);
        setNotice('');
      })
      .catch(() => {
        setNotice('Не удалось найти адрес на карте.');
      });
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      setNotice('Геолокация недоступна в этом браузере.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        placemarkRef.current?.geometry.setCoordinates(coords);
        mapRef.current?.setCenter(coords, 16);
        ymapsRef.current
          ?.geocode(coords)
          .then((result) => {
            const addressLine = result.geoObjects.get(0)?.getAddressLine?.();

            if (addressLine) {
              onChange(addressLine);
            }

            setNotice('');
          })
          .catch(() => {
            setNotice('Геолокация найдена, но адрес определить не удалось.');
          });
      },
      () => {
        setNotice('Разрешите доступ к геолокации или введите адрес вручную.');
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <main className="mobile-app relative min-h-screen overflow-hidden bg-[#F1EBE6] text-[#171512]">
      <div
        ref={mapContainerRef}
        className="absolute inset-0"
        aria-label="Карта выбора адреса"
      />

      {status !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center bg-[#F1EBE6] px-5 text-center">
          <div className="rounded-[8px] bg-white p-5 shadow-[0_18px_55px_rgba(23,21,18,0.16)]">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#AA131B]" />
                <p className="mt-3 font-semibold">Загружаем Яндекс Карты</p>
              </>
            )}
            {status === 'missing-key' && (
              <>
                <MapPin className="mx-auto h-8 w-8 text-[#AA131B]" />
                <p className="mt-3 font-semibold">Нужен ключ Яндекс Карт</p>
                <p className="mt-2 text-sm leading-5 text-[#766e63]">
                  Добавьте `VITE_YANDEX_MAPS_API_KEY` в переменные окружения.
                </p>
              </>
            )}
            {status === 'error' && (
              <>
                <MapPin className="mx-auto h-8 w-8 text-[#AA131B]" />
                <p className="mt-3 font-semibold">Карта не загрузилась</p>
                <p className="mt-2 text-sm leading-5 text-[#766e63]">
                  Проверьте API-ключ и ограничения домена в кабинете Яндекса.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-[8px] bg-[#FCD997] font-normal shadow-sm hover:bg-[#f4cd83]"
          onClick={onBack}
          aria-label="Назад"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-[8px] bg-[#FCD997] font-normal shadow-sm hover:bg-[#f4cd83]"
          onClick={locateUser}
          aria-label="Определить местоположение"
        >
          <LocateFixed className="h-5 w-5 text-[#AA131B]" />
        </Button>
      </div>

      <section className="fixed inset-x-0 bottom-0 z-20 rounded-t-[8px] bg-white px-4 pb-5 pt-4 shadow-[0_-18px_55px_rgba(23,21,18,0.18)]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-[8px] bg-[#d8d1c7]" />
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                searchAddressOnMap();
              }
            }}
            className="h-12 rounded-[8px] border-[#e4ddd1] bg-[#F1EBE6] text-base font-normal"
            placeholder="Введите адрес"
          />
          <Button
            size="icon"
            variant="secondary"
            className="h-12 w-12 shrink-0 rounded-[8px] bg-[#FCD997] font-normal"
            onClick={searchAddressOnMap}
            aria-label="Найти адрес"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        {notice && <p className="mt-2 text-sm text-[#a54b35]">{notice}</p>}
        <Button
          className="mt-3 h-12 w-full rounded-[8px] bg-[#AA131B] text-base font-normal text-white hover:bg-[#8f1016]"
          onClick={onConfirm}
        >
          Подтвердить
        </Button>
      </section>
    </main>
  );
}

function DishCard({ dish, onAdd }: { dish: Dish; onAdd: () => void }) {
  return (
    <article className="flex min-h-[278px] flex-col rounded-[12px] bg-white p-2.5 shadow-[0_8px_26px_rgba(39,32,20,0.06)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-[#F1EBE6]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${dish.color} opacity-18`}
        />
        <Image
          src={dish.imageSrc}
          alt={dish.name}
          fill
          className="object-contain p-2.5"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col pt-2.5">
        <div className="min-w-0">
          <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">
            {dish.name}
          </h2>
          <p className="mt-0.5 text-xs text-[#8a8277]">{dish.grams} г</p>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#62594f]">
          {dish.ingredients}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="text-base font-semibold">{money.format(dish.price)}</p>
          <Button
            size="icon"
            className="h-12 w-12 rounded-[8px] bg-[#6BB47F] font-normal text-white hover:bg-[#5da06f]"
            onClick={onAdd}
            aria-label={`Добавить ${dish.name}`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function FadePresence({
  show,
  children,
}: {
  show: boolean;
  children: (isLeaving: boolean) => React.ReactNode;
}) {
  const [shouldRender, setShouldRender] = useState(show);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsLeaving(false);
      return undefined;
    }

    if (!shouldRender) {
      return undefined;
    }

    setIsLeaving(true);
    const timeoutId = setTimeout(() => {
      setShouldRender(false);
      setIsLeaving(false);
    }, motionDurationMs);

    return () => clearTimeout(timeoutId);
  }, [show, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return children(isLeaving);
}

function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const requestClose = () => {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);
    closeTimeoutRef.current = setTimeout(onClose, motionDurationMs);
  };

  const closeBySwipe = (endY: number) => {
    if (touchStart !== null && endY - touchStart > 70) {
      requestClose();
    }

    setTouchStart(null);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/42 pt-5 ${
        isLeaving
          ? 'mobile-bottom-sheet-backdrop-out'
          : 'mobile-bottom-sheet-backdrop-in'
      }`}
    >
      <section
        className={`fixed inset-x-0 bottom-0 rounded-t-[8px] bg-white px-4 pb-6 pt-3 shadow-[0_-18px_60px_rgba(0,0,0,0.22)] ${
          isLeaving
            ? 'mobile-bottom-sheet-panel-out'
            : 'mobile-bottom-sheet-panel-in'
        }`}
        onTouchStart={(event) => setTouchStart(event.touches[0].clientY)}
        onTouchEnd={(event) => closeBySwipe(event.changedTouches[0].clientY)}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-[8px] bg-[#d8d1c7]" />
        <button
          className="absolute right-4 top-3 grid h-12 w-12 place-items-center rounded-[8px] bg-[#FCD997] font-normal"
          onClick={requestClose}
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto w-full max-w-[430px]">{children}</div>
      </section>
    </div>
  );
}
