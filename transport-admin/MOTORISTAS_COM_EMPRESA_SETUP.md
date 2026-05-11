# Setup Completo - Motoristas com Autocarro e Empresa

## 🎯 Objetivo

Garantir que **todos os 111 motoristas** estejam associados a:
1. ✅ Um **autocarro** (transporte)
2. ✅ Uma **empresa** (proprietário)

---

## 🚀 Setup Rápido (Recomendado)

### Opção 1: Script Automático Completo

Execute um único comando que faz tudo:

```bash
cd transport-admin
npx tsx scripts/setup-complete-system.ts
```

**Este script irá:**
1. ✅ Verificar quantos transportes existem
2. ✅ Criar empresas para transportes sem proprietário
3. ✅ Criar 111 motoristas
4. ✅ Atribuir cada motorista a um transporte
5. ✅ Mostrar estatísticas finais

---

## 🔧 Setup Manual (Passo a Passo)

Se preferir executar cada passo manualmente:

### Passo 1: Garantir Empresas para Todos os Transportes

```bash
npx tsx scripts/ensure-transportes-have-proprietarios.ts
```

**O que faz:**
- Verifica quais transportes não têm proprietário
- Cria empresas moçambicanas fictícias
- Atribui cada empresa a um transporte

**Saída esperada:**
```
🏢 Verificando proprietários dos transportes...

📊 Total de transportes: 111
⚠️  Transportes sem proprietário: 111

🚀 Criando proprietários para transportes sem empresa...

✅ Empresa criada: Transportes Maputo Lda
   → Atribuído ao transporte: ABC-1234
✅ Empresa criada: Via Rápida Transportes
   → Atribuído ao transporte: DEF-5678
...

✨ Processo concluído!
📊 Proprietários criados: 40
🔗 Atribuições realizadas: 111
✅ Todos os transportes agora têm empresas proprietárias!
```

### Passo 2: Criar 111 Motoristas

```bash
npx tsx scripts/create-111-motoristas.ts
```

**O que faz:**
- Cria 111 motoristas com dados completos
- Atribui cada motorista a um transporte
- Cada transporte já tem empresa do passo anterior

**Saída esperada:**
```
🚀 Criando 111 motoristas...

📊 Encontrados 111 transportes

✅ 1/111 - João Pedro Silva (Masculino) → Transporte: ABC-1234 | Empresa: Transportes Maputo Lda
✅ 2/111 - Maria Ana Costa (Feminino) → Transporte: DEF-5678 | Empresa: Via Rápida Transportes
...
✅ 111/111 - Carlos Manuel Macamo (Masculino) → Transporte: XYZ-9999 | Empresa: Via Norte Moçambique

✨ Criação de motoristas concluída!
📊 Total: 111 motoristas criados
🚌 Motoristas atribuídos a transportes: 111
🏢 Transportes com empresas: 111
📸 Todos com fotos realistas de pessoas que não existem
```

---

## 📊 Verificação

### Verificar no Prisma Studio

```bash
npx prisma studio
```

1. **Tabela Motorista**
   - Deve ter 111 registros
   - Todos com `transporteId` preenchido
   - Todos com fotos

2. **Tabela Transporte**
   - Deve ter pelo menos 111 registros
   - Cada um com um motorista

3. **Tabela TransporteProprietario**
   - Deve ter pelo menos 111 registros
   - Cada transporte ligado a um proprietário

4. **Tabela Proprietario**
   - Deve ter empresas criadas
   - Nomes de empresas moçambicanas

### Verificar na Interface

```bash
npm run dev
```

Acesse: `http://localhost:3000/motoristas`

**Verificar:**
- ✅ Coluna "Transporte" mostra matrícula
- ✅ Coluna "Empresa" mostra nome da empresa
- ✅ Clicar em motorista mostra detalhes
- ✅ Página de detalhes mostra transporte E empresa

---

## 🏢 Empresas Criadas

### Nomes de Empresas Moçambicanas

O script cria empresas com nomes realistas:

1. Transportes Maputo Lda
2. Via Rápida Transportes
3. Expresso Matola
4. Transportes Costa do Sol
5. Machava Express
6. Transportes Polana
7. Via Verde Moçambique
8. Transportes Sommerschield
9. Expresso Marginal
10. Transportes Baixa
... (até 40 nomes diferentes)

### Dados das Empresas

Cada empresa tem:
- **Nome**: Nome realista de empresa moçambicana
- **NUIT**: Número único (400000000+)
- **Nacionalidade**: Moçambicana
- **Endereço**: Avenidas principais de Maputo
- **Contacto**: Telefone fixo (21300000+)
- **Data de Fundação**: Entre 1990-2020

---

## 📋 Interface Atualizada

### Lista de Motoristas

**Nova coluna adicionada:**
```
| Motorista | Documentos | Contacto | Transporte | Empresa | Status | Acções |
```

**Exemplo de linha:**
```
João Silva | BI: 123... | +258 84... | ABC-1234 | Transportes Maputo Lda | ativo | [ações]
```

