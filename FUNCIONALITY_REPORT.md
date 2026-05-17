# Sistema de Transportes de Moçambique - Relatório de Funcionalidades

---

## 1. Visão Geral do Sistema

O **Sistema de Transportes de Moçambique** é uma plataforma completa de gestão e rastreamento de transportes públicos em tempo real, desenvolvido especificamente para o contexto moçambicano. O sistema permite que passageiros pesquisem e acompanhem transportes públicos, que motoristas gerenciem suas viagens, e que administradores gerenciem toda a infraestrutura do sistema.

**Objetivo Principal:** Disponibilizar informação em tempo real sobre transportes públicos para melhorar a mobilidade urbana em Moçambique.

---

## 2. Plataformas e Tecnologias

### 2.1 Plataformas de Desenvolvimento

| Plataforma | Descrição | Link de Acesso |
|-------------|-----------|----------------|
| **Next.js 16.2.4** | Framework React com Server Side Rendering | - |
| **React 19** | Biblioteca de UI | - |
| **TypeScript** | Tipagem estática | - |
| **Tailwind CSS 4** | Framework de estilização | - |
| **Prisma 5.22** | ORM para PostgreSQL | - |

### 2.2 Tecnologias de Mapa e Localização

| Tecnologia | Uso |
|------------|-----|
| **MapLibre GL** | Mapas interativos 3D com OpenStreetMap/OpenFreeMap |
| **OSRM** | Routing (Planeamento de rotas seguindo estradas reais) |
| **OpenStreetMap** | Dados cartográficos abertos |
| **OpenFreeMap** | Estilos de mapas 3D |
| **Geolocation API** | Localização GPS do utilizador |

### 2.3 Serviços de Comunicação

| Serviço | Funcionalidade |
|---------|----------------|
| **Africa's Talking** | Envio de SMS e USSD para notificações |
| **Telerivet** | Alternative USSD/SMS |

### 2.4 Base de Dados

| Tecnologia | Descrição |
|------------|-----------|
| **PostgreSQL** | Base de dados principal (Neon/Vercel) |
| **Prisma** | ORM para gestão de dados |

---

## 3. Arquitetura das Aplicações

```
Sistema de Transportes de Moçambique
├── transport-admin/    (Porta 3001) - Painel Administrativo
├── transport-client/   (Porta 3000) - Aplicação do Passageiro
├── transport-driver/  (Porta 3002) - Portal do Motorista
└── app/ (Principal)     (Porta 3000) - App principal com todas as APIs
```

---

## 4. Funcionalidades por Plataforma

---

### 4.1 transport-client (Aplicação do Passageiro)

**URL:** http://localhost:3000

#### 4.1.1 Página Inicial (Landing Page)

**Funcionalidades:**
- Mapa interativo 3D mostrando todos os transportes em circulação
- Marcadores personalizados para cada autocarro (ícone 3D azul/amarelo)
- Localização do utilizador (geolocalização automática)
- Contador de transportes em tempo real
- Botão "Entrar" para autenticação

**[Screenshot Area 1 - Página Inicial com Mapa]**
- Capture: Página inicial mostrando o mapa 3D com marcadores de autocarros
- Como obter: Aceder a http://localhost:3000

---

#### 4.1.2 Sistema de Autenticação

**Funcionalidades:**
- Registo de novos utilizadores
- Login de utentes existentes
- Guardar sessão no localStorage

**Fluxo:**
1. Utilizador insere telefone
2. Sistema verifica se já existe
3. Cria ID único (USER-XXXXXXXX)

**[Screenshot Area 2 - Página de Login/Registo]**
- Capture: Página /auth com formulário de entrada
- Como obter: http://localhost:3000/auth

---

#### 4.1.3 Página de Subscrição

**Funcionalidades:**
- Formulário de subscrição ao serviço
- Compromissos do serviço:
  - Localização em tempo real
  - Tempo de chegada estimado
  - Rotas e paragens completas
  - Notificações SMS
- Termos e condições
- Confirmação por SMS

**[Screenshot Area 3 - Página de Subscrição]**
- Capture: Passos do formulário de subscrição (3 passos)
- Como obter: http://localhost:3000/subscribe

