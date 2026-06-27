Este projeto foi desenvolvido com foco em organização de domínio e  escalabilidade.

Backend

Optei por utilizar o TypeORM porque ele permite definir o modelo de domínio através de classes, facilitando a representação das entidades diretamente no código e sua persistência no banco de dados.

A API foi construída com Fastify, escolhida por:

-maior flexibilidade na organização de pastas e arquitetura.
-melhor performance em comparação ao Express em cenários de alta carga.
-familiaridade prévia com o framework
-suporte a validações nativas de request, reduzindo dependência de bibliotecas externas.

Qualidade de código:

-ESLint foi utilizado para padronização e consistência do código.


No frontend, o carrinho de compras foi implementado utilizando:

-localStorage para persistência simples dos itens
-gerenciamento de estado local para controle do carrinho
-usei apenas Next js com o Tailwind.

A estrutura do projeto segue princípios inspirados em separação de responsabilidades, isolando regras de negócio da camada mais técnica, o que facilita:

testabilidade
manutenção
escalabilidade futura


# Perguntas do desafio

Como você modelou os tipos de cupom e as regras? - Comecei modelando o cupom como uma entidade de domínio, definindo todas as propriedades, depois abaixo fui criando as regras principais de negocio,pra depois disso partir para a parte de envolve libs.

O que mudaria em produção? - Trataria a concorrência utilizando um sistema de processamento de filas ou algo nesse sentido (falo isso porque já trabalhei com filas, mas para tarefas pesadas. Como a aplicação de um desconto exige uma resposta rápida, eu precisaria ver qual seria a melhor abordagem, mas seria algo voltado ao para enfileiramento de processo). Também adicionaria restrições para categorias ou produtos específicos e um limite de uso por usuário (ID, CPF ou e-mail) para evitar fraudes. Além disso, faria o cálculo do desconto com base nos produtos armazenados no banco de dados. E faria as requisições do lado do servidor pra desempenho e segurança.



# edge cases

-Cupom não existe.
-Cupom está inativo.
-Cupom expirou.
-Cupom atingiu o limite de uso.
-Valor da compra é menor que o mínimo exigido para o cupom.
-Código do cupom vazio ou contendo apenas espaços(No Backend e no Frontend).
-Carrinho de compras vazio(No Backend e no Frontend).
-O envio de propriedades a mais no Endpoint

# edge cases deixados de lado

-Desconto percentual maior que 100%.(poderia ser evitado ao cadastrar o cupom.)
-Desconto negativo.(poderia ser evitado ao cadastrar o cupom.)
-Desconto fixo maior que o valor da compra (evitar total negativo).(poderia ser evitado ao cadastrar o cupom.)


# Cupons de Teste no frontend

## `DESCONTO10`
Desconto de 10% sobre o total do pedido, sem valor mínimo.

## `FIXO50`
Desconto fixo de R$ 50,00. Exige valor mínimo de R$ 100,00 no pedido.

# Cobertura de Testes

## `cupom inexistente`
Cupom não encontrado no banco de dados.

## `cupom inativo`
Cupom com status inativo.

## `cupom expirado`
Cupom com data de validade no passado, testado com desconto percentual e fixo.

## `cupom esgotado`
Cupom com limite de uso igual a zero, testado com desconto percentual e fixo.

## `valor mínimo não atingido`
Subtotal do pedido abaixo do mínimo exigido pelo cupom, testado com desconto percentual e fixo.

## `aplicação com sucesso com limite de uso`
Cupom aplicado com sucesso com limite de uso definido, testado com desconto percentual e fixo.

## `aplicação com sucesso sem limite de uso`
Cupom aplicado com sucesso com limite de uso alto, testado com desconto percentual e fixo.


Utilizar o projeto em ambiente de desenvolvimento:

```bash
git clone https://github.com/EdsonDevLima/Mibbers
```

# No Backend:
```bash
cd backend
```
Instalar dependencias:
```bash
npm i
```

Criar as cupons no banco de dados:
```bash
npm run seed
```

Executar projeto:
```bash
npm run dev
```

# No Frontend:
```bash
cd frontend/my-app
```
Instalar dependencias:

```bash
npm i
```

Executar projeto:
```bash
npm run dev
```





