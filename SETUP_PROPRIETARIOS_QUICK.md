# Setup Rápido: Proprietários para Todos os Autocarros

## 🎯 Objetivo
Criar proprietários predefinidos e atribuí-los automaticamente a todos os autocarros.

---

## ⚡ Execução Rápida (2 comandos)

### **Passo 1: Criar Proprietários Predefinidos**
```bash
node seed-proprietarios-default.js
```

**Isso cria 5 empresas de transporte:**
1. TransMoz Transportes Lda
2. Rodoviária de Moçambique
3. Transportes Matola SA
4. Oliveiras Transportes
5. Grupo TPM - Transportes Públicos

### **Passo 2: Atribuir aos Autocarros**
```bash
node assign-proprietarios-to-all-buses.js
```

**Isso distribui os autocarros entre os 5 proprietários de forma equilibrada.**

---

## 📊 Exemplo de Resultado

**Antes:**
```
Autocarro BUS-001: ❌ Sem proprietário
Autocarro BUS-002: ❌ Sem proprietário
Autocarro BUS-003: ❌ Sem proprietário
...
```

**Depois:**
```
Autocarro BUS-001: ✅ TransMoz Transportes Lda
Autocarro BUS-002: ✅ Rodoviária de Moçambique
Autocarro BUS-003: ✅ Transportes Matola SA
Autocarro BUS-004: ✅ Oliveiras Transportes
Autocarro BUS-005: ✅ Grupo TPM
Autocarro BUS-006: ✅ TransMoz Transportes Lda (volta ao primeiro)
...
```

---

## 🎨 No Dashboard

**Antes:**
```
┌─────────────────────────────┐
│ Proprietário    + Atribuir  │
│ Nenhum proprietário...     │
└─────────────────────────────┘
```

**Depois:**
```
┌─────────────────────────────┐
│ Proprietário                │
│ 💼 TransMoz Transportes Lda │
│ 📞 +258 84 100 1000         │
│ ✉️  geral@transmoz.co.mz    │
└─────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Executar `node seed-proprietarios-default.js`
- [ ] Executar `node assign-proprietarios-to-all-buses.js`
- [ ] Verificar no dashboard que todos têm proprietário
- [ ] Botão "+ Atribuir" não aparece mais

---

## 🔄 Para Adicionar Mais Proprietários

Edite o arquivo `seed-proprietarios-default.js` e adicione mais empresas:

```javascript
{
  nome: 'Nova Empresa de Transportes',
  telefone: '+258 84 600 6000',
  email: 'nova@empresa.co.mz',
  endereco: 'Endereço da empresa'
}
```

Depois execute novamente:
```bash
node seed-proprietarios-default.js
node assign-proprietarios-to-all-buses.js
```

---

## 🎉 Pronto!

Agora todos os seus autocarros têm proprietários atribuídos automaticamente! 🚀