### Detalhes do Motorista

**Nova seção adicionada:**

```
┌─────────────────────────────────────────┐
│ Transporte Atribuído                    │
├─────────────────────────────────────────┤
│ 🚌 ABC-1234                             │
│    Toyota Hiace - Branco                │
│    Via: Maputo-Matola (V001)           │
│    [Ver Transporte]                     │
│                                         │
│ 🏢 Empresa Proprietária                 │
│    Nome: Transportes Maputo Lda         │
│    NUIT: 400000000                      │
│    Nacionalidade: Moçambicana           │
│    Contacto: 21300000                   │
│    Endereço: Av. Julius Nyerere, 100   │
│    [Ver Detalhes da Empresa]           │
└─────────────────────────────────────────┘
```

---

## 🔗 Relações no Sistema

### Diagrama de Relações

```
Motorista (1) ──── (1) Transporte (1) ──── (N) TransporteProprietario (N) ──── (1) Proprietario
                                                                                      (Empresa)
```

**Explicação:**
- 1 Motorista → 1 Transporte (one-to-one)
- 1 Transporte → N Proprietários (many-to-many via TransporteProprietario)
- Na prática: cada transporte tem 1 empresa principal

---

## 📊 Estatísticas Esperadas

Após executar o setup completo:

```
📊 ESTATÍSTICAS FINAIS:
   • Total de motoristas: 111
   • Motoristas com transporte: 111 (100%)
   • Motoristas com empresa: 111 (100%)
   • Transportes totais: 111+
   • Transportes com empresa: 111+ (100%)
```

---

## 🎨 Design

### Cores Mantidas
- ✅ Preto, branco e cinza
- ✅ Sem animações
- ✅ Botão eliminar vermelho

### Novos Elementos
- ✅ Coluna "Empresa" na tabela
- ✅ Card de empresa nos detalhes
- ✅ Ícone de empresa (prédio)
- ✅ Botão "Ver Detalhes da Empresa"

---

## 🐛 Troubleshooting

### Problema: "Transportes sem proprietário"

**Solução:**
```bash
npx tsx scripts/ensure-transportes-have-proprietarios.ts
```

### Problema: "Motoristas sem transporte"

**Causa:** Não há transportes suficientes na base de dados

**Solução:**
1. Criar mais transportes primeiro
2. Depois executar o script de motoristas

### Problema: "Empresa não aparece na interface"

**Verificar:**
1. Transporte tem proprietário no Prisma Studio
2. API retorna proprietários: `GET /api/motoristas/[id]`
3. Console do navegador para erros

**Solução:**
```bash
# Recriar relações
npx tsx scripts/ensure-transportes-have-proprietarios.ts
```

### Problema: "Erro ao criar empresa duplicada"

**Causa:** BI/NUIT duplicado

**Solução:** O script usa `upsert` e verifica duplicados automaticamente

---

## 📝 Scripts Disponíveis

### 1. Setup Completo (Recomendado)
```bash
npx tsx scripts/setup-complete-system.ts
```
Faz tudo automaticamente.

### 2. Apenas Empresas
```bash
npx tsx scripts/ensure-transportes-have-proprietarios.ts
```
Cria empresas para transportes sem proprietário.

### 3. Apenas Motoristas
```bash
npx tsx scripts/create-111-motoristas.ts
```
Cria 111 motoristas (requer empresas já criadas).

---

## ✅ Checklist Final

Antes de considerar completo:

- [ ] 111 motoristas criados
- [ ] Todos os motoristas têm transporte
- [ ] Todos os transportes têm empresa
- [ ] Coluna "Empresa" aparece na lista
- [ ] Detalhes mostram empresa completa
- [ ] Botão "Ver Detalhes da Empresa" funciona
- [ ] Fotos dos motoristas carregam
- [ ] Design preto/branco/cinza mantido
- [ ] Sem animações

---

## 🎉 Resultado Final

Após executar o setup:

✅ **111 motoristas** com:
- Dados pessoais completos
- Fotos realistas
- Documentos válidos
- Contactos de emergência

✅ **111 autocarros** com:
- Matrícula única
- Modelo e marca
- Via atribuída
- 1 motorista

✅ **40+ empresas** com:
- Nomes moçambicanos
- NUIT único
- Endereços em Maputo
- Contactos

✅ **Interface completa** mostrando:
- Motorista → Autocarro → Empresa
- Navegação entre entidades
- Todos os dados visíveis

---

## 🚀 Próximos Passos

1. **Testar navegação completa**
   - Motorista → Transporte → Empresa
   - Empresa → Transportes → Motoristas

2. **Adicionar filtros**
   - Filtrar por empresa
   - Filtrar por via

3. **Relatórios**
   - Motoristas por empresa
   - Transportes por empresa
   - Estatísticas gerais

---

**Última atualização:** 2026-05-06  
**Versão:** 2.0.0  
**Status:** ✅ Completo com Empresas
