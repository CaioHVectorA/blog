---
title: "Prisma: a melhor opção para integração com banco de dados?"
date: "29-01-2025"
category: backend
active: true
---
Como desenvolvedores backend/fullstack, sempre queremos facilitar a integração com banco de dados de forma granular e em APIs e SKDs amigáveis, o que nos conecta a bibliotecas e ORMs.

No ecossistema javascript, assim como tudo, temos uma chuva de opções e temos que cogitar entre os prós e contras. Um dos ORMs dos mais utilizados - se não o de fato mais utilizado - é o `prisma`. Mas será que ele é tudo isso mesmo ou facilmente descartável?

## Às primeiras impressões 
> Nessa sessão, você pode começar pela `Schema` e ler como um tutorial!. Caso você já tenha conhecimento sobre o prisma, você pode pular para a próxima sessão.

Na área de backend, eu comecei por tutoriais que utilizavam `mongoDB`, afinal, _eu não precisava saber sobre modelagem e como um banco relacional funciona_. Mas não pude fugir por muito tempo: tinha que tocar no bendito SQL. Eu tinha que lidar com isso. Mas bem, como ia fazer conexão, construir meus modelos, fazer as relações e fazer todos os detalhes restantes de uma integração?

Depois, veio a resposta, que foi o Prisma. O prisma resolvia os problemas ditos - claro que isso não indica que a pessoa tenha que parar de aprender e utilizar conceitos básicos do SQL.

#### Schema
Para a arquitetura e modelagem do DB, o prisma oferece uma abordagem diferente de outros ORMs, que usam classes, decorators e técnicas semelhantes. O prisma trabalha com um **Arquivo de configuração**, onde o dev escreve o seu **schema**, com as tabelas e seus respectivos tipos, as organizando e afins.

Dessa forma, em uma logística dentro da CLI, você controla as migrations e pode versionar o seu DB - de fato, impressionante! Vejamos na prática, como um simples banco para um sismtea onde temos lojas, com funcionários e um dono.

```prisma
model Employee {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  storeId   Int
  store     Store    @relation(fields: [storeId], references: [id])
}
model Owner {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  store     Store[]
}
model Store {
  id        Int      @id @default(autoincrement())
  name      String
  owner     Owner     @relation(fields: [ownerId], references: [id])
  ownerId   Int
  employees User[]
}
```
Talvez pareça um pouco complicado, mas é bem simples: Um model representa uma entidade, uma tabela, e você define os campos e seus tipos. A direita, ficam configurações em relação ao campo, que definem se le é uma chave primária, se tem um valor padrão, se é único, etc.

Note que alguns campos são marcados com _?_, e isso indica que são opcionais (NULL). 
Além disso, você pode definir relações entre as tabelas, como no caso de `Employee` e `Store`, onde um `Employee` pertence a uma `Store`. Elas são guiadas por um campo (`fields`), que é a chave estrangeira, e a referência (`references`), que é a chave primária da tabela referenciada. E é assim que o prisma trabalha com relações. Mais adiante, iremos falar mais sobre.

