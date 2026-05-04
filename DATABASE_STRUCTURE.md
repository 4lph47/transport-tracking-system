# 🗄️ Estrutura da Base de Dados - Sistema de Transportes

## 📋 Visão Geral

Este documento descreve a estrutura completa da base de dados do Sistema de Transportes de Moçambique, baseado no modelo de domínio fornecido.

## 🏗️ Arquitetura

- **ORM**: Prisma
- **Base de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Localização**: `transport-admin/prisma/`

## 📊 Entidades Principais

### 1. **ADMINISTRAÇÃO**

#### Administrador
Gestores do sistema com acesso total.

```prisma
- id: String (UUID)
- nome: String
- email: String (único)
- senha: String (hash)
- createdAt: DateTime
- updatedAt: DateTime
```

**Relações:**
- Gere múltiplas Províncias
- Gere múltiplos Municípios
- Gere múltiplas Vias
- Gere múltiplas Paragens

---

### 2. **LOCALIZAÇÃO GEOGRÁFICA**

#### Provincia
Divisão administrativa de nível superior.

```prisma
- id: String (UUID)
- nome: String
- geoLocation: String (lat,lng)
- codigo: String (único)
- administradorId: String
```

#### Cidade
Cidades dentro de uma província.

```prisma
- id: String (UUID)
- nome: String
- localizacao: String (lat,lng)
- codigo: String (único)
- codigoProvinciaString: String
- provinciaId: String
```

#### Municipio
Municípios dentro de cidades/províncias.

```prisma
- id: String (UUID)
- nome: String
- codigo: String (único)
- endereco: String
- contacto1: Int
- codigoCidade: String
- administradorId: String
- provinciaId: String
- cidadeId: String
```

---

### 3. **ROTAS E PARAGENS**

#### Via
Rotas de transporte entre terminais.

```prisma
- id: String (UUID)
- nome: String
- codigo: String (único)
- cor: String (hex color)
- terminalPartida: String
- terminalChegada: String
- geoLocationPath: String (coordenadas separadas por ;)
- codigoMunicipio: String
- municipioId: String
- administradorId: String
```

**Exemplo de geoLocationPath:**
```
-25.9892,32.5432;-25.9812,32.5532;-25.9732,32.5632
```

#### Paragem
Pontos de paragem ao longo das vias.

```prisma
- id: String (UUID)
- nome: String
- codigo: String (único)
- geoLocation: String (lat,lng)
- administradorId: String
```

#### ViaParagem (Tabela de Junção)
Associa paragens às vias.

```prisma
- id: String (UUID)
- codigoParagem: String
- codigoVia: String
- terminalBoolean: Boolean (indica se é terminal)
- viaId: String
- paragemId: String
```

---

### 4. **PROPRIETÁRIOS E TRANSPORTES**

#### Proprietario
Donos dos veículos de transporte.

```prisma
- id: String (UUID)
- nome: String
- bi: String (único)
- nacionalidade: String
- birthDate: DateTime
- endereco: String
- contacto1: Int
- contacto2: Int (opcional)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Transporte
Veículos de transporte público.

```prisma
- id: String (UUID)
- matricula: String (único)
- modelo: String
- marca: String
- cor: String
- lotacao: Int (capacidade de passageiros)
- codigo: Int (único)
- codigoVia: String
- currGeoLocation: String (localização atual)
- viaId: String
- createdAt: DateTime
- updatedAt: DateTime
```

#### TransporteProprietario (Tabela de Junção)
Associa proprietários aos transportes (um transporte pode ter múltiplos proprietários).

```prisma
- id: String (UUID)
- codigoTransporte: Int
- idProprietario: String
- transporteId: String
- proprietarioId: String
```

---

### 5. **MOTORISTAS**

#### Motorista
Condutores dos transportes.

```prisma
- id: String (UUID)
- nome: String
- bi: String (único)
- cartaConducao: String (único)
- telefone: String
- email: String (único)
- dataNascimento: DateTime
- endereco: String
- status: String (ativo, inativo, suspenso)
- transporteId: String (opcional)
- createdAt: DateTime
- updatedAt: DateTime
```

**Status possíveis:**
- `ativo`: Motorista em serviço
- `inativo`: Motorista temporariamente fora de serviço
- `suspenso`: Motorista suspenso por infrações

---

### 6. **UTENTES (PASSAGEIROS/CLIENTES)**

#### Utente
Utilizadores do sistema (passageiros).

```prisma
- id: String (UUID)
- mISSION: String (identificador único)
- telefone: String (único)
- geoLocation: String (localização atual)
- subscrito: Boolean
- dataSubscricao: DateTime
- createdAt: DateTime
- updatedAt: DateTime
```

---

### 7. **MISSÕES E LOCALIZAÇÃO**

#### MISSION
Pedidos de transporte dos utentes.

```prisma
- id: String (UUID)
- mISSIONUtente: String
- codigoParagem: String
- geoLocationUtente: String
- geoLocationParagem: String
- utenteId: String
- paragemId: String
- createdAt: DateTime
- updatedAt: DateTime
```

#### GeoLocation
Histórico de localização dos transportes.

```prisma
- id: String (UUID)
- geoLocationTransporte: String (localização atual)
- geoDirection: String (direção/destino)
- codigoTransporte: Int
- geoLocationHist1: String (histórico 1)
- geoLocationHist2: String (histórico 2)
- geoLocationHist3: String (histórico 3)
- geoDateTime1: DateTime
- geoDateTime2: DateTime
- geoDateTime3: DateTime
- transporteId: String
- createdAt: DateTime
```

---

## 🔗 Diagrama de Relações

```
Administrador
├── Provincia
│   ├── Cidade
│   └── Municipio
│       └── Via
│           ├── ViaParagem ←→ Paragem
│           └── Transporte
│               ├── TransporteProprietario ←→ Proprietario
│               ├── Motorista
│               └── GeoLocation

