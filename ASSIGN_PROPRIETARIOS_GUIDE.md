# Guia: Atribuir Proprietários a Todos os Autocarros

## 🎯 Objetivo

Este script atribui automaticamente um proprietário a **todos os autocarros** que não têm proprietário atribuído.

---

## 📋 Pré-requisitos

1. **Ter proprietários criados no banco de dados**
   - Se não tiver, crie proprietários primeiro
   - Mínimo: 1 proprietário
   - Recomendado: Vários proprietários para distribuição equilibrada

2. **Ter autocarros no banco de dados**
   - Os autocarros devem estar criados
   - Podem ou não ter proprietários já atribuídos

---

## 🚀 Como Executar

### **Passo 1: Verificar Proprietários Existentes**

Primeiro, verifique se você tem proprietários no banco de dados:

```bash
node check-proprietarios.js
```

Se não tiver proprietários, crie alguns primeiro.

### **Passo 2: Executar o Script**

```bash
node assign-proprietarios-to-all-buses.js
```

---

## 📊 O Que o Script Faz

1. **Busca todos os proprietários** no banco de dados
2. **Busca todos os autocarros** no banco de dados
3. **Identifica autocarros sem proprietário**
4. **Atribui proprietários de forma equilibrada**:
   - Se houver 3 proprietários e 9 autocarros sem dono
   - Cada proprietário receberá 3 autocarros
   - Distribuição circular: P1, P2, P3, P1, P2, P3, ...

---

## 📝 Exemplo de Saída

```
🚀 Iniciando atribuição de proprietários a todos os autocarros...

✅ Encontrados 3 proprietários:
   1. João Silva (clxxx123)
   2. Maria Santos (clxxx456)
   3. Pedro Costa (clxxx789)

📊 Total de autocarros: 15
🔍 Autocarros sem proprietário: 10
✅ Autocarros com proprietário: 5

📝 Atribuindo proprietários...

   ✅ BUS-001 → João Silva
   ✅ BUS-002 → Maria Santos
   ✅ BUS-003 → Pedro Costa
   ✅ BUS-004 → João Silva
   ✅ BUS-005 → Maria Santos
   ✅ BUS-006 → Pedro Costa
   ✅ BUS-007 → João Silva
   ✅ BUS-008 → Maria Santos
   ✅ BUS-009 → Pedro Costa
   ✅ BUS-010 → João Silva

🎉 Concluído! 10 proprietários atribuídos com sucesso!

📊 Resumo Final:
   - Total de autocarros: 15
   - Autocarros com proprietário: 15
   - Autocarros sem proprietário: 0
```

---

## ⚠️ Notas Importantes

### **1. Distribuição Equilibrada**
O script distribui os autocarros de forma equilibrada entre todos os proprietários disponíveis.

**Exemplo:**
- 5 proprietários
- 20 autocarros sem dono
- Resultado: Cada proprietário recebe 4 autocarros

### **2. Não Sobrescreve**
O script **NÃO** remove proprietários já atribuídos. Ele apenas atribui aos autocarros que **não têm** proprietário.

### **3. Um Proprietário por Autocarro**
Cada autocarro recebe **apenas UM** proprietário (conforme requisito).

### **4. Segurança**
- Usa transações do Prisma
- Trata erros individualmente
- Não para se um autocarro falhar

---

## 🔧 Criar Proprietários (Se Necessário)

Se você não tiver proprietários, crie alguns primeiro:

```javascript
// create-proprietarios.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createProprietarios() {
  const proprietarios = [
    {
      nome: 'João Silva',
      telefone: '+258 84 123 4567',
      email: 'joao.silva@proprietario.mz',
      endereco: 'Maputo, Moçambique'
    },
    {
      nome: 'Maria Santos',
      telefone: '+258 84 234 5678',
      email: 'maria.santos@proprietario.mz',
      endereco: 'Matola, Moçambique'
    },
    {
      nome: 'Pedro Costa',
      telefone: '+258 84 345 6789',
      email: 'pedro.costa@proprietario.mz',
      endereco: 'Beira, Moçambique'
    }
  ];

  for (const p of proprietarios) {
    await prisma.proprietario.create({ data: p });
    console.log(`✅ Criado: ${p.nome}`);
  }

  await prisma.$disconnect();
}

createProprietarios();
```

Execute:
```bash
node create-proprietarios.js
```

---

## 📊 Verificar Resultado

Após executar o script, verifique no dashboard admin:

1. Acesse: `http://localhost:3000/transportes`
2. Clique em qualquer autocarro
3. Verifique a seção **"Pessoas Associadas"**
4. Deve mostrar o proprietário atribuído

---

## 🎯 Resultado Esperado

**Antes:**
```
Proprietário        + Atribuir
┌─────────────────────────────┐
│ Nenhum proprietário...     │
└─────────────────────────────┘
```

**Depois:**
```
Proprietário
┌─────────────────────────────┐
│ 💼  João Silva          ❌  │
│     📞 +258 84 123 4567     │
│     ✉️  joao@email.mz       │
└─────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Proprietários criados no banco de dados
- [ ] Script executado com sucesso
- [ ] Todos os autocarros têm proprietário
- [ ] Dashboard mostra proprietários corretamente
- [ ] Botão "+ Atribuir" não aparece mais

---

## 🆘 Troubleshooting

### **Erro: "Nenhum proprietário encontrado"**
**Solução:** Crie proprietários primeiro usando o script `create-proprietarios.js`

### **Erro: "Unique constraint failed"**
**Solução:** O autocarro já tem esse proprietário. O script pula automaticamente.

### **Erro: "Database connection failed"**
**Solução:** Verifique se o banco de dados está rodando e o `.env` está correto.

---

## 🎉 Pronto!

Agora todos os seus autocarros têm proprietários atribuídos! 🚀
