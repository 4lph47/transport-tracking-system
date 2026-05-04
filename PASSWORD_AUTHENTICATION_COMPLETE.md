# ✅ Sistema de Autenticação com Senha - Completo

## Resumo
Adicionado campo de senha ao sistema de autenticação com hash seguro usando bcryptjs.

## O Que Foi Implementado

### 1. Atualização do Schema Prisma
**Arquivos**: 
- `transport-admin/prisma/schema.prisma`
- `transport-client/prisma/schema.prisma`

**Campo adicionado:**
```prisma
model Utente {
  id              String   @id @default(cuid())
  nome            String
  email           String   @unique
  telefone        String   @unique
  senha           String   // ✅ NOVO - Password hash
  mISSION         String   @unique
  // ...
}
```

### 2. Biblioteca de Hash
**Instalado**: `bcryptjs`

**Uso**:
- Hash de senha no registro: `bcrypt.hash(senha, 10)`
- Verificação no login: `bcrypt.compare(senha, senhaHash)`

### 3. API de Registro Atualizada
**Arquivo**: `transport-client/app/api/auth/register/route.ts`

**Mudanças**:
- ✅ Aceita campo `senha` no body
- ✅ Valida senha mínima de 6 caracteres
- ✅ Faz hash da senha antes de salvar
- ✅ Nunca retorna a senha no response

**Request**:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "+258840000001",
  "senha": "minhasenha123"
}
```

**Response**:
```json
{
  "success": true,
  "utente": {
    "id": "...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "+258840000001"
  }
}
```

### 4. API de Login Atualizada
**Arquivo**: `transport-client/app/api/auth/login/route.ts`

**Mudanças**:
- ✅ Requer `telefone` e `senha`
- ✅ Verifica senha com bcrypt.compare()
- ✅ Retorna erro genérico para segurança
- ✅ Remove senha do response

**Request**:
```json
{
  "telefone": "+258840000001",
  "senha": "minhasenha123"
}
```

**Response Success**:
```json
{
  "success": true,
  "utente": {
    "id": "...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "+258840000001",
    "subscrito": true,
    "createdAt": "..."
  }
}
```

**Response Error**:
```json
{
  "error": "Telefone ou senha incorretos"
}
```

### 5. Página de Autenticação Atualizada
**Arquivo**: `transport-client/app/auth/page.tsx`

**Campos Adicionados**:

**No Registro:**
- ✅ Campo "Senha" (mínimo 6 caracteres)
- ✅ Campo "Confirmar Senha"
- ✅ Validação de senha mínima
- ✅ Validação de senhas coincidentes

**No Login:**
- ✅ Campo "Telefone"
- ✅ Campo "Senha"

### 6. Seed Atualizado
**Arquivo**: `transport-admin/prisma/seed.ts`

**Utentes de Teste** (todos com senha: `123456`):
```
1. João Pedro Silva
   Email: joao.silva@email.com
   Telefone: +258840000001
   Senha: 123456

2. Maria Santos Costa
   Email: maria.costa@email.com
   Telefone: +258850000002
   Senha: 123456

3. Carlos Nhaca
   Email: carlos.nhaca@email.com
   Telefone: +258860000003
   Senha: 123456
```

## Segurança Implementada

### Hash de Senha
- ✅ Usa bcrypt com salt rounds = 10
- ✅ Senha nunca é armazenada em texto plano
- ✅ Senha nunca é retornada nas APIs

### Validações
- ✅ Senha mínima de 6 caracteres
- ✅ Confirmação de senha no registro
- ✅ Mensagem de erro genérica no login (não revela se telefone ou senha está errado)

### Boas Práticas
- ✅ Hash assíncrono (não bloqueia)
- ✅ Comparação segura com bcrypt
- ✅ Senha removida do objeto antes de retornar

## Fluxo de Uso

### Registro
1. Usuário acessa `/auth`
2. Clica em "Registe-se"
3. Preenche:
   - Nome
   - Email
   - Telefone
   - Senha (mínimo 6 caracteres)
   - Confirmar Senha
4. Sistema valida:
   - Todos os campos preenchidos
   - Senha tem mínimo 6 caracteres
   - Senhas coincidem
   - Telefone não existe
   - Email não existe
5. Sistema cria hash da senha
6. Salva utente na base de dados
7. Faz login automático
8. Redireciona para home

### Login
1. Usuário acessa `/auth`
2. Preenche:
   - Telefone
   - Senha
3. Sistema valida:
   - Busca utente por telefone
   - Compara senha com hash
4. Se válido:
   - Retorna dados do utente
   - Salva no localStorage
   - Redireciona para home
5. Se inválido:
   - Mostra erro genérico

## Como Testar

### Teste de Registro
```
1. Acesse: http://localhost:3000/auth
2. Clique em "Registe-se"
3. Preencha:
   - Nome: Teste Silva
   - Email: teste@email.com
   - Telefone: +258870000001
   - Senha: teste123
   - Confirmar Senha: teste123
