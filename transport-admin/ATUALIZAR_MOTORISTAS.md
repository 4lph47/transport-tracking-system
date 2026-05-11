# Guia de Atualização - Motoristas

## Problema
Os motoristas na base de dados não têm todos os campos preenchidos, resultando em "Invalid Date" e campos vazios.

## Solução

### Passo 1: Atualizar o Schema do Prisma
O schema já foi atualizado com os novos campos obrigatórios.

### Passo 2: Executar Migração
Execute no terminal do `transport-admin`:

```bash
# Criar e aplicar migração
npx prisma migrate dev --name update_motorista_complete_fields

# Gerar cliente Prisma atualizado
npx prisma generate
```

### Passo 3: Atualizar Motoristas Existentes
Execute o script para preencher os campos vazios dos motoristas existentes:

```bash
npx ts-node scripts/update-existing-motoristas.ts
```

Este script irá:
- ✅ **Adicionar fotos** usando APIs de avatares (UI Avatars e Pravatar)
- ✅ Preencher campos vazios com valores padrão
- ✅ Gerar datas de emissão e validade para documentos
- ✅ Adicionar contactos de emergência variados
- ✅ Definir anos de experiência
- ✅ Alternar género entre Masculino e Feminino
- ✅ Variar estados civis
- ✅ Manter dados existentes intactos

### Passo 4 (Opcional): Adicionar Motoristas Novos
Se quiser adicionar motoristas de exemplo completos:

```bash
npx ts-node scripts/seed-motoristas.ts
```

## APIs de Fotos Utilizadas

O script usa **Random User Generator** que fornece fotos realistas de pessoas que não existem:

**Random User Generator** (`https://randomuser.me`)
- Fotos realistas de pessoas geradas por IA
- Separadas por gênero (masculino/feminino)
- 99 fotos diferentes para homens
- 99 fotos diferentes para mulheres
- Qualidade profissional
- Completamente gratuito

### Como Funciona:
- Cada motorista recebe uma foto baseada no seu gênero
- As fotos são distribuídas sequencialmente
- URLs são salvos no campo `foto` do banco de dados
- As fotos carregam automaticamente na interface
- Pessoas nas fotos **não existem** - são geradas por IA

### Por que Random User Generator?
- ✅ **Fotos realistas** - Parecem pessoas reais
- ✅ **Gratuito** - Sem necessidade de API key
- ✅ **Sem limites** - Podem ser usadas livremente
- ✅ **Baseado em gênero** - Homens e mulheres separados
- ✅ **Alta qualidade** - Fotos profissionais
- ✅ **Pessoas que não existem** - Geradas por IA

## Campos Atualizados

### Obrigatórios (com valores padrão):
- `foto` → URL de avatar gerado automaticamente
- `nacionalidade` → "Moçambicana"
- `genero` → Alternado entre "Masculino" e "Feminino"
- `estadoCivil` → Variado entre "Solteiro", "Casado", "Divorciado", "Viúvo"
- `numeroEmergencia` → Gerado automaticamente (+258 84 XXX XXXX)
- `contatoEmergencia` → Nome + relação (ex: "Maria Silva (Esposa)")
- `dataEmissaoBI` → Data aleatória nos últimos 5 anos
- `dataValidadeBI` → 10 anos após emissão
- `dataEmissaoCarta` → Data aleatória nos últimos 5 anos
- `dataValidadeCarta` → 10 anos após emissão
- `categoriaCarta` → "B"
- `experienciaAnos` → 3-12 anos (aleatório)

### Opcionais:
- `deficiencia` → null (só preencher se aplicável)
- `observacoes` → null (pode adicionar depois)

## Verificação

Após executar os scripts, acesse:
```
http://localhost:3000/motoristas
```

Clique em qualquer motorista para ver:
- ✅ Foto do motorista no lado esquerdo
- ✅ Todos os detalhes completos preenchidos
- ✅ Datas válidas em todos os documentos
- ✅ Contactos de emergência
- ✅ Informações pessoais completas
