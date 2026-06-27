# Projeto Mibbers

Este projeto foi desenvolvido com foco em organização de domínio e escalabilidade.

---

# Arquitetura e Tecnologias

## Backend

Optei por utilizar o **TypeORM** porque ele permite definir o modelo de domínio através de classes, facilitando a representação das entidades diretamente no código e sua persistência no banco de dados.

A API foi construída com **Fastify**, escolhida por:

- Maior flexibilidade na organização de pastas e arquitetura.
- Melhor performance em comparação ao Express em cenários de alta carga.
- Familiaridade prévia com o framework.
- Suporte a validações nativas de request, reduzindo dependência de bibliotecas externas.

### Qualidade de código

- ESLint foi utilizado para padronização e consistência do código.

---

## Frontend

No frontend, o carrinho de compras foi implementado utilizando:

- localStorage para persistência simples dos itens.
- Gerenciamento de estado local para controle do carrinho.
- Next.js com Tailwind CSS.

---

## Estrutura geral

A estrutura do projeto segue princípios inspirados em separação de responsabilidades, isolando regras de negócio da camada mais técnica, o que facilita:

- Testabilidade
- Manutenção
- Escalabilidade futura

---

# Perguntas do desafio

## Como você modelou os tipos de cupom e as regras?

Comecei modelando o cupom como uma entidade de domínio, definindo todas as propriedades. Depois fui criando as regras principais de negócio, e só então parti para a parte que envolve bibliotecas externas.

---

## O que mudaria em produção?

Trataria a concorrência utilizando um sistema de processamento de filas ou algo nesse sentido (já trabalhei com filas para tarefas pesadas, mas como a aplicação de um desconto exige uma resposta rápida, eu precisaria estudar melhor a abordagem mais adequada).

Também adicionaria:

- Restrições para categorias ou produtos específicos.
- Limite de uso por usuário (ID, CPF ou e-mail) para evitar fraudes.
- Cálculo do desconto baseado nos produtos armazenados no banco de dados.
- Requisições feitas do lado do servidor, para melhorar desempenho e segurança.

---

# Edge cases

- Cupom não existe.
- Cupom está inativo.
- Cupom expirado.
- Cupom atingiu o limite de uso.
- Valor da compra menor que o mínimo exigido.
- Código do cupom vazio ou contendo apenas espaços (Backend e Frontend).
- Carrinho de compras vazio (Backend e Frontend).
- Envio de propriedades a mais no endpoint.

---

# Edge cases deixados de lado

- Desconto percentual maior que 100% (pode ser evitado no cadastro do cupom).
- Desconto negativo (pode ser evitado no cadastro do cupom).
- Desconto fixo maior que o valor da compra (evita total negativo no cadastro).

---

# Cupons de teste (Frontend)

## DESCONTO10
- 10% de desconto no total do pedido.
- Sem valor mínimo.

## FIXO50
- R$ 50,00 de desconto.
- Valor mínimo: R$ 100,00.

---

# Cobertura de testes

## Cupom inexistente
Cupom não encontrado no banco de dados.

## Cupom inativo
Cupom com status inativo.

## Cupom expirado
Cupom com data de validade no passado (percentual e fixo).

## Cupom esgotado
Cupom com limite de uso igual a zero (percentual e fixo).

## Valor mínimo não atingido
Subtotal abaixo do mínimo exigido (percentual e fixo).

## Aplicação com sucesso (com limite de uso)
Cupom aplicado corretamente com limite definido.

## Aplicação com sucesso (sem limite de uso)
Cupom aplicado corretamente com limite alto.

---

# Como rodar o projeto

## Clonar o repositório

```bash
git clone https://github.com/EdsonDevLima/Mibbers
```

---

## Backend

```bash
cd backend
npm i
npm run seed
npm run dev
```

---

## Frontend

```bash
cd frontend/my-app
npm i
npm run dev
```