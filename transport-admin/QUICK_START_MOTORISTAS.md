# Quick Start - Sistema de Motoristas

## ✅ Status: Sistema Completo e Pronto

Este guia rápido mostra como verificar e usar o sistema de motoristas.

---

## 🚀 Iniciar o Sistema

### 1. Abrir Terminal no `transport-admin`
```bash
cd transport-admin
```

### 2. Instalar Dependências (se necessário)
```bash
npm install
```

### 3. Verificar Base de Dados
```bash
# Abrir Prisma Studio para ver os dados
npx prisma studio
```
- Abrir tabela **Motorista**
- Verificar se existem 111 motoristas
- Se não existirem, executar o passo 4

### 4. Criar 111 Motoristas (se necessário)
```bash
npx tsx scripts/create-111-motoristas.ts
```

**O que este script faz:**
- ✅ Cria 111 motoristas com dados completos
- ✅ Adiciona fotos realistas de pessoas que não existem
- ✅ Gera nomes moçambicanos
- ✅ Preenche todos os campos (BI, carta, contactos, etc.)
- ✅ Atribui motoristas a transportes (se disponíveis)
- ✅ Usa `upsert` (não duplica se já existir)

**Saída esperada:**
```
🚀 Criando 111 motoristas...

📊 Encontrados X transportes

✅ 1/111 - João Pedro Silva (Masculino) → Transporte: ABC-1234
✅ 2/111 - Maria Ana Costa (Feminino) → Transporte: DEF-5678
...
✅ 111/111 - Carlos Manuel Macamo (Masculino) → Transporte: XYZ-9999

✨ Criação de motoristas concluída!
📊 Total: 111 motoristas criados
🚌 Motoristas atribuídos a transportes: 111
📸 Todos com fotos realistas de pessoas que não existem
```

### 5. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

**Servidor iniciará em:**
```
http://localhost:3000
```

---

## 🎯 Testar o Sistema

### 1. Acessar Lista de Motoristas
```
http://localhost:3000/motoristas
```

**O que você deve ver:**
- ✅ Stats cards: Total, Ativos, Inativos, Com Transporte
- ✅ Barra de pesquisa
- ✅ Filtro por status
- ✅ Tabela com 111 motoristas
- ✅ Botão "Novo Motorista"
- ✅ Botão "Voltar" (para dashboard)

### 2. Pesquisar Motorista
- Digite um nome na barra de pesquisa
- Ou digite um BI, carta ou telefone
- A lista filtra automaticamente

### 3. Ver Detalhes de um Motorista
- Clique em qualquer linha da tabela
- Ou clique no ícone de "olho" nas ações

**O que você deve ver:**
- ✅ Foto do motorista (lado esquerdo)
- ✅ Nome e status
- ✅ Informações pessoais completas
- ✅ Documentos (BI e Carta) com datas
- ✅ Contactos (telefone, email, emergência)
- ✅ Experiência profissional
- ✅ Transporte atribuído (se houver)
- ✅ Botões: Voltar, Editar, Eliminar

### 4. Editar Motorista
- Na página de detalhes, clique em "Editar"
- Altere qualquer campo
- Clique em "Guardar"
- Verifique se as alterações foram salvas

### 5. Criar Novo Motorista
- Na lista, clique em "Novo Motorista"
- Preencha todos os campos obrigatórios
- Clique em "Criar"
- Verifique se o motorista foi adicionado à lista

### 6. Eliminar Motorista
- Na página de detalhes, clique em "Eliminar"
- Confirme a eliminação
- Verifique se o motorista foi removido da lista

---

## 🔍 Verificações Importantes

### ✅ Design Correto
- [ ] Fundo branco (não cinza)
- [ ] Texto preto em todos os lugares
- [ ] Sem animações ou transições
- [ ] Botão eliminar vermelho
- [ ] Outros botões cinza escuro ou claro
- [ ] Bordas cinza claro

### ✅ Dados Completos
- [ ] Todas as fotos carregam
- [ ] Nenhum campo mostra "N/A" ou "Não especificado"
- [ ] Todas as datas são válidas (não "Invalid Date")
- [ ] Todos os motoristas têm contacto de emergência
- [ ] Todos têm experiência em anos
- [ ] Todos têm categoria de carta

### ✅ Navegação Correta
- [ ] Lista → Dashboard (botão voltar)
- [ ] Detalhes → Lista (botão voltar)
- [ ] Editar → Detalhes (botão voltar)
- [ ] Novo → Lista (botão voltar)

