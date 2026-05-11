# Checklist de Verificação - Sistema de Motoristas

## 📋 Use este checklist para verificar se tudo está funcionando

---

## 🔧 Pré-requisitos

### Ambiente
- [ ] Node.js instalado (v18 ou superior)
- [ ] PostgreSQL rodando
- [ ] Variável `DATABASE_URL` configurada no `.env`

### Dependências
```bash
cd transport-admin
npm install
```
- [ ] Todas as dependências instaladas sem erros

### Prisma
```bash
npx prisma generate
```
- [ ] Prisma Client gerado com sucesso

---

## 🗄️ Base de Dados

### Verificar Conexão
```bash
npx prisma studio
```
- [ ] Prisma Studio abre sem erros
- [ ] Consegue ver as tabelas

### Verificar Tabela Motorista
No Prisma Studio:
- [ ] Tabela `Motorista` existe
- [ ] Tabela tem todos os campos (20+)
- [ ] Campos obrigatórios estão marcados

### Verificar Dados
- [ ] Existem motoristas na tabela (idealmente 111)
- [ ] Motoristas têm fotos (URLs válidas)
- [ ] Motoristas têm todos os campos preenchidos
- [ ] Datas são válidas (não null)

**Se não houver motoristas:**
```bash
npx tsx scripts/create-111-motoristas.ts
```

---

## 🚀 Servidor

### Iniciar Servidor
```bash
npm run dev
```
- [ ] Servidor inicia sem erros
- [ ] Porta 3000 está disponível
- [ ] Mensagem "Ready" aparece

### Verificar Compilação
- [ ] Nenhum erro de TypeScript
- [ ] Nenhum erro de compilação
- [ ] Warnings (se houver) são aceitáveis

---

## 🌐 API Endpoints

### GET /api/motoristas
```bash
curl http://localhost:3000/api/motoristas
```
- [ ] Retorna array de motoristas
- [ ] Status 200
- [ ] Dados completos (nome, bi, carta, etc.)
- [ ] Inclui transporte (se atribuído)

### GET /api/motoristas/[id]
Pegar um ID do resultado anterior e testar:
```bash
curl http://localhost:3000/api/motoristas/[ID_AQUI]
```
- [ ] Retorna motorista específico
- [ ] Status 200
- [ ] Todos os campos presentes
- [ ] Inclui transporte e via (se atribuído)

### POST /api/motoristas
```bash
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Motorista",
    "bi": "999999999999Z",
    "cartaConducao": "CC-TEST-999999",
    "telefone": "+258 84 999 9999",
    "email": "teste@test.com",
    "dataNascimento": "1990-01-01",
    "endereco": "Teste Endereço",
    "status": "ativo"
  }'
```
- [ ] Cria motorista
- [ ] Status 201
- [ ] Retorna motorista criado

### DELETE /api/motoristas/[id]
Usar o ID do motorista de teste criado acima:
```bash
curl -X DELETE http://localhost:3000/api/motoristas/[ID_DO_TESTE]
```
- [ ] Elimina motorista
- [ ] Status 200
- [ ] Retorna mensagem de sucesso

---

## 🎨 Interface - Lista de Motoristas

### Acessar Página
```
http://localhost:3000/motoristas
```

### Layout Geral
- [ ] Página carrega sem erros
- [ ] Fundo é branco (não cinza)
- [ ] Texto é preto
- [ ] Sem animações visíveis

### Header
- [ ] Título "Motoristas" visível
- [ ] Subtítulo presente
- [ ] Botão "Voltar" presente (seta para esquerda)
- [ ] Botão "Novo Motorista" presente (cinza escuro)

### Stats Cards
- [ ] 4 cards visíveis
- [ ] Card "Total" mostra número correto
- [ ] Card "Ativos" mostra número correto
- [ ] Card "Inativos" mostra número correto
- [ ] Card "Com Transporte" mostra número correto
- [ ] Ícones aparecem em cada card

### Barra de Pesquisa
- [ ] Input de pesquisa visível
- [ ] Placeholder correto
- [ ] Ícone de lupa presente
- [ ] Filtro de status presente
- [ ] Botão "Filtros" presente

### Tabela
- [ ] Cabeçalhos: Motorista, Documentos, Contacto, Transporte, Status, Acções
- [ ] Linhas de motoristas aparecem
- [ ] Dados corretos em cada coluna
- [ ] Ícones de ações visíveis (olho, lápis, lixeira)

