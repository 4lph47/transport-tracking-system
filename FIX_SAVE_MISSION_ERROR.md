# Fix: Erro ao Salvar Transporte

## Problema Identificado
O erro "Erro ao salvar transporte" ocorria porque o código da API estava usando a estrutura errada da tabela de missões.

## Causa Raiz
1. **Nome da tabela incorreto**: O código usava `prisma.missao` mas o schema define `MISSION`
2. **Campos incorretos**: O código tentava usar campos que não existem na tabela:
   - `status` (não existe)
   - `transporteId` (não existe como campo direto)

## Estrutura Correta da Tabela MISSION
```prisma
model MISSION {
  id                    String   @id @default(cuid())
  mISSIONUtente         String
  codigoParagem         String
  geoLocationUtente     String
  geoLocationParagem    String
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relações
  utente    Utente  @relation(fields: [utenteId], references: [id])
  utenteId  String
  paragem   Paragem @relation(fields: [paragemId], references: [id])
  paragemId String
}
```

## Correções Aplicadas

### Arquivo: `transport-client/app/api/user/missions/save/route.ts`

**Mudanças:**
1. ✅ Alterado `prisma.missao` para `prisma.mISSION`
2. ✅ Removido campo `status` (não existe na tabela)
3. ✅ Removido `transporteId` da verificação de duplicatas
4. ✅ Adicionado busca de dados do utente para obter `mISSION`
5. ✅ Adicionado busca de dados da paragem para obter `codigo` e `geoLocation`
6. ✅ Criação de missão agora usa os campos corretos:
   - `mISSIONUtente`: código da missão do utente
   - `codigoParagem`: código da paragem
   - `geoLocationUtente`: localização do utente
   - `geoLocationParagem`: localização da paragem
   - `utenteId`: ID do utente
   - `paragemId`: ID da paragem

**Lógica de Duplicatas:**
- Agora verifica se já existe uma missão para o mesmo `utenteId` e `paragemId`
- Não verifica mais `transporteId` porque não é armazenado diretamente na tabela

## Próximos Passos

### 1. Parar o Servidor
Pare o servidor de desenvolvimento do transport-client:
```bash
# Pressione Ctrl+C no terminal onde o servidor está rodando
```

### 2. Regenerar Prisma Client
```bash
cd transport-client
npx prisma generate
```

### 3. Reiniciar o Servidor
```bash
npm run dev
```

## Teste da Funcionalidade

1. Acesse a aplicação e faça login
2. Busque um transporte
3. Clique em "Acompanhar"
4. Na página de rastreamento, clique em "Adicionar aos Meus Transportes"
5. Deve aparecer mensagem de sucesso: "Transporte adicionado aos seus favoritos"
6. Clique em "Ver Meus Transportes →"
7. Verifique que a missão foi salva corretamente

## Observações

- A tabela `MISSION` não armazena `transporteId` diretamente
- Cada missão está associada a uma paragem específica
- Múltiplos transportes podem passar pela mesma paragem
- O utente pode ter múltiplas missões (uma para cada paragem de interesse)

## Arquivos Modificados

1. ✅ `transport-client/app/api/user/missions/save/route.ts` - Corrigido para usar estrutura correta da tabela MISSION
