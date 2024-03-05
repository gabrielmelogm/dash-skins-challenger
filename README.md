# Dashskins - Challenger
> Um code test para a dashskins

## Estrutura do projeto
```bash
├── apps/
│ ├── api/
│ │ ├── src/
│ │ ├── test/
│ │ ├── .env
│ ├── web/
│ │ ├── public/
│ │ ├── src/
│ │ │ ├── components/
│ │ │ ├── pages/
│ │ ├── .env.local
```

## Ambiente 🛠️
- Ambos
  - Node 20.11.1
  - Zod
  - Typescript
  - BiomeJs

- Backend
  - NestJs
  - TypeORM
  - MongoDB
  - Jest
  - Passport

- Frontend
  - Vite - React
  - ShadcnUI
  - Tailwind
  - React Router
  - React Query
  - Js Cookie

## Como rodar 🏁
- 1. Instale as dependências
  - Back - <code>cd ./apps/api</code>
  ```bash
  yarn install
  ```

  - Front - <code>cd ./apps/web</code>
  ```bash
  yarn install
  ```

- 2. Crie o <code>.env</code>
  - Back
    - 1. Caminhe até a pasta com o back end
    ```bash
    cd ./apps/api
    ```
    - 2.Crie o arquivo <code>.env</code> com as seguintes informações
    ```bash
    NODE_ENV=development
    DATABASE_URL=
    JWT_KEY=
    SESSION_EXPIRES=
    ```

  - Front
    - 1. Caminhe até a pasta com o back end
    ```bash
    cd ./apps/web
    ```
    - 2. Crie o arquivo <code>.env.local</code> com as seguintes informações
    ```bash
    VITE_API_URL=http://localhost:3333
    ```

- 2. Na raiz do projeto rode os comandos

```bash
yarn run dev
```

  - 2.1. Rodando somente o backend
  ```bash
  yarn run dev:api
  ```

  - 2.2. Rodando somente o front
  ```bash
  yarn run dev:api
  ```
  - 2.1. Rodando somente o backend
  ```bash
  yarn run dev:web
  ```

## Testes 🧪
> O projeto precisa estar configurado com as variáveis de ambiente as dependências
- 1. Navegue até o backend
```bash
cd ./apps/api
```

### Testes unitários
```bash
yarn run test
```

### Testes E2E
```bash
yarn run test:e2e
```