### Paginação
- [ ] Footer da tabela visível
- [ ] Contador "Mostrando X de Y" correto
- [ ] Botões de paginação presentes

---

## 🔍 Interface - Detalhes do Motorista

### Acessar Página
Clicar em qualquer motorista da lista

### Layout Geral
- [ ] Página carrega sem erros
- [ ] Layout de 4 colunas (1 esquerda + 3 direita)
- [ ] Fundo branco
- [ ] Texto preto

### Header
- [ ] Botão "Voltar" presente
- [ ] Nome do motorista no título
- [ ] Botão "Editar" presente (cinza escuro)
- [ ] Botão "Eliminar" presente (vermelho)

### Coluna Esquerda
- [ ] Foto do motorista aparece
- [ ] Foto é circular (160x160px)
- [ ] Nome abaixo da foto
- [ ] Badge de status presente
- [ ] Card de experiência e categoria
- [ ] Card de status

### Coluna Direita - Informações Pessoais
- [ ] Card "Informações Pessoais" visível
- [ ] Nome completo presente
- [ ] Data de nascimento válida (não "Invalid Date")
- [ ] Nacionalidade presente
- [ ] Género presente
- [ ] Estado civil presente
- [ ] Endereço presente
- [ ] Deficiência (se houver)

### Coluna Direita - Documentos
- [ ] Card "Documentos" visível
- [ ] Seção BI com número, emissão, validade
- [ ] Seção Carta com número, categoria, emissão, validade
- [ ] Todas as datas válidas

### Coluna Direita - Contacto
- [ ] Card "Contacto" visível
- [ ] Telefone presente
- [ ] Email presente
- [ ] Contacto de emergência presente
- [ ] Telefone de emergência presente

### Coluna Direita - Experiência
- [ ] Card "Experiência Profissional" visível
- [ ] Anos de experiência presente
- [ ] Categoria da carta presente

### Coluna Direita - Transporte
- [ ] Card "Transporte Atribuído" visível
- [ ] Se atribuído: mostra matrícula, modelo, marca, via
- [ ] Se não atribuído: mostra mensagem apropriada
- [ ] Botão "Ver Transporte" (se atribuído)

---

## ✏️ Interface - Editar Motorista

### Acessar Página
Na página de detalhes, clicar em "Editar"

### Layout Geral
- [ ] Página carrega sem erros
- [ ] Layout de 3 colunas
- [ ] Fundo branco

### Header
- [ ] Botão "Voltar" presente
- [ ] Título "Editar Motorista"
- [ ] Botão "Guardar" presente

### Formulário
- [ ] Todos os campos editáveis
- [ ] Valores atuais pré-preenchidos
- [ ] Campos obrigatórios marcados
- [ ] Inputs de data funcionam
- [ ] Selects funcionam

### Funcionalidade
- [ ] Consegue alterar valores
- [ ] Botão "Guardar" funciona
- [ ] Redireciona para detalhes após salvar
- [ ] Alterações são persistidas

---

## ➕ Interface - Novo Motorista

### Acessar Página
Na lista, clicar em "Novo Motorista"

### Layout Geral
- [ ] Página carrega sem erros
- [ ] Layout de 3 colunas
- [ ] Fundo branco

### Header
- [ ] Botão "Voltar" presente
- [ ] Título "Novo Motorista"
- [ ] Botão "Criar" presente

### Formulário
- [ ] Todos os campos vazios
- [ ] Campos obrigatórios marcados
- [ ] Inputs funcionam
- [ ] Validação funciona

### Funcionalidade
- [ ] Consegue preencher campos
- [ ] Botão "Criar" funciona
- [ ] Redireciona para lista após criar
- [ ] Novo motorista aparece na lista

---

## 🎯 Funcionalidades

### Pesquisa
Na lista de motoristas:
- [ ] Pesquisar por nome funciona
- [ ] Pesquisar por BI funciona
- [ ] Pesquisar por carta funciona
- [ ] Pesquisar por telefone funciona
- [ ] Resultados filtram em tempo real

### Filtros
- [ ] Filtro "Todos" mostra todos
- [ ] Filtro "Ativos" mostra só ativos
- [ ] Filtro "Inativos" mostra só inativos
- [ ] Filtro "Suspensos" mostra só suspensos

