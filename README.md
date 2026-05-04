# 🚀 Sistema de Transportes de Moçambique

Sistema completo de gestão e rastreamento de transportes públicos em tempo real.

## 📦 Estrutura do Projeto

```
Transports-Aplication/
├── transport-admin/      # Painel Administrativo (porta 3001)
├── transport-client/     # Aplicação do Passageiro (porta 3000)
├── transport-driver/     # Portal do Motorista (porta 3002)
├── start-all.bat        # Script para iniciar todas as apps
├── SYSTEM_OVERVIEW.md   # Visão geral completa do sistema
└── DATABASE_STRUCTURE.md # Documentação da base de dados
```

## 🎯 Aplicações

### 1. 🔧 Transport-Admin (Administração)
Painel para gestão completa do sistema.

**Funcionalidades:**
- Dashboard com estatísticas
- Gestão de províncias, municípios, vias e paragens
- Gestão de proprietários, transportes e motoristas
- Relatórios e análises

**Acesso:** http://localhost:3001

### 2. 📱 Transport-Client (Passageiro)
Aplicação para passageiros pesquisarem e rastrearem transportes.

**Funcionalidades:**
- Subscrição ao serviço
- Pesquisa de transportes
- Mapa em tempo real
- Rastreamento de veículos

**Acesso:** http://localhost:3000

### 3. 🚐 Transport-Driver (Motorista)
Portal para motoristas gerenciarem suas viagens.

**Funcionalidades:**
- Login de motorista
- Dashboard com status
- Localização GPS
- Contador de passageiros

**Acesso:** http://localhost:3002

## 🚀 Início Rápido

### Opção 1: Iniciar Tudo de Uma Vez (Windows)

```bash
# Execute o script
start-all.bat
```

### Opção 2: Iniciar Manualmente

**Terminal 1 - Admin:**
```bash
cd transport-admin
npm install
npm run dev
```

**Terminal 2 - Client:**
```bash
cd transport-client
npm install
npm run dev
```

**Terminal 3 - Driver:**
```bash
cd transport-driver
npm install
npm run dev
```

## 🗄️ Base de Dados

### Configurar Prisma (Opcional - para desenvolvimento avançado)

```bash
cd transport-admin
npm install prisma @prisma/client --legacy-peer-deps
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Visualizar Dados

```bash
npx prisma studio
```

Abre em: http://localhost:5555

## 📊 Dados de Teste

### Motorista (Transport-Driver)
- **BI**: `110203456789A`
- **Senha**: `123456`

### Administrador (Transport-Admin)
- **Email**: `admin@transportmz.com`
- **Senha**: `admin123`

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma** - ORM
- **Leaflet** - Mapas interativos
- **SQLite** - Base de dados

## 📱 Portas

| Aplicação | Porta | URL |
|-----------|-------|-----|
| Admin | 3001 | http://localhost:3001 |
| Client | 3000 | http://localhost:3000 |
| Driver | 3002 | http://localhost:3002 |
| Prisma Studio | 5555 | http://localhost:5555 |

## 📚 Documentação

- **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** - Visão geral completa
- **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** - Estrutura da base de dados
- **[transport-admin/README.md](transport-admin/README.md)** - Documentação do Admin
- **[transport-client/README.md](transport-client/README.md)** - Documentação do Client
- **[transport-driver/README.md](transport-driver/README.md)** - Documentação do Driver

## 🎯 Casos de Uso Implementados

### UC1 - Subscrever ao Serviço
✅ Utente pode subscrever ao serviço via `/subscribe`

### UC2 - Pesquisar Transporte
✅ Utente pode pesquisar transportes por município, via e paragem

### UC3 - Registar Proprietário
✅ Admin pode registar proprietários via `/proprietarios`

## 🔄 Fluxo do Sistema

```
1. Admin registra rotas, paragens e transportes
2. Motorista faz login e ativa status online
3. Passageiro subscreve ao serviço
4. Passageiro pesquisa transporte
5. Sistema mostra transportes próximos no mapa
6. Passageiro rastreia transporte em tempo real
```

## 🚧 Em Desenvolvimento

- [ ] Rastreamento GPS em tempo real
- [ ] Integração SMS
- [ ] Notificações push
- [ ] Sistema de pagamentos
- [ ] App mobile

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para questões e suporte:
- Email: suporte@transportmz.com
- Documentação: Veja os arquivos `.md` na raiz

## 📄 Licença

Sistema de Transportes de Moçambique © 2026

---

**Desenvolvido com ❤️ para Moçambique**
