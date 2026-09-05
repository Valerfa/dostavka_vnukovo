'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Bike,
  ChefHat,
  ChevronRight,
  Clock3,
  MapPin,
  Minus,
  Plus,
  Settings2,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type MenuItem = {
  id: string;
  title: string;
  category: string;
  grams: number;
  price: number;
  description: string;
  accent: string;
  isBestSeller: boolean;
  included: string[];
};

type CartItem = MenuItem & {
  quantity: number;
};

const menu: MenuItem[] = [
  {
    id: 'philadelphia-set',
    title: 'Филадельфия сет',
    category: 'Сеты',
    grams: 920,
    price: 1890,
    description: 'Лосось, сливочный сыр, огурец, авокадо и мягкий рис.',
    accent: 'from-[#ff7a59] to-[#f3b45b]',
    isBestSeller: true,
    included: ['2 соуса', '2 пары палочек', 'имбирь', 'васаби'],
  },
  {
    id: 'tokyo-roll',
    title: 'Токио ролл',
    category: 'Роллы',
    grams: 280,
    price: 620,
    description: 'Креветка, снежный краб, тобико и соус спайси.',
    accent: 'from-[#2f9e7e] to-[#84cc8b]',
    isBestSeller: true,
    included: ['1 соус', 'палочки'],
  },
  {
    id: 'unagi-maki',
    title: 'Унаги маки',
    category: 'Роллы',
    grams: 240,
    price: 540,
    description: 'Угорь, кунжут, огурец и сладкий унаги-соус.',
    accent: 'from-[#1f2937] to-[#64748b]',
    isBestSeller: false,
    included: ['палочки'],
  },
  {
    id: 'salmon-nigiri',
    title: 'Нигири лосось',
    category: 'Суши',
    grams: 120,
    price: 390,
    description: 'Две порции с охлажденным лососем и рисом.',
    accent: 'from-[#fb7185] to-[#fdba74]',
    isBestSeller: false,
    included: [],
  },
];

const addons = [
  { id: 'soy', title: 'Соевый соус', price: 40 },
  { id: 'sticks', title: 'Палочки', price: 20 },
  { id: 'ginger', title: 'Имбирь', price: 35 },
  { id: 'wasabi', title: 'Васаби', price: 30 },
];

const orders = [
  {
    id: '1042',
    client: 'Анна',
    status: 'Ожидает подтверждения',
    payment: 'Наличные курьеру',
    total: 1540,
    tag: 'Нужно принять',
  },
  {
    id: '1043',
    client: 'Илья',
    status: 'Готовится',
    payment: 'Онлайн оплачено',
    total: 2310,
    tag: 'На кухне',
  },
  {
    id: '1044',
    client: 'Мария',
    status: 'У курьера',
    payment: 'Перевод',
    total: 1880,
    tag: 'Доставка',
  },
];

const deliverySettings = {
  radiusKm: 5,
  minOrderAmount: 1000,
  deliveryFee: 250,
  freeDeliveryThreshold: 2000,
};