#### Conexão
Geralmente, você não vai querer expor suas credenciais de banco de dados no código, e o prisma oferece uma integração pronta com variáveis de ambiente. Você deve criar um arquivo `.env` na raiz do projeto, e adicionar uma variável `DATABASE_URL` com a string de conexão do seu banco de dados. 

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```
No arquivo de configuração do prisma, dito na sessão anterior, você faz dessa forma:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
E pronto! O prisma faz a conexão. Note que, o prisma suporta diversos banco de dados, sendo eles:
- PostgreSQL
- MySQL
- SQLite
- SQL Server
- MongoDB
- CockroachDB

Note que ele suporta bancos noSQL, também, e caso você queira mudar de banco, inicialmente basta você mudar o provider no arquivo de configuração, o link de conexão e rodar as migrations. Muito prático!

> PS: Durante mudanças de bancos, você pode ter que mudar algumas coisas no schema, pois cada banco tem suas particularidades!
#### Migrations

O prisma trabalha com uma engine de migrations, que é uma ferramenta que permite você versionar o seu DB.
Tendo seu schema pronto, você pode rodar 

```bash
npx prisma migrate dev
```
E o prisma vai criar as migrations necessárias para o seu banco de dados. É só isso!

Também, nesse processo, ele gera o cliente que iremos falar sobre mais adiante. Nisso, ele insere as tipagens e todos os métodos pra cada tabela que você definiu no schema.

#### O client
Até então só lidamos com modelagem e ambiente. Agora, nós queremos fazer todas as operações no nosso DB, certo? Como temos acesso a uma API? O client!

Rodando nossas migrations, o Prisma gera um client, onde tudo já funciona devidamente tipado e alinhado com nosso schema. Veja um exemplo, ainda com o exemplo de lojas:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// para criar um novo dono
const john = await prisma.owner.create({
  data: {
    email: 'johndoe@gm.co',
    name: 'John Doe',
    password: '123456',
}}),
// E criar uma loja, relacionando com o dono!
const store = await prisma.store.create({
  data: {
    name: 'John Store',
    ownerId: john.id
}})
```
Assim criamos duas entidades e as relacionamos, de forma muito simples. Assim como um CRUD, temos as operações:
- `create` para criar uma nova entidade
- `findMany` ou `findFirst`, `findUnique` para buscar várias ou uma entidade
- `update` para atualizar uma entidade
- `delete` para deletar uma entidade
  
E note que tudo é tipado. Se você tentar passar um campo que não existe, ou um tipo diferente, o typescript vai reclamar. Isso é muito bom, pois evita erros e ajuda o desenvolvedor!

> É recomendável que você crie o client uma vez e o reutilize em toda a aplicação. 

E para relacionamentos, o prisma também é muito bom. Você pode fazer queries que envolvem várias tabelas, e o prisma vai fazer o join pra você. Veja um exemplo:

```typescript
const store = await prisma.store.findUnique({
  where: { id: 1 },
  include: {
    employees: true,
    owner: true
}})
```
Dessa forma, você realiza uma query que traz a loja com todos os funcionários e o dono. E o prisma faz o join pra você, sem você ter que se preocupar com isso.

Note que até agora não tocamos em SQL! Essa é a grande vantagem do prisma: ele abstrai o SQL e te dá uma API amigável e tipada para trabalhar com o seu banco de dados.

#### Bônus: Studio
O prisma também oferece uma ferramenta chamada `prisma studio`, que é uma interface gráfica para você visualizar e manipular o seu banco de dados. Você pode rodar o comando:

```bash
npx prisma studio
```
E veja o que lhe espera! Você pode ver todas as tabelas, seus campos, e criar ou deletar registros. É uma ferramenta muito útil para debugar e visualizar o seu banco de dados. Quase que naturalmente eu sempre abro o studio assim que estou desenvolvendo algo com prisma.

## Às últimas impressões
> Agora, o artigo toma um rumo mais opinativo.

### Com grandes relacionamentos, grandes responsabilidades
Bem, hoje, eu trabalho a mais de um ano com prisma, e de fato, ele é realmente uma ferramenta com uma DX muito boa e é praticamente plug and play. Entretanto, conforme o tempo passou, minhas aplicações cresceram e se tornaram mais complexas, sobretudo com relações mais complexas e queries mais elaboradas.

Para melhorar a performance, calhou evitar selects desnecessários e queries que trazem muitos dados. E aí, o prisma começa a mostrar suas limitações. Quando você faz um `SELECT` padrão, como:

```typescript
const stores = await prisma.store.findMany()
```
Você traz todos os campos da tabela. E ainda mais, se você faz um _find_ como:

```typescript
const store = await prisma.store.findMany({
  include: {
    employees: true,
    owner: true
}})
```
Você traz TODOS os campos de TODAS as tabelas relacionadas. E bem, num contexto de performance, isso é problemático; Ultimamente tenho lidado com relacionamentos mais profundos, e essa semana me deparei escrevendo uma query:

