# Digital Mint — TON Testnet Wallet

Self-custodial crypto wallet for TON testnet. No backend, fully client-side.

## Quick Start

```bash
npm install
cp .env.example .env       # then fill in your API key
npm run dev
```

Open http://localhost:5173

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Default | Description |
|---|---|---|
| `VITE_TONCENTER_ENDPOINT` | `https://testnet.toncenter.com/api/v2/jsonRPC` | TonCenter JSON-RPC endpoint |
| `VITE_TONCENTER_API_KEY` | *(empty)* | API key for higher rate limits. Get one from [@tontestnetapibot](https://t.me/tontestnetapibot) (testnet) or [@tonapibot](https://t.me/tonapibot) (mainnet) |
| `VITE_WORKCHAIN` | `0` | TON workchain (0 = basechain) |
| `VITE_BALANCE_POLL_INTERVAL` | `15000` | Balance polling interval in ms |
| `VITE_TX_CACHE_TTL` | `300000` | Transaction cache lifetime in ms (5 min) |
| `VITE_TONSCAN_URL` | `https://testnet.tonscan.org` | Block explorer URL for tx links |

## Getting Testnet TON

1. Create or import a wallet in the app
2. Copy your address from the Dashboard or Receive screen
3. Send testnet TON via the Telegram bot [@testgiver_ton_bot](https://t.me/testgiver_ton_bot)
4. Balance will update within 15 seconds

## Architecture

### Tech Stack
- **React 18 + TypeScript + Vite** — fast dev experience, type safety
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **React Router v6** — client-side routing
- **@ton/ton + @ton/crypto + @ton/core** — TON blockchain SDK
- **qrcode.react** — QR code generation
- **TonCenter Testnet API** — public RPC endpoint (no backend needed)

### Project Structure

```
src/
├── lib/               # Core logic (no React dependencies)
│   ├── tonClient.ts       # TonClient singleton
│   ├── walletService.ts   # Wallet operations (create, import, send, balance, txs)
│   ├── storage.ts         # localStorage wrappers
│   └── addressUtils.ts    # Address spoofing detection
├── context/           # React Context for wallet state
├── hooks/             # Custom hooks (useBalance, useTransactions, useClipboard)
├── components/        # Reusable UI components
│   ├── layout/            # TestnetHeader, TopBar, BottomNav
│   ├── wallet/            # BalanceHero, MnemonicGrid, TransactionList
│   └── send/              # RiskWarningModal, SecurityReview
└── pages/             # Route-level components
    ├── WelcomePage        # Create / Import selection
    ├── CreateWalletPage   # Generate + display 24-word mnemonic
    ├── ImportWalletPage   # Paste/type recovery phrase
    ├── DashboardPage      # Balance + transactions + search
    ├── ReceivePage        # Address + QR code + copy
    └── SendPage           # Multi-step send flow with security checks
```

### Design System: "Digital Mint"

The UI follows an "Editorial Fintech" design language:
- **Fonts**: Manrope (headlines/buttons), Inter (body/labels)
- **Colors**: TON-blue primary (#006193), amber testnet indicator (#a36700)
- **No-border rule**: Sections separated by tonal surface layers, not lines
- **Gradient CTAs**: Primary buttons use `from-primary to-primary-container`
- **Frosted glass nav**: Bottom navigation with backdrop-blur

## Key Decisions & Trade-offs

### Wallet Contract Version: V4
Chose `WalletContractV4` over V5 because V4 is the most widely deployed and battle-tested version. V5 adds gasless transactions and batching, which are unnecessary for a testnet wallet.

### No Encryption (Testnet Only)
The mnemonic is stored in `localStorage` without encryption. This is a deliberate trade-off for testnet: it removes the unlock/password friction. In production, the mnemonic would be encrypted with Web Crypto API (PBKDF2 + AES-GCM-256) behind a user password.

### No Backend
All blockchain data comes from the TonCenter public API. Balance polls every 15 seconds. Transaction history is cached in localStorage for 5 minutes to reduce API calls.

### Bounce Detection
Before sending, the app checks if the recipient wallet contract is deployed (`isContractDeployed`). If not, it sends with `bounce: false` to prevent funds from bouncing back (minus fees) when sending to uninitialized wallets.

## Address Spoofing Protection

Three-layer protection system:

### Layer 1: Clipboard Hijack Detection
When the user pastes an address, the app re-reads the clipboard after 150ms and compares it to the pasted value. If they differ, a **Critical Risk Warning** modal appears warning that malicious software may have swapped the address. The first and last 4 characters are highlighted for easy visual verification.

### Layer 2: Risk Assessment
On the review screen before sending, the app evaluates:
- **New Address**: Flags if this is the first interaction with the recipient (HIGH RISK badge)
- **High Amount**: Warns if the amount exceeds 50% of the wallet balance
- **Address Similarity**: Compares the recipient against known/recent addresses character-by-character. Similarity >70% triggers a warning about possible address poisoning
- **Self Transfer**: Warns if sending to your own address

### Layer 3: Mandatory Address Verification
The final "Confirm & Send" button is disabled until the user checks: *"I have manually verified that every character of the recipient address is correct."* The address is displayed with highlighted first/last segments to aid comparison.

## Possible Future Improvements

- **Password-based encryption** for mnemonic storage (Web Crypto API)
- **TON DNS resolution** (name.ton -> address)
- **Multi-wallet support** with wallet switching
- **Transaction comments/memos** display and input
- **Push notifications** for incoming transactions (via Service Worker)
- **Hardware wallet support** (Ledger via @ton-community/ton-ledger)
- **Address book** with labels and CRUD management
- **Mainnet support** with network switching
- **Dark mode** (design tokens already support it)
- **Biometric unlock** (WebAuthn API)

---

## Ответы на вопросы

### 1. Полнота реализации

Реализован полноценный самостоятельный (self-custodial) кошелёк для TON testnet, работающий целиком на клиенте без бэкенда:

- **Создание кошелька** — генерация 24-слов мнемонической фразы (BIP39) через `@ton/crypto`, вывод ключей и детерминированного адреса на базе `WalletContractV4`.
- **Импорт кошелька** — восстановление из существующей seed-фразы с валидацией через `mnemonicValidate`.
- **Просмотр баланса** — поллинг каждые 15 секунд через TonCenter API, автоматическое обновление.
- **История транзакций** — получение, кэширование (5 мин TTL в localStorage), поиск/фильтрация, отображение входящих/исходящих.
- **Отправка TON** — многошаговый флоу: ввод → детекция рисков → ревью → подтверждение → результат. Поддержка комментариев, расчёт комиссии (~0.015 TON), определение bounce-флага.
- **Получение TON** — QR-код, копирование адреса, предупреждение о testnet.
- **Трёхуровневая защита от спуфинга адресов** — детекция подмены буфера обмена, оценка рисков (новый адрес, высокая сумма, похожий адрес, self-transfer), обязательная ручная верификация адреса.

Не реализовано (сознательно, т.к. это testnet-кошелёк): шифрование мнемоники, мультикошелёк, TON DNS, адресная книга, поддержка mainnet.

### 2. UI/UX — удобство и безопасность

**Удобство:**
- Мобильный-first дизайн с фиксированной нижней навигацией (BottomNav с backdrop-blur).
- Дизайн-система "Digital Mint" — шрифты Manrope/Inter, TON-blue палитра, градиентные CTA-кнопки, тональные поверхности вместо бордеров.
- Быстрые кнопки выбора процента баланса (25%, 50%, 75%, MAX) при отправке.
- Состояния загрузки (skeleton-скрины, спиннеры), пустые состояния с подсказками.
- Визуальная обратная связь: «Copied!» при копировании, `active:scale-95` при нажатии кнопок, анимация `slide-up` для модалок.
- Поиск по истории транзакций прямо на Dashboard.

**Безопасность:**
- Clipboard hijack detection — повторное чтение буфера через 150ms после вставки, модальное предупреждение при расхождении.
- Risk assessment engine — 4 проверки перед отправкой (new address, high amount, address similarity >70%, self-transfer).
- Обязательный чекбокс верификации адреса перед подтверждением — кнопка «Confirm & Send» заблокирована до подтверждения.
- Подсветка первых/последних 4 символов адреса для визуальной проверки.
- Bounce detection — автопроверка деплоя контракта получателя, `bounce: false` для неинициализированных кошельков.
- Яркий amber-индикатор testnet-режима для предотвращения путаницы с mainnet.

### 3. Наличие тестов

На данный момент тесты **отсутствуют** (нет unit, integration или e2e тестов). Это осознанный компромисс — приоритет был отдан реализации функциональности и UX для testnet-демонстрации.

Если бы проект развивался дальше, в первую очередь стоило бы покрыть тестами:
- `walletService.ts` — юнит-тесты на генерацию/импорт мнемоники, формирование транзакций.
- `addressUtils.ts` — юнит-тесты на алгоритм определения сходства адресов и оценки рисков.
- `useClipboard.ts` — тест детекции подмены буфера обмена.
- SendPage — e2e-тест многошагового флоу отправки.

Качество кода поддерживается строгой конфигурацией TypeScript (`strict: true`, `noUnusedLocals`, `noUnusedParameters`) и ESLint с правилами для React hooks.

### 4. Объяснение компромиссов

| Решение | Почему так | Альтернатива |
|---|---|---|
| **Мнемоника в localStorage без шифрования** | Testnet — нулевая ценность средств. Убирает трение с паролем/PIN при каждом входе. | В продакшене — Web Crypto API (PBKDF2 + AES-GCM-256) за пользовательским паролем |
| **WalletContractV4 вместо V5** | V4 — самый распространённый и проверенный контракт. V5 добавляет gasless-транзакции и батчинг, не нужные для testnet. | V5 — если нужны спонсированные транзакции |
| **Поллинг баланса (15 сек) вместо WebSocket** | TonCenter публичный API не предоставляет WS-подписки. Поллинг прост и предсказуем для testnet-нагрузок. | TON HTTP API v4 / Tonkeeper API с SSE/WS |
| **Кэш транзакций в localStorage (5 мин)** | Снижает нагрузку на API, даёт мгновенный рендер при возврате на страницу. Cache-first + фоновое обновление. | SWR/React Query — для более сложных сценариев инвалидации |
| **React Context вместо Redux/Zustand** | Состояние кошелька простое (адрес, мнемоника, ключи). Context + hooks достаточно, лишняя зависимость не оправдана. | Zustand — при росте числа состояний (мультикошелёк, сетевые настройки) |
| **Нет бэкенда** | Самокастодиальный кошелёк — приватные ключи никогда не покидают клиент. TonCenter API публичный и достаточный. | Собственная нода — для приватности запросов и отсутствия rate-limit |
| **Отсутствие тестов** | Приоритет — полнота функциональности и UX для демонстрации. Строгий TypeScript + ESLint компенсируют часть рисков. | Vitest + Testing Library + Playwright |

### 5. Обоснование архитектуры и выбора стека

**Почему React + TypeScript + Vite:**
- React — стандарт де-факто для SPA, огромная экосистема, отличная совместимость с TON SDK.
- TypeScript — критически важен для криптокошелька: строгая типизация минимизирует ошибки при работе с bigint-балансами, адресами и транзакциями.
- Vite — мгновенный HMR, нативная поддержка TS, минимальная конфигурация. Быстрее CRA/Webpack для проекта такого размера.

**Почему Tailwind CSS v4:**
- Utility-first подход позволяет быстро выстроить кастомный дизайн без написания отдельных CSS-файлов.
- Design tokens через CSS-переменные (`@theme`) дают единую палитру, которую легко менять (например, для dark mode).
- Отсутствие лишнего CSS — только используемые классы попадают в бандл.

**Почему @ton/ton + @ton/crypto + @ton/core:**
- Официальный SDK от TON Foundation. Полная поддержка WalletContractV4, формирования и подписания транзакций.
- `@ton/crypto` предоставляет BIP39-мнемонику и вывод ключей без внешних зависимостей.
- Альтернативы (tonweb) устарели и менее типизированы.

**Архитектурные принципы:**
- **Слоёная архитектура**: `lib/` (чистая логика без React) → `hooks/` (stateful логика) → `components/` (UI) → `pages/` (маршруты). Это позволяет тестировать бизнес-логику изолированно и переиспользовать её вне React.
- **Единый источник правды**: WalletContext хранит состояние кошелька, все компоненты получают его через `useWallet()`.
- **Cache-first pattern**: Транзакции показываются из кэша мгновенно, затем обновляются с сервера — улучшает perceived performance.
- **State machine для SendPage**: 4 чётких шага (form → risk-warning → review → result) вместо условного рендеринга — проще поддерживать и расширять.
