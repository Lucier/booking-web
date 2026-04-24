# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral do projeto

Frontend React para o sistema de agendamento de auditórios. Consome uma API REST que deve estar rodando em `http://localhost:3000`. Autenticação via JWT com dois papéis: `USER` (acesso padrão) e `ADMIN` (acesso a rotas administrativas).

## Stack utilizada

- **React 19** + **TypeScript 6** + **Vite 8**
- **React Router DOM v7** — roteamento com lazy loading em todas as páginas
- **Zustand 5** — estado global de autenticação, com persistência via `localStorage`
- **React Hook Form 7** + **Zod 4** — formulários e validação client-side
- **Axios** — cliente HTTP com interceptor de 401
- **Tailwind CSS v4** — via plugin Vite (`@tailwindcss/vite`)
- **date-fns** — manipulação de datas com locale `ptBR`
- **clsx** + **tailwind-merge** — composição de classes (utilitário `cn` em `src/utils/cn.ts`)

## Como rodar o projeto

```bash
npm install
npm run dev        # inicia em http://localhost:5173
```

A variável `VITE_API_URL` define a URL base da API (padrão: `http://localhost:3000`). No dev server há um proxy de `/api` para `http://localhost:3000` configurado em `vite.config.ts`.

```bash
npm run build      # tsc + vite build
npm run lint       # eslint
```

## Como rodar os testes

O projeto não possui testes configurados.

## Estrutura de pastas

```
src/
  api/          # Um arquivo por recurso (auth, bookings, locations, users) + client.ts
  components/
    ui/          # Design system: Button, Card, Input, Select, Badge, Modal, etc.
    bookings/    # BookingList (componente de listagem reutilizável)
    layout/      # Layout, Header, Sidebar
  contexts/      # ToastContext (success/error/warning, auto-dismiss 4s)
  hooks/         # useApi (fetch genérico com loading/error/refetch)
  pages/         # Páginas organizadas por domínio (auth/, bookings/, locations/, users/)
  router/        # index.tsx (rotas), ProtectedRoute.tsx, GuestRoute.tsx
  schemas/       # Schemas Zod por domínio, exportam também os tipos inferidos
  store/         # auth.store.ts (Zustand)
  types/         # index.ts com todas as interfaces globais
  utils/         # cn.ts, dates.ts, errors.ts
```

## Decisões arquiteturais

**Path alias:** `@/` aponta para `src/`. Usar sempre em vez de caminhos relativos.

**Auth state:** Zustand com middleware `persist`. O token JWT é armazenado em `localStorage` com a chave `access_token`. O store é hidratado automaticamente no reload. O interceptor do Axios (em `src/api/client.ts`) lê `access_token` a cada request e redireciona para `/login` em respostas 401.

**Lazy loading:** Todas as páginas são carregadas com `React.lazy` + `Suspense`. O componente `<Lazy>` no router envolve cada página.

**Guards de rota:** `ProtectedRoute` redireciona não-autenticados para `/login`. Com prop `adminOnly`, redireciona não-admins para `/`. `GuestRoute` redireciona usuários autenticados para `/`.

**`useApi` hook:** Para fetches simples em `useEffect`, use `useApi(() => api.method())`. Retorna `{ data, loading, error, refetch }`. Para fetches com dependências dinâmicas (ex: disponibilidade por data/auditório), faça manualmente com `useEffect` e flag `cancelled`, como em `NewBookingPage`.

**Formato de data:** Inputs HTML usam `YYYY-MM-DD`. A API espera `DD-MM-YYYY`. A conversão é feita pela função `toApiDate()` em `src/utils/dates.ts`. Sempre converter antes de enviar à API.

**Erros de API:** Usar `getApiErrorMessage(err, fallback)` de `src/utils/errors.ts` para extrair a mensagem do erro Axios. O tipo `ApiError` define que `message` pode ser `string | string[]` (primeiro item é usado quando é array).

## Regras de negócio implementadas

- Agendamentos só podem ser criados a partir da data atual (restrição no `<input type="date" min={todayISO()}>`).
- Horários disponíveis vão de `07:00` a `22:00` em slots de 1 hora.
- `end_time` deve ser estritamente maior que `start_time` (validado no Zod schema).
- A disponibilidade de um auditório é verificada via API antes da seleção de horário — slots ocupados são ocultados da grade.
- Somente usuários com role `ADMIN` podem acessar `/users`.
- A rota `/bookings/me` exibe apenas os agendamentos do usuário autenticado; `/bookings` (admin) exibe todos.

## Exemplos de uso da API

Todos os endpoints retornam JSON. Endpoints autenticados requerem header `Authorization: Bearer <token>`.

```
POST   /auth/login                           { email, password } → { access_token, user }
POST   /auth/register                        { name, email, password } → User

GET    /locations                            → Location[]
POST   /locations                            { name } → Location           (admin)
DELETE /locations/:id                                                       (admin)

GET    /bookings/me                          → Booking[]
GET    /bookings                             → Booking[]                   (admin)
GET    /bookings/availability?locationId=:id&date=DD-MM-YYYY → AvailabilitySlot[]
POST   /bookings                             { location_id, date: DD-MM-YYYY, start_time: HH:MM, end_time: HH:MM } → Booking
DELETE /bookings/:id

GET    /users                                → User[]                      (admin)
GET    /users/me                             → User
PATCH  /users/me                             { name?, email? } → User
DELETE /users/:id                                                           (admin)
```

`AvailabilitySlot` representa intervalos já **ocupados**: `{ start_time: string, end_time: string }`. A ausência de um slot na lista significa que o horário está disponível.
