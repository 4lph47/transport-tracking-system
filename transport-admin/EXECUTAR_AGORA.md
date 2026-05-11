# ⚡ EXECUTAR AGORA - Setup Completo

## 🎯 Objetivo
Criar 111 motoristas, cada um com autocarro e empresa atribuídos.

---

## 🚀 Comando Único (Recomendado)

Abra o terminal no `transport-admin` e execute:

```bash
npx tsx scripts/setup-complete-system.ts
```

**Isso irá:**
1. ✅ Verificar transportes existentes
2. ✅ Criar empresas para todos os transportes
3. ✅ Criar 111 motoristas
4. ✅ Atribuir cada motorista a um autocarro
5. ✅ Cada autocarro já terá empresa
6. ✅ Mostrar estatísticas finais

---

## 📊 Saída Esperada

```
🚀 CONFIGURAÇÃO COMPLETA DO SISTEMA DE MOTORISTAS

============================================================

📋 PASSO 1: Verificando transportes...

✅ Encontrados 111 transportes

📋 PASSO 2: Garantindo que todos os transportes têm empresas...

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

✅ Empresas atribuídas com sucesso!

📋 PASSO 3: Criando 111 motoristas...

🚀 Criando 111 motoristas...

📊 Encontrados 111 transportes

✅ 1/111 - João Pedro Silva (Masculino) → Transporte: ABC-1234 | Empresa: Transportes Maputo Lda
✅ 2/111 - Maria Ana Costa (Feminino) → Transporte: DEF-5678 | Empresa: Via Rápida Transportes
✅ 3/111 - Carlos António Macamo (Masculino) → Transporte: GHI-9012 | Empresa: Expresso Matola
...
✅ 111/111 - Manuel José Chauke (Masculino) → Transporte: XYZ-9999 | Empresa: Via Norte Moçambique

✨ Criação de motoristas concluída!
📊 Total: 111 motoristas criados
🚌 Motoristas atribuídos a transportes: 111
🏢 Transportes com empresas: 111
📸 Todos com fotos realistas de pessoas que não existem

✅ Motoristas criados com sucesso!

📋 VERIFICAÇÃO FINAL
============================================================

📊 ESTATÍSTICAS FINAIS:
   • Total de motoristas: 111
   • Motoristas com transporte: 111
   • Motoristas com empresa: 111
   • Transportes totais: 111
   • Transportes com empresa: 111

✨ CONFIGURAÇÃO COMPLETA!

🎉 Sistema pronto para uso:
   → Acesse: http://localhost:3000/motoristas
   → Todos os motoristas têm autocarro e empresa atribuídos!
```

---

## ✅ Verificar Resultado

### 1. Iniciar Servidor
```bash
npm run dev
```

### 2. Acessar Interface
```
http://localhost:3000/motoristas
```

### 3. Verificar Lista
- ✅ Coluna "Transporte" preenchida
- ✅ Coluna "Empresa" preenchida
- ✅ 111 motoristas visíveis

### 4. Verificar Detalhes
- Clicar em qualquer motorista
- ✅ Ver transporte atribuído
- ✅ Ver empresa proprietária
- ✅ Botão "Ver Detalhes da Empresa"

---

## 🐛 Se Algo Der Errado

### Erro: "Não há transportes"
**Solução:** Criar transportes primeiro antes de executar o script.

### Erro: "Prisma Client não gerado"
```bash
npx prisma generate
```

### Erro: "Conexão com base de dados"
Verificar `.env`:
```
DATABASE_URL="postgresql://..."
```

### Erro: "Script não encontrado"
Verificar que está no diretório `transport-admin`:
```bash
cd transport-admin
pwd  # Deve mostrar .../transport-admin
```

---

## 🔄 Reexecutar (Se Necessário)

O script usa `upsert`, então pode ser executado múltiplas vezes sem duplicar dados:

```bash
npx tsx scripts/setup-complete-system.ts
```

---

## 📝 Comandos Alternativos

### Apenas Criar Empresas
```bash
npx tsx scripts/ensure-transportes-have-proprietarios.ts
```

### Apenas Criar Motoristas
```bash
npx tsx scripts/create-111-motoristas.ts
```

---

## ✨ Pronto!

Após executar o comando, o sistema estará **100% configurado** com:
- ✅ 111 motoristas
- ✅ 111 autocarros
- ✅ 40+ empresas
- ✅ Todas as relações criadas
- ✅ Interface funcionando

**Acesse:** `http://localhost:3000/motoristas`
