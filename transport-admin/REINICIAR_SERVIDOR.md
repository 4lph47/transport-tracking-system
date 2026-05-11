# 🔄 Como Reiniciar o Servidor Corretamente

## Problema
O servidor está usando o Prisma Client antigo que não tem os campos novos do Motorista.

## Solução

### Passo 1: Parar o Servidor
No terminal onde o servidor está rodando, pressione:
```
Ctrl + C
```

### Passo 2: Regenerar Prisma Client
```bash
cd transport-admin
npx prisma generate
```

### Passo 3: Reiniciar o Servidor
```bash
npm run dev
```

### Passo 4: Limpar Cache do Navegador
No navegador:
1. Pressione `Ctrl + Shift + R` (Windows/Linux) ou `Cmd + Shift + R` (Mac)
2. Ou abra DevTools (F12) → Network → Marque "Disable cache"

## Verificação

Após reiniciar, acesse:
```
http://localhost:3000/motoristas
```

Clique em qualquer motorista e verifique:
- ✅ Foto aparece
- ✅ Datas são válidas (não "Invalid Date")
- ✅ Todos os campos têm dados
- ✅ Transporte aparece (ex: ACA-001M)
- ✅ Empresa aparece (ex: Transportes Maputo Lda)

## Se Ainda Não Funcionar

### Opção 1: Limpar tudo e reiniciar
```bash
# Parar servidor (Ctrl+C)
cd transport-admin
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate
npm run dev
```

### Opção 2: Verificar se os dados estão na BD
```bash
cd transport-admin
npx tsx scripts/check-motorista-complete.ts
```

Se mostrar todos os dados corretos, o problema é apenas cache do servidor.

## Dados Corretos na Base de Dados

✅ **11 empresas**:
- Transportes Maputo Lda
- Via Rápida Transportes
- Expresso Matola
- Transportes Costa do Sol
- Machava Express
- Transportes Polana
- Via Verde Moçambique
- Transportes Sommerschield
- Expresso Marginal
- Transportes Baixa
- Via Azul Transportes

✅ **111 transportes** com matrículas:
- ACA-001M até ACA-010M (Transportes Maputo Lda)
- ACB-001M até ACB-010M (Via Rápida Transportes)
- ACC-001M até ACC-010M (Expresso Matola)
- ACD-001M até ACD-010M (Transportes Costa do Sol)
- ACE-001M até ACE-010M (Machava Express)
- ACF-001M até ACF-010M (Transportes Polana)
- ACG-001M até ACG-010M (Via Verde Moçambique)
- ACH-001M até ACH-010M (Transportes Sommerschield)
- ACI-001M até ACI-010M (Expresso Marginal)
- ACJ-001M até ACJ-010M (Transportes Baixa)
- ACK-001M até ACK-011M (Via Azul Transportes)

✅ **111 motoristas** com:
- Fotos realistas
- Datas válidas
- Contactos de emergência
- Experiência profissional
- Documentos completos

## Exemplo de Motorista Correto

```json
{
  "nome": "Alberto Daniel Matlombe",
  "bi": "110200000089L",
  "cartaConducao": "CC-2017-000090",
  "telefone": "+258 85 189 1623",
  "email": "alberto.motorista90@transport.co.mz",
  "dataNascimento": "1993-08-27",
  "foto": "https://randomuser.me/api/portraits/men/90.jpg",
  "nacionalidade": "Moçambicana",
  "genero": "Masculino",
  "estadoCivil": "Casado",
  "numeroEmergencia": "+258 84 589 2089",
  "contatoEmergencia": "Eduarda Olga Ngovene (Esposa)",
  "dataEmissaoBI": "2024-04-15",
  "dataValidadeBI": "2034-04-15",
  "dataEmissaoCarta": "2023-04-07",
  "dataValidadeCarta": "2033-04-07",
  "categoriaCarta": "D",
  "experienciaAnos": 17,
  "status": "ativo",
  "transporte": {
    "matricula": "ACI-010M",
    "modelo": "County",
    "marca": "Hyundai",
    "via": "Maputo-Matola"
  },
  "empresa": {
    "nome": "Expresso Marginal",
    "bi": "500000008"
  }
}
```

## Troubleshooting

### Erro: "Invalid Date"
**Causa**: Servidor usando Prisma Client antigo
**Solução**: Parar servidor → `npx prisma generate` → Reiniciar

### Erro: "Nenhum transporte atribuído"
**Causa**: Cache do navegador
**Solução**: `Ctrl + Shift + R` no navegador

### Erro 500 na API
**Causa**: Prisma Client desatualizado
**Solução**: Regenerar Prisma Client e reiniciar servidor

### Campos vazios
**Causa**: Frontend usando dados em cache
**Solução**: Limpar cache do navegador e recarregar

---

**Última atualização**: 2026-05-06  
**Status**: ✅ Dados corretos na BD, apenas precisa reiniciar servidor