4. Clique "Registar"
5. ✅ Deve criar conta e fazer login
```

### Teste de Login
```
1. Acesse: http://localhost:3000/auth
2. Preencha:
   - Telefone: +258840000001
   - Senha: 123456
3. Clique "Entrar"
4. ✅ Deve fazer login e redirecionar
```

### Teste de Senha Errada
```
1. Acesse: http://localhost:3000/auth
2. Preencha:
   - Telefone: +258840000001
   - Senha: senhaerrada
3. Clique "Entrar"
4. ✅ Deve mostrar: "Telefone ou senha incorretos"
```

### Teste de Senha Curta
```
1. Acesse: http://localhost:3000/auth
2. Clique em "Registe-se"
3. Preencha senha com menos de 6 caracteres
4. ✅ Deve mostrar: "A senha deve ter no mínimo 6 caracteres"
```

### Teste de Senhas Diferentes
```
1. Acesse: http://localhost:3000/auth
2. Clique em "Registe-se"
3. Preencha:
   - Senha: senha123
   - Confirmar Senha: senha456
4. ✅ Deve mostrar: "As senhas não coincidem"
```

## Arquivos Modificados

### Criados
- Nenhum (apenas instalado bcryptjs)

### Modificados
1. ✅ `transport-admin/prisma/schema.prisma`
2. ✅ `transport-client/prisma/schema.prisma`
3. ✅ `transport-client/app/api/auth/register/route.ts`
4. ✅ `transport-client/app/api/auth/login/route.ts`
5. ✅ `transport-client/app/auth/page.tsx`
6. ✅ `transport-admin/prisma/seed.ts`

## Base de Dados

### Status
✅ Schema atualizado com campo `senha`
✅ Migração aplicada (db push --force-reset)
✅ Seed executado com senhas hash
✅ Prisma Client regenerado

### Utentes de Teste
- **3 utentes** com senha `123456` (hash armazenado)

## Comparação Antes/Depois

### ANTES (❌)
```
Login: Apenas telefone
Registro: Nome, email, telefone
Segurança: Nenhuma autenticação real
```

### DEPOIS (✅)
```
Login: Telefone + Senha
Registro: Nome, email, telefone + Senha + Confirmar Senha
Segurança: 
  - Hash bcrypt
  - Validação de senha
  - Mensagens de erro seguras
  - Senha nunca exposta
```

## Próximas Melhorias Sugeridas

1. **Recuperação de Senha**
   - Enviar código via SMS
   - Link de reset por email

2. **Força da Senha**
   - Indicador visual
   - Requisitos (maiúscula, número, símbolo)

3. **Bloqueio de Conta**
   - Após X tentativas falhadas
   - Timeout temporário

4. **Autenticação de 2 Fatores**
   - Código SMS
   - Autenticador app

5. **Sessões**
   - JWT tokens
   - Refresh tokens
   - Expiração automática

## Status Final
✅ **SISTEMA DE AUTENTICAÇÃO COM SENHA COMPLETO**

- ✅ Campo senha adicionado ao schema
- ✅ Hash seguro com bcrypt
- ✅ Validações de senha
- ✅ Login com telefone + senha
- ✅ Registro com confirmação de senha
- ✅ Utentes de teste com senha `123456`
- ✅ APIs atualizadas
- ✅ Interface atualizada
- ✅ Sistema pronto para uso!