### Navegação
- [ ] Clicar em linha da tabela vai para detalhes
- [ ] Botão "Voltar" na lista vai para dashboard
- [ ] Botão "Voltar" nos detalhes vai para lista
- [ ] Botão "Voltar" na edição vai para detalhes
- [ ] Botão "Voltar" no novo vai para lista

### CRUD
- [ ] Criar motorista funciona
- [ ] Ler motorista funciona
- [ ] Atualizar motorista funciona
- [ ] Eliminar motorista funciona
- [ ] Confirmação de eliminação aparece

---

## 🎨 Design

### Cores
- [ ] Fundo: Branco (#FFFFFF)
- [ ] Texto: Preto (#000000)
- [ ] Botão primário: Cinza escuro (#0F172A)
- [ ] Botão secundário: Cinza claro (#F1F5F9)
- [ ] Botão eliminar: Vermelho (#DC2626)
- [ ] Bordas: Cinza claro (#E2E8F0)

### Animações
- [ ] Nenhuma animação visível
- [ ] Nenhuma transição visível
- [ ] `style={{ transition: 'none' }}` aplicado

### Responsividade
- [ ] Desktop (1920px): Layout correto
- [ ] Laptop (1366px): Layout correto
- [ ] Tablet (768px): Layout adapta
- [ ] Mobile (375px): Layout adapta

---

## 📸 Fotos

### Verificar URLs
- [ ] Fotos carregam corretamente
- [ ] URLs seguem padrão: `https://randomuser.me/api/portraits/[men|women]/[1-99].jpg`
- [ ] Fotos de homens para motoristas masculinos
- [ ] Fotos de mulheres para motoristas femininos

### Fallback
- [ ] Se foto não carregar, ícone aparece
- [ ] Ícone é apropriado (pessoa)

---

## 🐛 Testes de Erro

### Motorista Não Encontrado
Acessar: `http://localhost:3000/motoristas/id-invalido`
- [ ] Mostra mensagem "Motorista não encontrado"
- [ ] Botão "Voltar" funciona

### Criar com Dados Inválidos
Tentar criar motorista sem preencher campos obrigatórios:
- [ ] Validação impede criação
- [ ] Mensagens de erro apropriadas

### Eliminar Motorista
- [ ] Confirmação aparece
- [ ] Se cancelar, não elimina
- [ ] Se confirmar, elimina
- [ ] Redireciona para lista

---

## 📊 Dados

### Verificar Integridade
- [ ] Nenhum campo mostra "N/A"
- [ ] Nenhum campo mostra "Não especificado"
- [ ] Nenhuma data mostra "Invalid Date"
- [ ] Todos os motoristas têm foto
- [ ] Todos os motoristas têm contacto emergência
- [ ] Todos os motoristas têm experiência

### Verificar Relações
- [ ] Motoristas com transporte mostram matrícula
- [ ] Motoristas sem transporte mostram mensagem
- [ ] Clicar em transporte vai para página do transporte

---

## ✅ Checklist Final

### Backend
- [ ] API funciona
- [ ] Base de dados conectada
- [ ] Prisma Client gerado
- [ ] 111 motoristas criados

### Frontend
- [ ] Todas as páginas carregam
- [ ] Design correto (preto/branco/cinza)
- [ ] Sem animações
- [ ] Navegação funciona

### Funcionalidades
- [ ] CRUD completo funciona
- [ ] Pesquisa funciona
- [ ] Filtros funcionam
- [ ] Fotos carregam

### Dados
- [ ] Todos os campos preenchidos
- [ ] Datas válidas
- [ ] Fotos válidas
- [ ] Relações corretas

---

## 🎉 Sistema Aprovado!

Se todos os itens acima estão marcados ✅, o sistema está **100% funcional e pronto para uso**!

---

## 📝 Notas

### Problemas Encontrados
Liste aqui qualquer problema encontrado durante a verificação:

1. 
2. 
3. 

### Melhorias Sugeridas
Liste aqui sugestões de melhorias:

1. 
2. 
3. 

---

**Data da Verificação:** _______________  
**Verificado por:** _______________  
**Status:** [ ] Aprovado [ ] Reprovado  
**Observações:** _______________
