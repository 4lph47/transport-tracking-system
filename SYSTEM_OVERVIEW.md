# 🚀 Sistema de Transportes de Moçambique - Visão Geral

## 📋 Descrição do Sistema

Sistema completo de gestão e rastreamento de transportes públicos em tempo real, composto por três aplicações principais e uma base de dados centralizada.

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE TRANSPORTES                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
        │   ADMIN      │ │ CLIENT │ │   DRIVER   │
        │   (3001)     │ │ (3000) │ │   (3002)   │
        └──────────────┘ └────────┘ └────────────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   DATABASE        │
                    │   (Prisma/SQLite) │
                    └───────────────────┘
```

---

## 🎯 Aplicações

### 1. 🔧 **Transport-Admin** (Painel Administrativo)
**Porta**: 3001  
**Utilizadores**: Administradores do sistema

#### Funcionalidades:
- ✅ Dashboard com estatísticas gerais
- ✅ Gestão de Províncias e Municípios
- ✅ Gestão de Vias e Paragens
- ✅ Gestão de Proprietários
- ✅ Gestão de Transportes
- ✅ Gestão de Motoristas
- ✅ Relatórios e análises

#### Páginas:
```
/dashboard          - Dashboard principal
/provincias         - Gestão de províncias
/municipios         - Gestão de municípios
/vias               - Gestão de vias/rotas
/paragens           - Gestão de paragens
/proprietarios      - Gestão de proprietários
/transportes        - Gestão de transportes
/motoristas         - Gestão de motoristas
/relatorios         - Relatórios e estatísticas
```

#### Como Iniciar:
```bash
cd transport-admin
npm install
npm run dev
```

---

### 2. 📱 **Transport-Client** (Aplicação do Passageiro)
**Porta**: 3000  
**Utilizadores**: Passageiros/Utentes

#### Funcionalidades:
- ✅ Subscrição ao serviço (UC1)
- ✅ Pesquisa de transportes por município, via e paragem (UC2)
- ✅ Visualização de transportes em tempo real
- ✅ Mapa interativo com Leaflet/OpenStreetMap
- ✅ Rastreamento de transporte específico
- ✅ Estimativa de tempo de chegada

#### Páginas:
```
/                   - Página inicial com pesquisa
/subscribe          - Subscrição ao serviço
/search             - Resultados de pesquisa
/track/[id]         - Rastreamento de transporte
```

#### Como Iniciar:
```bash
cd transport-client
npm install
npm run dev
```

---

### 3. 🚐 **Transport-Driver** (Portal do Motorista)
**Porta**: 3002  
**Utilizadores**: Motoristas

#### Funcionalidades:
- ✅ Login de motorista
- ✅ Dashboard com informações do veículo
- ✅ Status online/offline
- ✅ Localização GPS em tempo real
- ✅ Contador de passageiros
- ✅ Velocidade atual
- ✅ Atividade recente
- 🚧 Gestão de viagens (em desenvolvimento)
- 🚧 Comunicação com central (em desenvolvimento)

#### Páginas:
```
/                   - Login do motorista
/dashboard          - Dashboard do motorista
```

#### Credenciais de Teste:
- **BI**: `110203456789A`
- **Senha**: `123456`

#### Como Iniciar:
```bash
cd transport-driver
npm install
npm run dev
```

---

## 🗄️ Base de Dados

### Estrutura:
- **ORM**: Prisma
- **Desenvolvimento**: SQLite
- **Produção**: PostgreSQL (recomendado)

### Entidades Principais:

#### 👤 Utilizadores
- **Administrador** - Gestores do sistema
- **Utente** - Passageiros
- **Motorista** - Condutores

#### 📍 Localização
- **Provincia** - Províncias de Moçambique
- **Cidade** - Cidades
- **Municipio** - Municípios

#### 🛣️ Rotas
- **Via** - Rotas de transporte
- **Paragem** - Pontos de paragem
- **ViaParagem** - Associação via-paragem

#### 🚌 Transportes
- **Transporte** - Veículos
- **Proprietario** - Donos dos veículos
- **TransporteProprietario** - Associação

#### 📊 Rastreamento
- **GeoLocation** - Histórico de localização
- **MISSION** - Pedidos de transporte

### Como Configurar:
```bash
cd transport-admin
npm install prisma @prisma/client --legacy-peer-deps
npx prisma generate
npx prisma db push
npx prisma db seed
npx prisma studio  # Visualizar dados
```

---

## 🔄 Fluxo de Uso

### 1. **Subscrição do Utente** (UC1)
```
Utente → Acessa /subscribe
      → Confirma subscrição
      → Insere telefone
      → Aceita termos
      → Recebe SMS de confirmação
      → ID único gerado
      → Pode usar o serviço