---

#### 4.1.4 Pesquisa de Transportes

**Funcionalidades:**
- Pesquisa por 4 critérios:
  1. **Município** - Seleção de distrito
  2. **Rota** - Direção (Origem → Destino)
  3. **Paragem de Origem** - Onde o passageiro está
  4. **Destino** - Paragem final
- Indicador de progresso (4 passos)
- Filtragem inteligente de rotas
-高速 Mostrar número de opções disponíveis

**Resultado da Pesquisa:**
- Lista de transportes disponíveis
- Para cada transporte:
  - Matrícula
  - Rota/Via
  - Tempo estimado (min)
  - Distância (m/km)
  - Velocidade (km/h)
  - Preço (MT)
- Botão "Acompanhar" para tracking

**[Screenshot Area 4 - Pesquisa de Transportes]**
- Capture: Formulário de pesquisa preenchido
- Como obter: http://localhost:3000/search

**[Screenshot Area 5 - Resultados da Pesquisa]**
- Capture: Lista de transportes encontrados
- Como obter: Após pesquisar em http://localhost:3000/search

---

#### 4.1.5 Tracking em Tempo Real

**Funcionalidades:**
- Mapa 3D com rota do transporte
- Marcador do autocarro em movimento
- Marcadores de paragens (origem e destino)
- Localização do utilizador
- Rota traçada (seguindo estradas reais via OSRM)
- Info popup com detalhes do transporte

**[Screenshot Area 6 - Página de Tracking]**
- Capture: Mapa mostrando rota e posição do autocarro
- Como obter: Clicar "Acompanhar" num transporte

---

#### 4.1.6 Meus Transportes

**Funcionalidades:**
- Lista de transportes favoritos/guardados
- Acesso rápido ao tracking

**[Screenshot Area 7 - Meus Transportes]**
- Capture: Lista de transportes guardados
- Como obter: http://localhost:3000/my-transports

---

### 4.2 transport-admin (Painel Administrativo)

**URL:** http://localhost:3001

**Credenciais:**
- Email: admin@transportmz.com
- Password: admin123

#### 4.2.1 Dashboard

**Funcionalidades:**
- Estatísticas gerais:
  - Total de transportes
  - Total de motoristas
  - Total de vias (rotas)
  - Total de paragens
  - Total de proprietários
  - Total de províncias
  - Total de municípios
- Alertas (transportes sem motorista)
- Gráficos circulares:
  - Vias por município
  - Paragens por município
  - Estado dos transportes (com/sem motorista)
  - Estado dos motoristas (ativos/disponíveis)
- Mapa interativo 3D com todas as vias
- Lista de vias com contagem de transportes

**[Screenshot Area 8 - Dashboard Admin]**
- Capture: Página principal do admin com estatísticas e mapa
- Como obter: http://localhost:3001/dashboard

---

#### 4.2.2 Gestão de Províncias

**Funcionalidades:**
- Lista de províncias
- Criar nova província
- Editar província
- Ver detalhes

**[Screenshot Area 9 - Províncias]**
- Capture: Lista de províncias
- Como obter: http://localhost:3001/provincias

---

#### 4.2.3 Gestão de Municípios

**Funcionalidades:**
- Lista de municípios
- Criar novo município
- Editar município
- Associar a província
- Ver transports e vias associadas

**[Screenshot Area 10 - Municípios]**
- Capture: Lista de municípios
- Como obter: http://localhost:3001/municipios

---

#### 4.2.4 Gestão de Vias (Rotas)

**Funcionalidades:**
- Lista de vias/rotas
- Criar nova via
- Editar via
- Definir:
  - Nome da via
  - Código único
  - Cor (para visualização no mapa)
  - Terminal de partida
  - Terminal de chegada
  - Municipio
  - Trajecto geográfico
- Ver paragens associadas
- Ver transportes associados

**[Screenshot Area 11 - Vias/Rotas]**
- Capture: Lista de vias com cores
- Como obter: http://localhost:3001/vias

---

#### 4.2.5 Gestão de Paragens

