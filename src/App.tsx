import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronRight,
  MapPin,
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
const motionDurationMs = 220;

export default function Home() {
  const [address, setAddress] = useState('');
  const [draftAddress, setDraftAddress] = useState(
    'Москва, Внуково, Центральная улица, 8',
  );
  const [addressPromptOpen, setAddressPromptOpen] = useState(true);
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
      setAddressPromptOpen(false);
      setDeliveryDeniedOpen(true);
      return;
    }

    setAddress(draftAddress);
    setAddressPromptOpen(false);
  };

  return (
    <main className="mobile-app min-h-screen bg-[#F6F1EC] text-[#171512]">
      <div
        className={`mx-auto min-h-screen w-full max-w-[1120px] bg-[#F6F1EC] pb-28 transition duration-200 ${
          addressPromptOpen || deliveryDeniedOpen ? 'blur-[3px]' : ''
        }`}
      >
        <header className="sticky top-0 z-20 bg-[#F6F1EC]/95 px-4 pb-2 pt-3 backdrop-blur">
          <button
            className="flex w-full max-w-[360px] items-center gap-2 text-left"
            onClick={() => setAddressPromptOpen(true)}
          >
            <MapPin className="h-4 w-4 shrink-0 text-[#B52227]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-normal text-[#8A7F77]">
                Доставка
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium text-[#171512]">
                {address || 'Центральная, 8 · Внуково'}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#8A7F77]" />
          </button>
        </header>

        <section className="px-4 pt-4">
          <h1 className="text-xl font-semibold">Акции</h1>
          <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {promos.map((promo) => (
              <button
                key={promo.id}
                className="relative h-[132px] w-[132px] shrink-0 snap-start overflow-hidden rounded-[12px] bg-[#171512] text-left shadow-[0_3px_12px_rgba(39,32,20,0.06)] sm:h-[156px] sm:w-[156px]"
                onClick={() => setSelectedPromo(promo)}
              >
                <Image
                  src="/images/sushi-hero.png"
                  alt=""
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/35" />
                <span className="absolute bottom-3 left-3 right-3 text-lg font-semibold leading-5 text-white">
                  {promo.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="sticky top-[52px] z-10 bg-[#F6F1EC]/95 py-2 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
            <Button
              size="icon"
              variant="secondary"
              className="h-11 w-11 shrink-0 rounded-[8px] bg-[#B52227] font-normal text-white hover:bg-[#991d21]"
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
            >
              <Search className="h-4 w-4" />
            </Button>
            {categories.map((category) => (
              <button
                key={category}
                className={`h-11 shrink-0 rounded-[8px] px-4 text-sm font-normal transition ${
                  selectedCategory === category
                    ? 'bg-[#B52227] text-white'
                    : 'bg-[#ECE5DE] text-[#171512]'
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
              className="scroll-mt-[108px]"
            >
              <h2 className="mb-3 text-xl font-semibold">{category}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
          <Button className="h-11 w-full rounded-[8px] bg-[#B52227] text-base font-normal text-white shadow-[0_6px_18px_rgba(181,34,39,0.14)] hover:bg-[#991d21]">
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
              className={`w-full max-w-[360px] rounded-[8px] bg-white p-4 shadow-[0_16px_44px_rgba(0,0,0,0.18)] ${
                isLeaving ? 'mobile-soft-dialog-out' : 'mobile-soft-dialog-in'
              }`}
            >
              <h2 className="text-xl font-semibold">Ваш адрес</h2>
              <div className="mt-4 flex h-11 items-center gap-3 rounded-[8px] border border-[#E7E3DF] bg-[#F6F1EC] px-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#B52227]" />
                <Input
                  autoFocus
                  value={draftAddress}
                  onChange={(event) => setDraftAddress(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      confirmAddress();
                    }
                  }}
                  className="h-11 border-0 bg-transparent px-0 text-base font-normal text-[#171512] shadow-none focus-visible:ring-0"
                  placeholder="Введите адрес"
                />
              </div>
              <Button
                className="mt-3 h-11 w-full rounded-[8px] bg-[#B52227] text-base font-normal text-white hover:bg-[#991d21]"
                onClick={confirmAddress}
              >
                Подтвердить
              </Button>
            </section>
          </div>
        )}
      </FadePresence>

      {selectedPromo && (
        <BottomSheet onClose={() => setSelectedPromo(null)}>
          <div className="relative aspect-square overflow-hidden rounded-[8px] bg-[#171512]">
            <Image
              src="/images/sushi-hero.png"
              alt=""
              fill
              className="object-cover opacity-90"
            />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">
            {selectedPromo.title}
          </h2>
          <p className="mt-2 text-base leading-6 text-[#62594f]">
            {selectedPromo.terms}
          </p>
        </BottomSheet>
      )}

      {searchOpen && (
        <BottomSheet onClose={() => setSearchOpen(false)}>
          <div className="flex h-11 items-center gap-2 rounded-[8px] border border-[#E7E3DF] bg-[#F6F1EC] px-3">
            <Search className="h-5 w-5 text-[#8a8277]" />
            <Input
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 border-0 bg-transparent px-0 text-base font-normal shadow-none focus-visible:ring-0"
              placeholder="Поиск по блюду или ингредиенту"
            />
          </div>
          <div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pb-2">
            {searchResults.map((dish) => (
              <button
                key={dish.id}
                className="flex w-full items-center gap-3 rounded-[12px] bg-[#F6F1EC] p-3 text-left"
                onClick={() => {
                  scrollToCategory(dish.category);
                  setSearchOpen(false);
                }}
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-[#FFFDFC]">
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
              className={`w-full max-w-[360px] rounded-[8px] bg-white p-5 text-center shadow-[0_16px_44px_rgba(0,0,0,0.18)] ${
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
                className="mt-5 h-11 w-full rounded-[8px] bg-[#B52227] font-normal text-white hover:bg-[#991d21]"
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

function DishCard({ dish, onAdd }: { dish: Dish; onAdd: () => void }) {
  return (
    <article className="flex h-full flex-col rounded-[22px] border border-[#E8E8E8] bg-white p-2 shadow-none">
      <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-[#F1EEE9]">
        <Image
          src={dish.imageSrc}
          alt={dish.name}
          fill
          className="scale-110 object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-2 pb-2 pt-4">
        <div className="min-w-0">
          <h2 className="line-clamp-2 min-h-10 text-base font-semibold leading-[1.22] text-[#111111] sm:min-h-[52px] sm:text-xl lg:text-[21px]">
            {dish.name}
          </h2>
          <p className="mt-2 text-sm font-medium leading-[1.3] text-[#606060] sm:text-base">
            {dish.grams} г
          </p>
        </div>
        <p className="mt-2 line-clamp-2 min-h-[34px] text-xs font-normal leading-[1.35] text-[#666666] sm:text-sm">
          {dish.ingredients}
        </p>
        <Button
          className="mt-4 flex h-14 w-full items-center justify-between rounded-[16px] bg-[#F3F3F3] px-5 text-[#1A1A1A] shadow-none hover:bg-[#EDEDED]"
          onClick={onAdd}
          aria-label={`Добавить ${dish.name}`}
        >
          <span className="text-xl font-semibold sm:text-[21px]">
            {money.format(dish.price)}
          </span>
          <span className="text-4xl font-light leading-none">+</span>
        </Button>
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
        className={`fixed inset-x-0 bottom-0 rounded-t-[8px] bg-white px-4 pb-6 pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.14)] ${
          isLeaving
            ? 'mobile-bottom-sheet-panel-out'
            : 'mobile-bottom-sheet-panel-in'
        }`}
        onTouchStart={(event) => setTouchStart(event.touches[0].clientY)}
        onTouchEnd={(event) => closeBySwipe(event.changedTouches[0].clientY)}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-[8px] bg-[#d8d1c7]" />
        <button
          className="absolute right-4 top-3 grid h-11 w-11 place-items-center rounded-[8px] bg-[#ECE5DE] font-normal text-[#171512]"
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