```typescript
await prisma.collectivePurchase.findMany({
      where: { distributorId },
      include: {
        product: true,
        CollectivePurchasePharmacy: {
          select: { pharmacy: { select: { name: true } } },
        },
      },
    })
```

Eu simplesmente queria trazer os dados de uma compra coletiva, com o produto e a farmácia participante, seu nome. Mas para eu chegar no nome da farmácia, eu tinha que passar por outra entity, pois a relação essa many to many. E dentro de um select, eu selecionava a farmácia, e dentro do select da farmácia, enfim eu selecionava o nome. E bem, grande, não?

E bem, esse nem é o maior problema. A grande problemática é que o objeto retornado ficaria em um formato lotado de aninhamentos, como por exemplo:

```typescript
{
  id: 1,
  product: {
    id: 1,
    name: 'Product 1',
    price: 10,
    ...
  },
  CollectivePurchasePharmacy: {
    pharmacy: {
      name: 'Pharmacy 1',
      ...
    }
  }
}
```
Para eu acessar o nome da farmácia, eu teria tem que fazer `collectivePurchase.CollectivePurchasePharmacy.pharmacy.name`. Quando estamos falando em retornar esses dados para o frontend, fica um formato ruim de trabalhar. E isso veio a me incomodar, e foi o que me fez repensar o uso do prisma.

> PS: Caso saiba uma forma de solucionar isso, me chame em uma das minhas redes e vamos discutir!

### Overengineering
Para projetos pequenos, como scripts e coisas simples, ainda que Prisma seja plug and play no quesito da DX, ele é pesado. Prefira usar algo mais simples para esse caso. 

### Generators
Posteriormente, eu descobri que o Prisma tem _generators_, que são plugins que você pode adicionar ao seu projeto para gerar código. Por exemplo, o `zod-prisma` gera validadores para os seus modelos, e o `nexus-prisma` gera um schema GraphQL a partir do seu schema do prisma. E bem, isso é muito bom, pois você pode customizar o seu prisma e adicionar funcionalidades que ele não tem nativamente.

### Extensibilidade

Além disso, o prisma é extensível. Você pode adicionar queries e mutations customizadas, por exemplo, um que comecei a utilizar é o `soft delete` universal para todas as entidades. E bem, isso é muito bom, pois você pode customizar o prisma e adicionar funcionalidades que ele não tem nativamente. Basicamente, você o molda para o seu projeto.

Veja como é simples adicionar o _soft delete_

```typescript
import { PrismaClient } from '@prisma/client'

const softDelete = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      $allModels: {
        // Ignora os registros deletados!
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null }
          return query(args)
        },
        // Converte o delete para um soft delete
        async delete({ args, query }) {
          return (query as any)({
            ...args,
            data: { deletedAt: new Date() }
          })
        }
      }
    },
    model: {
      $allModels: {
        // Restaura um registro "deletado"
        async restore(where: any) {
          const context = Prisma.getExtensionContext(this)
          return (context as any).update({
            where,
            data: { deletedAt: null }
          })
        }
      }
    }
  })
})

// Uso
const prisma = new PrismaClient().$extends(softDelete)
```

Além disso, você pode trabalhar com middlewares(cache!) e outros. É como uma mina a ser explorada.
## Conclusão: vale a pena?

Sim! É uma ferramenta madura, com uma DX muito boa. Ademais, é um ecossistema rico e que tende a crescer, além de estar sempre atualizado. Conforme você a utiliza, você pode ir customizando e adicionando funcionalidades que você precisa, compartilhando entre os seus projetos(e a comunidade!).

Mas, assim como tudo, não é uma bala de prata. Você tem que saber o que está fazendo, e entender as limitações da ferramenta.

E bem, é isso! Espero que você tenha gostado do artigo e que tenha aprendido algo novo. Se você tiver alguma dúvida ou sugestão, me chame em uma das minhas redes sociais. Até a próxima!