const rub = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([
    { ...menu[0], quantity: 1 },
  ]);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({
    soy: 1,
    sticks: 0,
    ginger: 0,
    wasabi: 0,
  });
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>(
    'delivery',
  );
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [bestSellerEnabled, setBestSellerEnabled] = useState(true);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const addonTotal = useMemo(
    () =>
      addons.reduce(
        (sum, addon) => sum + addon.price * (selectedAddons[addon.id] ?? 0),
        0,
      ),
    [selectedAddons],
  );

  const itemsTotal = cartTotal + addonTotal;
  const deliveryFee =
    deliveryType === 'delivery' &&
    itemsTotal >= deliverySettings.minOrderAmount &&
    itemsTotal < deliverySettings.freeDeliveryThreshold
      ? deliverySettings.deliveryFee
      : 0;
  const orderTotal = itemsTotal + deliveryFee;
  const missingForMinimum = Math.max(
    deliverySettings.minOrderAmount - itemsTotal,
    0,
  );
  const missingForFreeDelivery = Math.max(
    deliverySettings.freeDeliveryThreshold - itemsTotal,
    0,
  );
  const deliveryAvailable = deliveryType === 'pickup' || missingForMinimum === 0;
  const bestSellers = menu.filter((item) => item.isBestSeller);

  const addToCart = (dish: MenuItem) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === dish.id);
      if (existing) {
        return current.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...dish, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const updateAddon = (id: string, delta: number) => {
    setSelectedAddons((current) => ({
      ...current,
      [id]: Math.max((current[id] ?? 0) + delta, 0),
    }));
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#191714]">
      <section className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_390px] gap-5 px-4 py-4 max-xl:grid-cols-1 lg:px-6">
        <div className="overflow-hidden rounded-[28px] border border-[#e4ddd1] bg-white shadow-[0_18px_70px_rgba(39,32,20,0.08)]">
          <Header />

          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(310px,0.85fr)] gap-5 p-4 max-lg:grid-cols-1 sm:p-5">
            <section className="space-y-5">
              <Hero />

              {bestSellerEnabled && (
                <section aria-label="Хиты продаж" className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#7d4738]">
                        Подборка администратора
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Хиты продаж
                      </h2>
                    </div>
                    <Badge className="rounded-full bg-[#1f2937] px-3 py-1 text-white">
                      управляется в админке
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                    {bestSellers.map((dish) => (
                      <FeaturedDish
                        key={dish.id}
                        dish={dish}
                        onAdd={() => addToCart(dish)}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Меню Внуково
                  </h2>
                  <div className="hidden items-center gap-2 rounded-full border border-[#e7ded1] px-3 py-2 text-sm text-[#6f675d] sm:flex">
                    <MapPin className="h-4 w-4 text-[#b34125]" />
                    радиус {deliverySettings.radiusKm} км
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                  {menu.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onAdd={() => addToCart(dish)}
                    />
                  ))}
                </div>
              </section>
            </section>

            <aside className="space-y-4">
              <CartPanel
                cart={cart}
                addons={selectedAddons}
                deliveryType={deliveryType}
                paymentMethod={paymentMethod}
                itemsTotal={itemsTotal}
                deliveryFee={deliveryFee}
                orderTotal={orderTotal}
                missingForMinimum={missingForMinimum}
                missingForFreeDelivery={missingForFreeDelivery}
                deliveryAvailable={deliveryAvailable}
                onQuantityChange={updateQuantity}
                onAddonChange={updateAddon}
                onDeliveryTypeChange={setDeliveryType}
                onPaymentMethodChange={setPaymentMethod}
              />
            </aside>
          </div>
        </div>

        <ControlRoom
          bestSellerEnabled={bestSellerEnabled}
          onBestSellerEnabledChange={setBestSellerEnabled}
        />
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#eee5d8] px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#191714] text-white">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight">Sushi Vnukovo</p>
          <p className="text-sm text-[#756d62]">доставка и самовывоз</p>
        </div>
      </div>
      <div className="hidden items-center gap-2 rounded-full bg-[#f4eee5] px-4 py-2 text-sm font-medium text-[#5d544a] md:flex">
        <Clock3 className="h-4 w-4 text-[#b34125]" />
        Сегодня 11:00-23:00
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-[#191714] text-white">
      <Image
        src="/images/sushi-hero.png"
        alt="Ассорти суши и роллов"
        fill
        priority
        className="object-cover opacity-72"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#191714] via-[#191714]/35 to-transparent" />
      <div className="relative flex min-h-[360px] flex-col justify-end p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge className="rounded-full bg-white/90 px-3 py-1 text-[#191714]">
            Внуково
          </Badge>
          <Badge className="rounded-full bg-[#f35b2c] px-3 py-1 text-white">
            доставка 5 км
          </Badge>
        </div>
        <h1 className="max-w-[620px] text-4xl font-semibold tracking-tight sm:text-5xl">
          Роллы рядом: быстро заказать, удобно приготовить, легко доставить.
        </h1>
        <p className="mt-3 max-w-[560px] text-base text-white/82">
          Первая демонстрация: меню, корзина, правила доставки и рабочие панели
          для команды.
        </p>
      </div>
    </section>
  );
}

function FeaturedDish({
  dish,
  onAdd,
}: {
  dish: MenuItem;
  onAdd: () => void;
}) {
  return (
    <article className="rounded-[20px] border border-[#eadfce] bg-[#fffaf2] p-4">
      <div
        className={`mb-4 h-28 rounded-2xl bg-gradient-to-br ${dish.accent}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge className="mb-2 rounded-full bg-[#ffedd5] text-[#9a3412]">
            <Star className="mr-1 h-3.5 w-3.5 fill-current" />
            хит
          </Badge>
          <h3 className="text-lg font-semibold">{dish.title}</h3>
          <p className="text-sm text-[#756d62]">{dish.grams} г</p>
        </div>
        <p className="text-lg font-semibold">{rub.format(dish.price)}</p>
      </div>
      <Button
        className="mt-4 w-full rounded-2xl bg-[#191714] text-white hover:bg-[#342f28]"
        onClick={onAdd}
      >
        <ShoppingBag className="h-4 w-4" />
        Добавить
      </Button>
    </article>
  );
}

function DishCard({ dish, onAdd }: { dish: MenuItem; onAdd: () => void }) {
  return (
    <article className="flex min-h-[310px] flex-col rounded-[20px] border border-[#eadfce] bg-white p-4">
      <div
        className={`mb-4 h-24 rounded-2xl bg-gradient-to-br ${dish.accent}`}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#b34125]">
              {dish.category}
            </p>
            <h3 className="text-xl font-semibold tracking-tight">
              {dish.title}
            </h3>
          </div>
          <p className="text-lg font-semibold">{rub.format(dish.price)}</p>
        </div>
        <p className="mt-2 text-sm leading-5 text-[#756d62]">
          {dish.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dish.included.length > 0 ? (
            dish.included.map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#f4eee5] px-2.5 py-1 text-xs text-[#5d544a]"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-[#f4eee5] px-2.5 py-1 text-xs text-[#5d544a]">
              добавки отдельно
            </span>
          )}
        </div>
        <Button
          className="mt-auto w-full rounded-2xl bg-[#f35b2c] text-white hover:bg-[#d9481f]"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" />
          В корзину
        </Button>
      </div>
    </article>
  );
}

function CartPanel({
  cart,
  addons: selectedAddons,
  deliveryType,
  paymentMethod,
  itemsTotal,
  deliveryFee,
  orderTotal,
  missingForMinimum,
  missingForFreeDelivery,
  deliveryAvailable,
  onQuantityChange,
  onAddonChange,
  onDeliveryTypeChange,
  onPaymentMethodChange,
}: {
  cart: CartItem[];
  addons: Record<string, number>;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: string;
  itemsTotal: number;
  deliveryFee: number;
  orderTotal: number;
  missingForMinimum: number;
  missingForFreeDelivery: number;
  deliveryAvailable: boolean;
  onQuantityChange: (id: string, delta: number) => void;
  onAddonChange: (id: string, delta: number) => void;
  onDeliveryTypeChange: (type: 'delivery' | 'pickup') => void;
  onPaymentMethodChange: (method: string) => void;
}) {
  return (
    <div className="sticky top-4 rounded-[24px] border border-[#e4ddd1] bg-[#fffaf2] p-4 shadow-[0_16px_50px_rgba(39,32,20,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#756d62]">Корзина</p>
          <h2 className="text-2xl font-semibold tracking-tight">
            {cart.length} позиции
          </h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white">
          <ShoppingBag className="h-5 w-5 text-[#b34125]" />
        </div>
      </div>

      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-[#756d62]">
                {rub.format(item.price)} · {item.grams} г
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => onQuantityChange(item.id, -1)}
                aria-label={`Уменьшить ${item.title}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-5 text-center text-sm font-semibold">
                {item.quantity}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => onQuantityChange(item.id, 1)}
                aria-label={`Добавить ${item.title}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-3">
        <p className="mb-3 font-medium">Дополнительно</p>
        <div className="space-y-2">
          {addons.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{addon.title}</p>
                <p className="text-xs text-[#756d62]">
                  {rub.format(addon.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  onClick={() => onAddonChange(addon.id, -1)}
                  aria-label={`Уменьшить ${addon.title}`}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-5 text-center text-sm font-semibold">
                  {selectedAddons[addon.id] ?? 0}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  onClick={() => onAddonChange(addon.id, 1)}
                  aria-label={`Добавить ${addon.title}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant={deliveryType === 'delivery' ? 'default' : 'outline'}
          className="rounded-2xl"
          onClick={() => onDeliveryTypeChange('delivery')}
        >
          <Bike className="h-4 w-4" />
          Доставка
        </Button>
        <Button
          variant={deliveryType === 'pickup' ? 'default' : 'outline'}
          className="rounded-2xl"
          onClick={() => onDeliveryTypeChange('pickup')}
        >
          <Store className="h-4 w-4" />
          Самовывоз
        </Button>
      </div>

      {deliveryType === 'delivery' && (
        <div className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-3">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#b34125]" />
            <p className="text-[#5d544a]">
              Внуково, доставка до {deliverySettings.radiusKm} км. Минимум{' '}
              {rub.format(deliverySettings.minOrderAmount)}, бесплатно от{' '}
              {rub.format(deliverySettings.freeDeliveryThreshold)}.
            </p>
          </div>
          {missingForMinimum > 0 ? (
            <p className="mt-3 rounded-xl bg-[#fff1f1] px-3 py-2 text-sm text-[#9f1239]">
              До доставки не хватает {rub.format(missingForMinimum)}.
            </p>
          ) : missingForFreeDelivery > 0 ? (
            <p className="mt-3 rounded-xl bg-[#fff7ed] px-3 py-2 text-sm text-[#9a3412]">
              До бесплатной доставки {rub.format(missingForFreeDelivery)}.
            </p>
          ) : (
            <p className="mt-3 rounded-xl bg-[#ecfdf3] px-3 py-2 text-sm text-[#166534]">
              Доставка для клиента бесплатная.
            </p>
          )}
        </div>
      )}

      <div className="mt-4 space-y-3 rounded-2xl bg-white p-3">
        <Label htmlFor="name">Контакты для заказа</Label>
        <Input id="name" placeholder="Имя" className="rounded-xl" />
        <Input placeholder="+7 999 000-00-00" className="rounded-xl" />
        {deliveryType === 'delivery' && (
          <Input placeholder="Адрес во Внуково" className="rounded-xl" />
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          ['online', 'Карта'],
          ['cash', 'Наличные'],
          ['transfer', 'Перевод'],
        ].map(([value, label]) => (
          <Button
            key={value}
            variant={paymentMethod === value ? 'default' : 'outline'}
            className="rounded-2xl px-2 text-sm"
            onClick={() => onPaymentMethodChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <PriceRow label="Товары и добавки" value={itemsTotal} />
        <PriceRow label="Доставка" value={deliveryFee} />
        <div className="flex items-center justify-between border-t border-[#eadfce] pt-3 text-lg font-semibold">
          <span>Итого</span>
          <span>{rub.format(orderTotal)}</span>
        </div>
      </div>

      <Button
        disabled={!deliveryAvailable}
        className="mt-4 h-12 w-full rounded-2xl bg-[#f35b2c] text-base text-white hover:bg-[#d9481f]"
      >
        Оформить заказ
        <ChevronRight className="h-4 w-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-[#756d62]">
        Можно заказать без регистрации
      </p>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-[#5d544a]">
      <span>{label}</span>
      <span>{value === 0 ? '0 ₽' : rub.format(value)}</span>
    </div>
  );
}

function ControlRoom({
  bestSellerEnabled,
  onBestSellerEnabledChange,
}: {
  bestSellerEnabled: boolean;
  onBestSellerEnabledChange: (value: boolean) => void;
}) {
  return (
    <aside className="rounded-[28px] border border-[#25211d] bg-[#191714] p-4 text-white shadow-[0_18px_70px_rgba(25,23,20,0.18)] xl:max-h-[calc(100vh-32px)] xl:overflow-auto">
      <div className="mb-5">
        <p className="text-sm text-white/60">Демо управления</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Рабочие панели
        </h2>
      </div>

      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white/10 p-1">
          <TabsTrigger value="admin" className="rounded-xl">
            Админ
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="rounded-xl">
            Кухня
          </TabsTrigger>
          <TabsTrigger value="courier" className="rounded-xl">
            Курьер
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-4 space-y-4">
          <PanelCard
            icon={<Settings2 className="h-5 w-5" />}
            title="Настройки доставки"
            caption="Регулируется без кода"
          >
            <Metric label="Радиус" value="5 км" />
            <Metric label="Минимум" value="1 000 ₽" />
            <Metric label="Платная доставка" value="250 ₽" />
            <Metric label="Бесплатно от" value="2 000 ₽" />
          </PanelCard>

          <PanelCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Витрина меню"
            caption="Карточки и подборки"
          >
            <div className="flex items-center justify-between rounded-2xl bg-white/8 p-3">
              <div>
                <p className="font-medium">Слайдер хитов продаж</p>
                <p className="text-sm text-white/55">Можно выключить</p>
              </div>
              <Switch
                checked={bestSellerEnabled}
                onCheckedChange={onBestSellerEnabledChange}
                aria-label="Показывать хиты продаж"
              />
            </div>
            <div className="rounded-2xl bg-white/8 p-3">
              <p className="font-medium">Филадельфия сет</p>
              <p className="mt-1 text-sm text-white/55">
                Включено: 2 соуса, 2 пары палочек, имбирь, васаби.
              </p>
            </div>
          </PanelCard>

          <OrderList title="Заказы сегодня" icon={<UserRound />} />
        </TabsContent>

        <TabsContent value="kitchen" className="mt-4 space-y-4">
          <PanelCard
            icon={<ChefHat className="h-5 w-5" />}
            title="Очередь кухни"
            caption="Только подтвержденные заказы"
          >
            {orders
              .filter((order) => order.status !== 'Ожидает подтверждения')
              .map((order) => (
                <KitchenRow key={order.id} order={order} />
              ))}
          </PanelCard>
        </TabsContent>

        <TabsContent value="courier" className="mt-4 space-y-4">
          <PanelCard
            icon={<Bike className="h-5 w-5" />}
            title="Доставка"
            caption="Назначенные заказы"
          >
            <div className="rounded-2xl bg-white/8 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Заказ #1044</p>
                  <p className="text-sm text-white/55">
                    Внуково, 3.2 км от филиала
                  </p>
                </div>
                <Badge className="rounded-full bg-[#f35b2c] text-white">
                  У курьера
                </Badge>
              </div>
              <Button className="mt-3 w-full rounded-2xl bg-white text-[#191714] hover:bg-white/90">
                Отметить доставленным
              </Button>
            </div>
          </PanelCard>
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function PanelCard({
  icon,
  title,
  caption,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-white/10 bg-white/6 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-[#ffb199]">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-white/55">{caption}</p>
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/8 px-3 py-2">
      <span className="text-sm text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function OrderList({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactElement;
}) {
  return (
    <PanelCard
      icon={icon}
      title={title}
      caption="Подтверждение и статусы"
    >
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl bg-white/8 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">
                #{order.id} · {order.client}
              </p>
              <p className="text-sm text-white/55">{order.payment}</p>
            </div>
            <p className="font-semibold">{rub.format(order.total)}</p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <Badge className="rounded-full bg-white/10 text-white">
              {order.status}
            </Badge>
            <Button
              size="sm"
              className="rounded-full bg-white text-[#191714] hover:bg-white/90"
            >
              {order.tag}
            </Button>
          </div>
        </div>
      ))}
    </PanelCard>
  );
}

function KitchenRow({
  order,
}: {
  order: {
    id: string;
    client: string;
    status: string;
    payment: string;
    total: number;
    tag: string;
  };
}) {
  return (
    <div className="rounded-2xl bg-white/8 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium">Заказ #{order.id}</p>
          <p className="text-sm text-white/55">
            Филадельфия сет, Токио ролл, соус x1
          </p>
        </div>
        <Badge className="rounded-full bg-[#ffedd5] text-[#9a3412]">
          {order.status}
        </Badge>
      </div>
      <Button className="mt-3 w-full rounded-2xl bg-[#f35b2c] text-white hover:bg-[#d9481f]">
        Отметить готовым
      </Button>
    </div>
  );
}