```

### 2. **Pesquisa de Transporte** (UC2)
```
Utente → Seleciona município
      → Seleciona via
      → Seleciona direção
      → Seleciona paragem
      → Sistema busca 3 transportes mais próximos
      → Mostra no mapa com ETA
      → Envia SMS com informações
```

### 3. **Registro de Proprietário** (UC3)
```
Admin → Acessa /proprietarios
     → Preenche formulário
     → Salva dados
     → Sistema valida
     → Proprietário registado
```

### 4. **Operação do Motorista**
```
Motorista → Faz login
         → Ativa status online
         → GPS atualiza localização
         → Atualiza contador de passageiros
         → Sistema envia localização para utentes
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Leaflet** - Mapas interativos
- **OpenStreetMap** - Dados de mapas

### Backend
- **Prisma** - ORM
- **SQLite** - Base de dados (dev)
- **PostgreSQL** - Base de dados (prod)

### APIs
- **Geolocation API** - GPS do navegador
- **SMS API** - Envio de mensagens (a integrar)

---

## 📊 Dados de Demonstração

### Administrador
- Email: `admin@transportmz.com`
- Senha: `admin123`

### Motoristas
```
1. João Manuel Silva
   BI: 110203456789A
   Senha: 123456
   Transporte: AAA-1234-MP (Toyota Hiace)
   Rota: Zimpeto - Baixa

2. Maria Santos Costa
   BI: 110204567890B
   Senha: 123456
   Transporte: BBB-5678-MP (Mercedes Sprinter)
   Rota: Zimpeto - Baixa
```

### Rotas Disponíveis
1. **Zimpeto - Baixa** (VIA-001)
   - Terminal Zimpeto
   - Paragem Albazine
   - Paragem Xipamanine
   - Paragem Sommerschield
   - Paragem Polana
   - Terminal Baixa

2. **Costa do Sol** (VIA-002)
   - Terminal Costa do Sol
   - Terminal Baixa

---

## 🚀 Iniciar Todo o Sistema

### Opção 1: Manualmente (3 terminais)

**Terminal 1 - Admin:**
```bash
cd transport-admin
npm run dev
```

**Terminal 2 - Client:**
```bash
cd transport-client
npm run dev
```

**Terminal 3 - Driver:**
```bash
cd transport-driver
npm run dev
```

### Opção 2: Script (criar)
```bash
# start-all.sh
#!/bin/bash
cd transport-admin && npm run dev &
cd transport-client && npm run dev &
cd transport-driver && npm run dev &
wait
```

---

## 📱 Acessar Aplicações

- **Admin**: http://localhost:3001
- **Client**: http://localhost:3000
- **Driver**: http://localhost:3002
- **Prisma Studio**: http://localhost:5555 (após `npx prisma studio`)

---

## 🔐 Segurança

### Implementado:
- ✅ Validação de formulários
- ✅ Sanitização de inputs
- ✅ Autenticação básica

### A Implementar:
- 🚧 JWT tokens
- 🚧 Refresh tokens
- 🚧 Rate limiting
- 🚧 HTTPS em produção
- 🚧 Criptografia de senhas (bcrypt)
- 🚧 2FA para admin

---

## 📈 Roadmap

### Q2 2026
- [x] Estrutura base das 3 aplicações
- [x] Base de dados com Prisma
- [x] Subscrição de utentes
- [x] Pesquisa de transportes
- [x] Mapa interativo
- [x] Dashboard do motorista
- [ ] Rastreamento GPS em tempo real
- [ ] Integração SMS

### Q3 2026
- [ ] Sistema de viagens completo
- [ ] Notificações push
- [ ] Chat motorista-central
- [ ] Relatórios avançados
- [ ] App mobile (React Native)

### Q4 2026
- [ ] Integração com pagamentos
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Analytics avançado

### Q1 2027
- [ ] IA para previsão de demanda
- [ ] Otimização de rotas
- [ ] Expansão para outras cidades

---

## 📞 Suporte

### Documentação
- `DATABASE_STRUCTURE.md` - Estrutura da base de dados
- `GOOGLE_MAPS_SETUP.md` - Configuração do Google Maps
- `README.md` (cada app) - Documentação específica

### Contato
- Email: suporte@transportmz.com
- Telefone: +258 84 000 0000

---

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Sistema de Transportes de Moçambique © 2026

---

**Última atualização**: 28 de Abril de 2026
**Versão**: 1.0.0
