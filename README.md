# NEXO Sports — E-commerce Front-end

Front-end de um e-commerce de camisas esportivas desenvolvido com Angular 17+ e Tailwind CSS, consumindo uma API REST construída com Spring Boot.

## 🔗 Links

- **Front-end (Vercel):** em breve
- **API (Railway):** https://e-commerce-production-48f9.up.railway.app
- **Swagger:** https://e-commerce-production-48f9.up.railway.app/swagger-ui/index.html
- **Repositório da API:** https://github.com/niltonalves7/e-commerce

---

## 🛠 Tecnologias

- [Angular 17+](https://angular.dev) — framework front-end
- [Tailwind CSS](https://tailwindcss.com) — estilização utilitária
- [TypeScript](https://www.typescriptlang.org) — tipagem estática
- [RxJS](https://rxjs.dev) — programação reativa
- [Stripe.js](https://stripe.com/docs/js) — integração de pagamentos
- [Vercel](https://vercel.com) — hospedagem do front-end

---

## 📁 Estrutura do Projeto

```
src/
  app/
    core/
      guards/          # auth.guard, admin.guard
      interceptors/    # api.interceptor (JWT)
      models/          # interfaces e enums
      services/        # auth, cart, category, order, product, user
    features/
      admin/           # dashboard, gerenciamento de produtos, categorias e pedidos
      auth/            # login e cadastro
      checkout/        # fluxo de pagamento com Stripe
      home/            # página inicial
      orders/          # listagem e detalhe de pedidos
      product/         # listagem e detalhe de produtos
      user/            # conta e painel do usuário
    shared/
      components/      # header, footer, cart-sidebar, confirm-modal
  environments/        # configuração de ambiente
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Angular CLI

```bash
npm install -g @angular/cli
```

### Instalação

```bash
# Clone o repositório
git clone https://github.com/niltonalves7/ecommerce-front.git
cd ecommerce-front

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
ng serve
```

Acesse `http://localhost:4200`

> A API precisa estar rodando para o front funcionar. Siga as instruções no [repositório da API](https://github.com/niltonalves7/e-commerce) para subir localmente com Docker.

---

## 🚀 Deploy

O front-end é hospedado no **Vercel** com integração contínua ao GitHub. A cada push na branch `main` um novo deploy é gerado automaticamente.

O arquivo `vercel.json` na raiz garante o correto funcionamento do roteamento SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```