### ✅ Funcionalidades
- [ ] Pesquisa funciona
- [ ] Filtros funcionam
- [ ] Criar motorista funciona
- [ ] Editar motorista funciona
- [ ] Eliminar motorista funciona (com confirmação)
- [ ] Clickable rows funcionam

---

## 📊 Dados de Exemplo

### Motorista #1
```
Nome: João Pedro Silva
BI: 110200000000A
Carta: CC-2016-000001
Telefone: +258 84 100 1000
Email: joao.motorista1@transport.co.mz
Género: Masculino
Estado Civil: Solteiro
Experiência: 3 anos
Categoria: B
Foto: https://randomuser.me/api/portraits/men/1.jpg
```

### Motorista #2
```
Nome: Maria Ana Costa
BI: 110200000001B
Carta: CC-2017-000002
Telefone: +258 85 101 1007
Email: maria.motorista2@transport.co.mz
Género: Feminino
Estado Civil: Casado
Experiência: 4 anos
Categoria: C
Foto: https://randomuser.me/api/portraits/women/1.jpg
```

---

## 🐛 Troubleshooting

### Problema: "Nenhum motorista encontrado"
**Solução:**
```bash
npx tsx scripts/create-111-motoristas.ts
```

### Problema: "Invalid Date" nos documentos
**Solução:**
```bash
# Recriar motoristas com datas corretas
npx tsx scripts/create-111-motoristas.ts
```

### Problema: Fotos não carregam
**Verificar:**
1. URL da foto está correto no banco de dados
2. Internet está funcionando
3. API do Random User Generator está online

**Solução temporária:**
- As fotos são de uma API externa
- Se não carregar, aparecerá um ícone de pessoa

### Problema: Erro ao criar motorista
**Verificar:**
1. Todos os campos obrigatórios estão preenchidos
2. BI é único (não existe outro motorista com mesmo BI)
3. Carta é única
4. Email é único

### Problema: Erro 500 na API
**Verificar:**
1. Base de dados está rodando
2. Variável `DATABASE_URL` está configurada
3. Prisma Client está gerado: `npx prisma generate`

---

## 📝 Comandos Úteis

### Ver Dados no Prisma Studio
```bash
npx prisma studio
```

### Gerar Prisma Client
```bash
npx prisma generate
```

### Criar Nova Migração
```bash
npx prisma migrate dev --name nome_da_migracao
```

### Resetar Base de Dados (CUIDADO!)
```bash
npx prisma migrate reset
```

### Ver Logs do Servidor
```bash
npm run dev
# Logs aparecem no terminal
```

---

## 🎨 Personalização

### Alterar Número de Motoristas
Editar `scripts/create-111-motoristas.ts`:
```typescript
const totalMotoristas = Math.max(200, transportes.length); // Criar 200 em vez de 111
```

### Alterar Distribuição de Género
Editar `scripts/create-111-motoristas.ts`:
```typescript
const genero = i % 2 === 0 ? "Feminino" : "Masculino"; // 50% cada
```

### Adicionar Mais Nomes
Editar arrays `nomesMasculinos`, `nomesFemininos`, `apelidos` no script.

### Alterar Categorias de Carta
Editar `scripts/create-111-motoristas.ts`:
```typescript
const categorias = ["B", "C", "D", "E"]; // Adicionar categoria E
```

---

## ✅ Checklist Final

Antes de considerar o sistema pronto:

- [ ] 111 motoristas criados na base de dados
- [ ] Todas as fotos carregam corretamente
- [ ] Nenhum campo mostra "N/A" ou "Invalid Date"
- [ ] Pesquisa funciona
- [ ] Filtros funcionam
- [ ] Criar motorista funciona
- [ ] Editar motorista funciona
- [ ] Eliminar motorista funciona
- [ ] Navegação (botões voltar) funciona
- [ ] Design é preto/branco/cinza
- [ ] Sem animações ou transições
- [ ] Todos os dados vêm da base de dados

---

## 🎉 Pronto!

Se todos os itens acima estão funcionando, o sistema de motoristas está **100% completo e operacional**!

**Próximos passos:**
1. Testar com usuários reais
2. Coletar feedback
3. Implementar melhorias (ver `MOTORISTAS_SYSTEM_COMPLETE.md`)

---

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs do servidor (`npm run dev`)
2. Verificar Prisma Studio (`npx prisma studio`)
3. Verificar documentação completa (`MOTORISTAS_SYSTEM_COMPLETE.md`)
4. Verificar guia de atualização (`ATUALIZAR_MOTORISTAS.md`)
