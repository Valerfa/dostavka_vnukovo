'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Crosshair,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Dish = {
  id: string;
  name: string;
  category: string;
  ingredients: string;
  price: number;
  grams: number;
  color: string;
};

type Promo = {
  id: string;
  title: string;
  terms: string;
  color: string;
};

const categories = ['Сеты', 'Роллы', 'Суши', 'Запеченные', 'Напитки'];

const dishes: Dish[] = [
  {
    id: 'set-vnukovo',
    name: 'Внуково сет',
    category: 'Сеты',
    ingredients: 'Филадельфия, Калифорния, унаги маки, имбирь, васаби',
    price: 1990,
    grams: 960,
    color: 'from-[#ff6b45] via-[#ffb15c] to-[#ffe1a8]',
  },
  {
    id: 'philadelphia',
    name: 'Филадельфия',
    category: 'Роллы',
    ingredients: 'Лосось, сливочный сыр, огурец, рис, нори',
    price: 690,
    grams: 285,
    color: 'from-[#fb7185] via-[#fb923c] to-[#fed7aa]',
  },
  {
    id: 'tokyo',
    name: 'Токио спайси',
    category: 'Роллы',
    ingredients: 'Креветка, снежный краб, тобико, спайси соус',
    price: 640,
    grams: 270,
    color: 'from-[#34d399] via-[#a3e635] to-[#fef3c7]',
  },
  {
    id: 'unagi',
    name: 'Унаги маки',
    category: 'Суши',
    ingredients: 'Угорь, огурец, кунжут, унаги соус',
    price: 540,
    grams: 220,
    color: 'from-[#1f2937] via-[#64748b] to-[#cbd5e1]',
  },
  {
    id: 'baked-salmon',
    name: 'Запеченный лосось',
    category: 'Запеченные',
    ingredients: 'Лосось, сырный соус, рис, нори, кунжут',
    price: 620,
    grams: 300,
    color: 'from-[#dc2626] via-[#fb923c] to-[#fde68a]',
  },
  {
    id: 'mango-tea',
    name: 'Манго чай',
    category: 'Напитки',
    ingredients: 'Черный чай, манго, лимон, лед',
    price: 220,
    grams: 400,
    color: 'from-[#facc15] via-[#fb923c] to-[#fdba74]',
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
  const [selectedCategory, setSelectedCategory] = useState('Сеты');
  const [cartCount, setCartCount] = useState(0);
  const [sheetTouchStart, setSheetTouchStart] = useState<number | null>(null);

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => dish.category === selectedCategory);
  }, [selectedCategory]);

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

  const closeSheetBySwipe = (endY: number, close: () => void) => {
    if (sheetTouchStart !== null && endY - sheetTouchStart > 70) {
      close();
    }
    setSheetTouchStart(null);
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
      <main className="relative min-h-screen overflow-hidden bg-[#e8efe5] text-[#171512]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute left-[-12%] top-[18%] h-36 w-[130%] rotate-[-18deg] rounded-full bg-[#f5efe4]" />
        <div className="absolute left-[-10%] top-[52%] h-28 w-[120%] rotate-[14deg] rounded-full bg-[#d6e6d1]" />
        <div className="absolute left-[18%] top-[10%] h-24 w-24 rounded-[28px] bg-[#d5e6ff]" />
        <div className="absolute bottom-[22%] right-[12%] h-28 w-28 rounded-[32px] bg-[#f7d7b5]" />

        <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
          <Button
            size="icon"
            variant="secondary"
            className="h-11 w-11 rounded-full bg-white shadow-sm"
            onClick={() => {
              setMapOpen(false);
              setAddressPromptOpen(true);
            }}
            aria-label="Назад"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-11 w-11 rounded-full bg-white shadow-sm"
            onClick={() =>
              setDraftAddress('Москва, Внуково, улица Летчика Грицевца, 5')
            }
            aria-label="Определить местоположение"
          >
            <LocateFixed className="h-5 w-5 text-[#e34d2f]" />
          </Button>
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
          <MapPin className="h-12 w-12 fill-[#e34d2f] text-[#e34d2f] drop-shadow-md" />
        </div>
        <button
          className="absolute left-[26%] top-[38%] z-10 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm"
          onClick={() =>
            setDraftAddress('Москва, Внуково, улица Авиаконструктора Петлякова, 13')
          }
        >
          Авиаконструктора Петлякова
        </button>
        <button
          className="absolute right-[16%] top-[55%] z-10 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm"
          onClick={() => setDraftAddress('Москва, Пыхтино, улица Летчика Ульянина, 7')}
        >
          Пыхтино
        </button>
        <button
          className="absolute bottom-[33%] left-[14%] z-10 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm"
          onClick={() => setDraftAddress('Москва, Тверская улица, 1')}
        >
          Вне радиуса
        </button>

        <section className="fixed inset-x-0 bottom-0 z-20 rounded-t-[28px] bg-white px-4 pb-5 pt-4 shadow-[0_-18px_55px_rgba(23,21,18,0.18)]">
          <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#d8d1c7]" />
          <Input
            value={draftAddress}
            onChange={(event) => setDraftAddress(event.target.value)}
            className="h-12 rounded-2xl border-[#e4ddd1] bg-[#f8f5ef] text-base"
            placeholder="Введите адрес"
          />
          <Button
            className="mt-3 h-12 w-full rounded-2xl bg-[#e34d2f] text-base text-white hover:bg-[#ca4025]"
            onClick={confirmAddress}
          >
            Подтвердить
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#171512]">
      <div
        className={`mx-auto min-h-screen w-full max-w-[430px] bg-[#fffdf9] pb-28 transition duration-200 ${
          addressPromptOpen ? 'blur-[3px]' : ''
        }`}
      >
        <header className="sticky top-0 z-20 border-b border-[#eee5d8] bg-[#fffdf9]/92 px-4 pb-3 pt-4 backdrop-blur">
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
                className="relative h-[148px] w-[148px] shrink-0 snap-start overflow-hidden rounded-[22px] text-left shadow-[0_12px_32px_rgba(39,32,20,0.12)]"
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

        <section className="sticky top-[61px] z-10 border-b border-[#eee5d8] bg-[#fffdf9]/94 py-3 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 shrink-0 rounded-full bg-[#171512] text-white hover:bg-[#302c25]"
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
            >
              <Search className="h-4 w-4" />
            </Button>
            {categories.map((category) => (
              <button
                key={category}
                className={`h-10 shrink-0 rounded-full px-4 text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-[#e34d2f] text-white'
                    : 'bg-[#f1eadf] text-[#62594f]'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 px-4 pt-4">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onAdd={() => setCartCount((count) => count + 1)}
            />
          ))}
        </section>
      </div>

      {cartCount > 0 && !addressPromptOpen && (
        <div className="fixed inset-x-0 bottom-4 z-30 mx-auto w-full max-w-[430px] px-4">
          <Button className="h-14 w-full rounded-2xl bg-[#171512] text-base text-white shadow-[0_16px_40px_rgba(23,21,18,0.28)] hover:bg-[#302c25]">
            <ShoppingBag className="h-5 w-5" />
            Корзина · {cartCount}
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
        </div>
      )}

      {addressPromptOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/48 px-5">
          <section className="w-full max-w-[360px] rounded-[28px] bg-white p-4 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
            <h2 className="text-xl font-semibold">Ваш адрес</h2>
            <button
              className="mt-4 flex h-12 w-full items-center gap-3 rounded-2xl border border-[#e4ddd1] bg-[#f8f5ef] px-3 text-left text-[#62594f]"
              onClick={() => setMapOpen(true)}
            >
              <MapPin className="h-5 w-5 text-[#e34d2f]" />
              <span className="truncate">{address || 'укажите адрес'}</span>
            </button>
          </section>
        </div>
      )}

      {selectedPromo && (
        <BottomSheet
          onClose={() => setSelectedPromo(null)}
          onTouchStart={(value) => setSheetTouchStart(value)}
          onTouchEnd={(value) =>
            closeSheetBySwipe(value, () => setSelectedPromo(null))
          }
        >
          <div className="relative aspect-square overflow-hidden rounded-[24px]">
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
        <BottomSheet
          onClose={() => setSearchOpen(false)}
          onTouchStart={(value) => setSheetTouchStart(value)}
          onTouchEnd={(value) => closeSheetBySwipe(value, () => setSearchOpen(false))}
        >
          <div className="flex items-center gap-2 rounded-2xl bg-[#f1eadf] px-3">
            <Search className="h-5 w-5 text-[#8a8277]" />
            <Input
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
              placeholder="Поиск по блюду или ингредиенту"
            />
          </div>
          <div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pb-2">
            {searchResults.map((dish) => (
              <button
                key={dish.id}
                className="flex w-full items-center gap-3 rounded-2xl bg-[#fff8ef] p-3 text-left"
                onClick={() => {
                  setSelectedCategory(dish.category);
                  setSearchOpen(false);
                }}
              >
                <div
                  className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${dish.color}`}
                />
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

      {deliveryDeniedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/42 px-5">
          <section className="w-full max-w-[360px] rounded-[28px] bg-white p-5 text-center shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
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
              className="mt-5 h-12 w-full rounded-2xl bg-[#171512] text-white hover:bg-[#302c25]"
              onClick={() => {
                setDeliveryDeniedOpen(false);
                setAddressPromptOpen(true);
              }}
            >
              Указать другой адрес
            </Button>
          </section>
        </div>
      )}
    </main>
  );
}

function DishCard({ dish, onAdd }: { dish: Dish; onAdd: () => void }) {
  return (
    <article className="flex gap-3 rounded-[22px] border border-[#eee5d8] bg-white p-3 shadow-[0_8px_26px_rgba(39,32,20,0.06)]">
      <div className="relative h-[112px] w-[112px] shrink-0 overflow-hidden rounded-[20px]">
        <div className={`absolute inset-0 bg-gradient-to-br ${dish.color}`} />
        <Image
          src="/images/sushi-hero.png"
          alt=""
          fill
          className="object-cover opacity-35 mix-blend-multiply"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{dish.name}</h2>
            <p className="text-xs text-[#8a8277]">{dish.grams} г</p>
          </div>
          <Badge className="shrink-0 rounded-full bg-[#fff0e8] text-[#b34125]">
            {dish.category}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#62594f]">
          {dish.ingredients}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-lg font-semibold">{money.format(dish.price)}</p>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-[#e34d2f] text-white hover:bg-[#ca4025]"
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

function BottomSheet({
  children,
  onClose,
  onTouchStart,
  onTouchEnd,
}: {
  children: React.ReactNode;
  onClose: () => void;
  onTouchStart: (value: number) => void;
  onTouchEnd: (value: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/42 pt-5">
      <section
        className="fixed inset-x-0 bottom-0 rounded-t-[30px] bg-white px-4 pb-6 pt-3 shadow-[0_-18px_60px_rgba(0,0,0,0.22)]"
        onTouchStart={(event) => onTouchStart(event.touches[0].clientY)}
        onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientY)}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d8d1c7]" />
        <button
          className="absolute right-4 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#f1eadf]"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto w-full max-w-[430px]">{children}</div>
      </section>
    </div>
  );
}
