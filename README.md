# 06-notehub-nextjs

Застосунок NoteHub для роботи з персональною колекцією нотаток, перенесений на
Next.js (App Router). Застосунок має кілька сторінок: головну з описом
застосунку, сторінку зі списком нотаток (пошук за ключовим словом, пагінація,
створення та видалення нотаток) і сторінку з деталями окремої нотатки. Дані
зберігаються на бекенді [NoteHub API](https://notehub-public.goit.study/api/docs).

**Демо:** https://06-notehub-nextjs-vert-sigma.vercel.app

## Маршрути

- `/` — головна сторінка із загальною інформацією про NoteHub
- `/notes` — список нотаток із пошуком, пагінацією та створенням нової нотатки
- `/notes/[id]` — сторінка з деталями нотатки

Сторінки `/notes` і `/notes/[id]` рендеряться на сервері: дані попередньо
завантажуються через TanStack Query (`prefetchQuery`) і передаються клієнтським
компонентам через `HydrationBoundary`. Подальші запити (зміна сторінки, пошук,
створення та видалення нотаток) виконуються на клієнті.

## Стек

- Next.js (App Router) + TypeScript
- TanStack Query (React Query)
- Axios
- Formik + Yup
- React Paginate
- use-debounce
- React Hot Toast
- CSS Modules
- modern-normalize
- Prettier

## Структура

```
app/
├── layout.tsx
├── page.tsx
├── loading.tsx
└── notes/
    ├── page.tsx
    ├── Notes.client.tsx
    ├── error.tsx
    └── [id]/
        ├── page.tsx
        ├── NoteDetails.client.tsx
        └── error.tsx
components/
├── EmptyState/
├── Footer/
├── Header/
├── Loader/
├── Modal/
├── NoteForm/
├── NoteList/
├── Pagination/
├── SearchBox/
└── TanStackProvider/
lib/
└── api.ts
types/
└── note.ts
```

## Змінні оточення

Для запитів до бекенда потрібен персональний токен доступу. Його можна
отримати в [документації бекенда](https://notehub-public.goit.study/api/docs)
(маршрут `POST /auth`). Створіть у корені проєкту файл `.env.local` (за зразком
`.env.example`):

```
NEXT_PUBLIC_NOTEHUB_TOKEN=your_notehub_access_token
```

## Запуск

```bash
npm install
npm run dev
```

Застосунок буде доступний за адресою http://localhost:3000.

## Скрипти

- `npm run dev` — dev-сервер
- `npm run build` — production-збірка
- `npm run start` — запуск production-збірки
- `npm run lint` — лінтинг (ESLint)
- `npm run format` — форматування коду через Prettier