**Funcionalidades:**
- Lista de paragens
- Criar nova paragem
- Editar paragem
- Definir:
  - Nome da paragem
  - Código único
  - Localização (latitude/longitude)
- Associar a vias

**[Screenshot Area 12 - Paragens]**
- Capture: Lista de paragens
- Como obter: http://localhost:3001/paragens

---

#### 4.2.6 Gestão de Proprietários

**Funcionalidades:**
- Lista de proprietários
- Criar novo proprietário
- Editar proprietário
- Tipos: Individuo ou Empresa
- Dados pessoais:
  - Nome
  - BI
  - Nacionalidade
  - Data de nascimento
  - Endereço
  - Contactos
- Ver transportes associados

**[Screenshot Area 13 - Proprietários]**
- Capture: Lista de proprietários
- Como obter: http://localhost:3001/proprietarios

---

#### 4.2.7 Gestão de Transportes

**Funcionalidades:**
- Lista de transportes
- Criar novo transporte
- Editar transporte
- Definir:
  - Matrícula
  - Marca
  - Modelo
  - Cor
  - Lotação
  - Código único
- Associar a via
- Associar a proprietário(s)
- Ver motorista associado

**[Screenshot Area 14 - Transportes]**
- Capture: Lista de transportes
- Como obter: http://localhost:3001/transportes

---

#### 4.2.8 Gestão de Motoristas

**Funcionalidades:**
- Lista de motoristas
- Criar novo motorista
- Editar motoristata
- Atribuir a transporte
- Dados completos:
  - Nome
  - BI
  - Carta de condução
  - Telefone
  - Email
  - Data de nascimento
  - Endereço
  - Foto
  - Categoria de carta
  - Anos de experiência
- Estado (ativo/inativo/suspenso)

**[Screenshot Area 15 - Motoristas]**
- Capture: Lista de motoristas
- Como obter: http://localhost:3001/motoristas

---

#### 4.2.9 Relatórios

**Funcionalidades:**
- Relatórios personalizáveis
- Histórico de relatórios
- Agendamento de relatórios

**[Screenshot Area 16 - Relatórios]**
- Capture: Página de relatórios
- Como obter: http://localhost:3001/relatorios

---

### 4.3 transport-driver - Portal do Motorista
URL de acesso: http://localhost:3002
Credenciais de teste: BI 110203456789A / senha 123456

#### 4.3.1 Dashboard do Motorista
•	Informacoes do motorista e veiculo
•	Status de servico (Online/Offline) com toggle
•	Controlo de viagem (Iniciar/Finalizar)
•	Localizacao GPS, velocidade e contador de passageiros (0-15)
•	Acoes rapidas: Ver Rota, Estatisticas, Reportar, Suporte
•	Atividade recente

[ Figura 17 ]
Dashboard do Motorista - Status e controlos de viagem
Screenshot a capturar em: http://localhost:3002/dashboard

---

#### 4.3.2 Ver Rota
•	Mapa 3D com a rota completa
•	Visualizacao do trajecto atribuido

[ Figura 18 ]
Rota do Motorista - Mapa com trajecto atribuido
Screenshot a capturar em: http://localhost:3002/route

---

#### 4.3.3 Estatisticas
•	Estatisticas de viagens realizadas
•	Passageiros transportados

[ Figura 19 ]
Estatisticas do Motorista - Viagens e passageiros
Screenshot a capturar em: http://localhost:3002/stats

---

#### 4.3.4 Reportar Problemas
•	Formulario para reportar problemas
•	Envio direto para a administracao

[ Figura 20 ]
Reportar Problemas - Formulario de reporte
Screenshot a capturar em: http://localhost:3002/report

---

### 4.4 API Principal (app/)

**URL:** http://localhost:3000

#### 4.4.1 APIs Disponíveis

| Endpoint | Descrição |
|----------|-----------|
| `/api/buses` | Lista de transportes com localização |
| `/api/locations` | Localizações (vias, paragens) |
| `/api/auth/*` | Autenticação |
| `/api/ussd` | Interface USSD |
| `/api/simulation` | Simulação de localização |
| `/api/dashboard/stats` | Estatísticas do dashboard |

---

