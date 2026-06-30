# Projeto Mibbers

Projeto desenvolvido com foco em organização de domínio, separação de responsabilidades e escalabilidade.

## Arquitetura e Tecnologias

### Backend

* **Fastify** pela performance, flexibilidade na arquitetura e suporte nativo à validação de requisições.
* **TypeORM** para modelar o domínio através de classes e facilitar a persistência no banco.
* **ESLint** para padronização do código.

### Frontend

* **Next.js** + **Tailwind CSS**.
* Carrinho persistido em **localStorage** com gerenciamento de estado local.

---

## Modelagem

O cupom foi modelado como uma entidade de domínio, definindo primeiro as regras de negócio e deixando a integração com bibliotecas e infraestrutura para as camadas externas.

---

## Melhorias para produção

* Controle de concorrência (filas ou estratégia equivalente).
* Restrições por categoria ou produto.
* Limite de uso por usuário (ID, CPF ou e-mail).
* Cálculo dos descontos com base nos dados do banco.
* Processamento das regras no servidor.

---

## Edge Cases

* Cupom inexistente, inativo ou expirado.
* Limite de uso atingido.
* Valor mínimo não alcançado.
* Código do cupom vazio.
* Carrinho vazio.
* Envio de propriedades extras na requisição.

---

## Cupons de teste

| Cupom          | Regra                                           |
| -------------- | ----------------------------------------------- |
| **DESCONTO10** | 10% de desconto, sem valor mínimo.              |
| **FIXO50**     | R$ 50 de desconto para compras acima de R$ 100. |

---

## Testes

Cobertura para:

* Cupom inexistente.
* Cupom inativo.
* Cupom expirado.
* Limite de uso atingido.
* Valor mínimo não atingido.
* Aplicação de cupom com sucesso.

---

## Como executar

### Clonar o projeto

```bash
git clone https://github.com/EdsonDevLima/Mibbers
```

### Backend

```bash
cd backend
npm install
npm run seed # cria os cupons de teste
npm run dev
```

### Frontend

```bash
cd frontend/my-app
npm install
npm run dev
```