Utente
└── MISSION ←→ Paragem
```

---

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
cd transport-admin
npm install prisma @prisma/client --legacy-peer-deps
```

### 2. Gerar Cliente Prisma

```bash
npx prisma generate
```

### 3. Criar Base de Dados

```bash
npx prisma db push
```

### 4. Popular com Dados Iniciais

```bash
npx prisma db seed
```

### 5. Visualizar Base de Dados (Prisma Studio)

```bash
npx prisma studio
```

Abre interface visual em `http://localhost:5555`

---

## 📝 Exemplos de Uso

### Criar um Transporte

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const transporte = await prisma.transporte.create({
  data: {
    matricula: 'DDD-3456-MP',
    modelo: 'Hiace',
    marca: 'Toyota',
    cor: 'Branco',
    lotacao: 15,
    codigo: 1004,
    codigoVia: 'VIA-001',
    viaId: 'via-id-aqui',
    currGeoLocation: '-25.9692,32.5732',
  },
});
```

### Buscar Transportes de uma Via

```typescript
const transportes = await prisma.transporte.findMany({
  where: {
    viaId: 'via-id-aqui',
  },
  include: {
    via: true,
    motoristas: true,
    proprietarios: {
      include: {
        proprietario: true,
      },
    },
  },
});
```

### Criar Subscrição de Utente

```typescript
const utente = await prisma.utente.create({
  data: {
    mISSION: 'USER-003',
    telefone: '+258 84 000 0003',
    geoLocation: '-25.9692,32.5732',
    subscrito: true,
    dataSubscricao: new Date(),
  },
});
```

### Atualizar Localização do Transporte

```typescript
await prisma.transporte.update({
  where: { id: 'transporte-id' },
  data: {
    currGeoLocation: '-25.9612,32.5832',
  },
});

// Criar histórico
await prisma.geoLocation.create({
  data: {
    geoLocationTransporte: '-25.9612,32.5832',
    geoDirection: 'Terminal Baixa',
    codigoTransporte: 1001,
    transporteId: 'transporte-id',
    geoLocationHist1: '-25.9692,32.5732',
    geoDateTime1: new Date(),
  },
});
```

---

## 🔐 Segurança

### Senhas
- Sempre usar hash (bcrypt, argon2)
- Nunca armazenar senhas em texto plano

### Tokens
- Usar JWT para autenticação
- Implementar refresh tokens

### Validação
- Validar todos os inputs
- Usar Zod ou Yup para schemas

---

## 📱 Integração com Aplicações

### Transport-Admin (Painel Administrativo)
- CRUD completo de todas as entidades
- Dashboard com estatísticas
- Gestão de motoristas e transportes

### Transport-Client (Aplicação do Utente)
- Subscrição de utentes
- Pesquisa de transportes
- Rastreamento em tempo real

### Transport-Driver (Aplicação do Motorista) - Futuro
- Login de motoristas
- Atualização de localização
- Gestão de rotas

---

## 🔄 Migrações

Para criar uma migração após alterar o schema:

```bash
npx prisma migrate dev --name nome_da_migracao
```

Para aplicar migrações em produção:

```bash
npx prisma migrate deploy
```

---

## 📊 Dados de Exemplo

O seed cria:
- 1 Administrador
- 2 Províncias (Maputo, Gaza)
- 2 Cidades
- 2 Municípios
- 2 Vias (Zimpeto-Baixa, Costa do Sol)
- 6 Paragens
- 2 Proprietários
- 3 Transportes
- 3 Motoristas
- 2 Utentes

---

## 🛠️ Manutenção

### Backup da Base de Dados

```bash
# SQLite
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# PostgreSQL
pg_dump database_name > backup.sql
```

### Reset da Base de Dados

```bash
npx prisma migrate reset
```

⚠️ **Atenção**: Isso apaga todos os dados!

---

## 📞 Suporte

Para questões sobre a base de dados:
1. Consulte a documentação do Prisma: https://www.prisma.io/docs
2. Verifique o schema em `prisma/schema.prisma`
3. Execute `npx prisma studio` para visualizar os dados

---

**Última atualização**: 28 de Abril de 2026