### 4.5 Plataforma USSD
Código de acesso simulado: `*384*123#` (disponível no simulador da aplicação)

#### 4.5.1 Menu do Passageiro (USSD)
•	Encontrar Transporte Agora (pesquisa de transportes ativos com origem, destino e estimativa de tempo)
•	Procurar Rotas (listagem e consulta de rotas por distrito e via)
•	Paragens Próximas (lista paginada de paragens por zona)
•	Calcular Tarifa (consulta rápida do custo estimado da viagem)
•	Rastrear Autocarro (busca direta pela matrícula do veículo)
•	Ajuda (instruções completas do sistema)

[ Figura 21 ]
Menu Principal do Passageiro no USSD
Screenshot a capturar em: http://localhost:3000/api/ussd

---

#### 4.5.2 Portal do Motorista no USSD (Área do Motorista)
•	Autenticação móvel segura com número de telefone e palavra-passe (Stateless validation)
•	Iniciar Viagem (atualização instantânea de estado e início de circulação)
•	Encerrar Viagem (fechamento automático de viagem com libertação do veículo)
•	Controle de fluxo de viagem em tempo real baseado no estado atual do motorista

[ Figura 22 ]
Área do Motorista no USSD - Menu de controle de viagem
Screenshot a capturar em: http://localhost:3000/api/ussd

---

## 5. Modelo de Dados

### 5.1 Entidades Principais

```
Administrador
├── nome, email, senha
└── gestiona: Provincias, Municipios, Vias, Paragens

Provincia
├── nome, codigo, geoLocation
└──tem: Cidades, Municipios

Municipio
├── nome, codigo, endereco, contacto
└──tem: Vias

Via (Rota)
├── nome, codigo, cor, terminalPartida, terminalChegada
├── geoLocationPath (trajecto)
└──tem: Paragens, Transportes

Paragem
├── nome, codigo, geoLocation
└──pertence a: Vias

Proprietario
├── nome, bi, nacionalidade, birthDate, endereco, contactos
└──tem: Transportes

Transporte
├── matricula, modelo, marca, cor, lotacao, codigo
├── currGeoLocation, routePath
├── associado a: Via, Proprietario, Motorista
└──tem: GeoLocations (histórico)

Motorista
├── nome, bi, cartaConducao, telefone, email
├── dataNascimento, endereco, foto
├── categoriaCarta, experienciaAnos
└──estado: ativo/inativo/suspenso

Utente (Passageiro)
├── nome, email, telefone, senha
├── missionId (identificador único)
├── subscrito, dataSubscricao
└──tem: Missoes

MISSION
├── missionUtente, codigoParagem
├── geoLocationUtente, geoLocationParagem
└──pertence a: Utente, Paragem

GeoLocation
├── geoLocationTransporte, geoDirection
├── codigoTransporte
└──histórico: 3 localizações anteriores
```

---

## 6. Fluxo de Utilização

### 6.1 Fluxo do Passageiro

```
1. Aceder à aplicação (http://localhost:3000)
2. Ver mapa com transportes em tempo real
3. Subscrever ao serviço (opcional)
4. Pesquisar transporte:
   - Selecionar Município
   - Selecionar Rota
   - Selecionar Paragem de Origem
   - Selecionar Destino
5. Ver resultados da pesquisa
6. Clicar "Acompanhar" para ver localização em tempo real
7. Guardar transporte favorito (opcional)
```

### 6.2 Fluxo do Motorista

```
1. Fazer login no portal (http://localhost:3002)
2. Ver dashboard com informações do veículo
3. Ativar status "Online"
4. Iniciar viagem
5. Atualizar contador de passageiros
6. Ver rota no mapa
7. Finalizar viagem
8. Desativar status
```

### 6.3 Fluxo do Administrador

```
1. Fazer login no admin (http://localhost:3001)
2. Ver dashboard com estatísticas
3. Gerir dados:
   - Províncias
   - Municípios
   - Vias/Rotas
   - Paragens
   - Proprietários
   - Transportes
   - Motoristas
4. Atribuir motoristas a transportes
5. Gerar relatórios
```

---

## 7. Screenshots Recomendados

### Resumo dos Screenshots a Capturar

| # | Localização | Descrição | Como Obter |
|---|-------------|-----------|------------|
| 1 | transport-client | Página inicial com mapa 3D | http://localhost:3000 |
| 2 | transport-client | Página de autenticação | http://localhost:3000/auth |
| 3 | transport-client | Formulário de subscrição | http://localhost:3000/subscribe |
| 4 | transport-client | Pesquisa de transportes | http://localhost:3000/search |
| 5 | transport-client | Resultados da pesquisa | Após pesquisar |
| 6 | transport-client | Tracking em tempo real | Clicar "Acompanhar" |
| 7 | transport-client | Meus transportes | http://localhost:3000/my-transports |
| 8 | transport-admin | Dashboard com estatísticas | http://localhost:3001/dashboard |
| 9 | transport-admin | Gestão de províncias | http://localhost:3001/provincias |
| 10 | transport-admin | Gestão de municípios | http://localhost:3001/municipios |
| 11 | transport-admin | Gestão de vias/rotas | http://localhost:3001/vias |
| 12 | transport-admin | Gestão de paragens | http://localhost:3001/paragens |
| 13 | transport-admin | Gestão de proprietários | http://localhost:3001/proprietarios |
| 14 | transport-admin | Gestão de transportes | http://localhost:3001/transportes |
| 15 | transport-admin | Gestão de motoristas | http://localhost:3001/motoristas |
| 16 | transport-admin | Relatórios | http://localhost:3001/relatorios |
| 17 | transport-driver | Dashboard do motorista | http://localhost:3002/dashboard |
| 18 | transport-driver | Ver rota | http://localhost:3002/route |
| 19 | transport-driver | Estatísticas | http://localhost:3002/stats |
| 20 | transport-driver | Reportar problemas | http://localhost:3002/report |
| 21 | USSD Simulator | Menu do Passageiro no USSD | http://localhost:3000/api/ussd |
| 22 | USSD Simulator | Portal do Motorista no USSD | http://localhost:3000/api/ussd |

### Como Capturar os Screenshots

1. **Iniciar as aplicações:**
   ```bash
   # Terminal 1
   cd transport-admin && npm run dev
   
   # Terminal 2
   cd transport-client && npm run dev
   
   # Terminal 3
   cd transport-driver && npm run dev
   ```

2. **Capturar cada screenshot** usando as URLs indicadas

3. **Para admin e driver**, fazer login primeiro:
   - Admin: admin@transportmz.com / admin123
   - Driver: 110203456789A / 123456

---

## 8. Información Adicional

### 8.1 Estrutura de Diretórios

```
Transports-Aplication/
├── app/                    # App principal (APIs + páginas)
├── transport-admin/        # Painel administrativo
├── transport-client/      # App do passageiro
├── transport-driver/      # Portal do motorista
├── lib/                   # Bibliotecas partilhadas
├── prisma/                # Schema da base de dados
├── scripts/               # Scripts de gestão
├── types/                 # Definições TypeScript
└── public/               # Ficheiros estáticos
```

### 8.2 Funcionalidades em Desenvolvimento

- [ ] Rastreamento GPS em tempo real (simulado)
- [x] Integração completa com USSD (incluindo Portal do Motorista stateless)
- [ ] Notificações push
- [ ] Sistema de pagamentos
- [ ] App mobile

### 8.3 Cores e Estilos

- **Cor primária:** Azul (#3B82F6)
- **Cores das vias:** Variadas (cada via tem cor diferente)
- **Mapa:** Estilo liberty do OpenFreeMap com edifícios 3D

### 8.4 Dados de Teste

- **Admin:** admin@transportmz.com / admin123
- **Motorista:** BI 110203456789A / senha 123456

---

## 9. Conclusão

Este sistema oferece uma solução completa para a gestão e acompanhamento de transportes públicos em Moçambique, com três interfaces distintas para passageiros, motoristas e administradores. A tecnologia de mapas 3D e o tracking em tempo real proporcionam uma experiência moderna e útil para os utilizadores.

---

*Documento gerado em: 2026-05-16*
*Sistema: Sistema de Transportes de Moçambique*