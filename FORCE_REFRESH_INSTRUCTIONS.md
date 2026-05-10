# Instruções para Forçar Atualização - Debug Info Ainda Aparece

## Situação
Você ainda vê o painel de debug amarelo mesmo após o código ter sido removido.

## Causa
O Next.js ou navegador está servindo uma versão em cache.

## Solução Completa

### Passo 1: Parar TODOS os Servidores
```bash
# Pressione Ctrl+C em TODOS os terminais que estão rodando npm run dev
# Verifique se não há nenhum processo Node rodando
```

### Passo 2: Limpar Cache do Next.js
```bash
cd transport-client

# Windows PowerShell:
Remove-Item -Recurse -Force .next

# OU Git Bash/Linux:
rm -rf .next

# Verificar que foi removido:
ls .next
# Deve dar erro "cannot find path"
```

### Passo 3: Limpar node_modules/.cache (Se Existir)
```bash
# Windows PowerShell:
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue

# OU Git Bash/Linux:
rm -rf node_modules/.cache
```

### Passo 4: Reiniciar o Servidor
```bash
npm run dev
```

### Passo 5: Limpar Cache do Navegador

#### Opção A - Hard Refresh (Mais Fácil):
1. Abra a página: http://localhost:3000/search
2. Pressione `Ctrl + Shift + Delete`
3. Selecione "Cached images and files"
4. Clique "Clear data"
5. Feche o navegador completamente
6. Reabra e acesse novamente

#### Opção B - DevTools:
1. Abra DevTools (F12)
2. Vá para a aba "Network"
3. Marque "Disable cache"
4. Clique com botão direito no botão refresh
5. Selecione "Empty Cache and Hard Reload"

#### Opção C - Modo Anônimo (Teste):
1. Abra uma janela anônima/privada
2. Acesse http://localhost:3000/search
3. Se não aparecer debug info aqui, é cache do navegador normal

### Passo 6: Verificar Porta Correta
```bash
# Verifique qual porta o servidor está usando
# Deve mostrar algo como: "Local: http://localhost:3000"
```

Certifique-se de acessar a porta correta!

## Verificação

Após seguir todos os passos, você deve ver:

### ✅ O que DEVE aparecer:
```
Pesquisar Transporte
[Seletor de Município]
[Seletor de Rota (Direção)]
[Seletor de Origem]
[Seletor de Destino]
[Botão Pesquisar Transportes]
```

### ❌ O que NÃO deve aparecer:
```
🔍 DEBUG INFO
📊 Total Municipios: 2
📊 Total Vias: 111
...
```

## Se AINDA Aparecer Debug Info

### Verificar se há múltiplos servidores:
```bash
# Windows - Verificar processos Node:
tasklist | findstr node

# Se houver múltiplos, matar todos:
taskkill /F /IM node.exe

# Depois reiniciar apenas um:
npm run dev
```

### Verificar se está no diretório correto:
```bash
pwd
# Deve mostrar: .../transport-client

# Se estiver em outro lugar:
cd transport-client
npm run dev
```

### Verificar conteúdo do arquivo:
```bash
# Procurar por DEBUG INFO no arquivo:
grep -n "DEBUG INFO" app/search/page.tsx

# Deve retornar: (nada)
# Se retornar algo, o arquivo não foi salvo corretamente
```

## Última Opção - Reinstalar Dependências

Se nada funcionar:

```bash
# Parar servidor
Ctrl+C

# Remover tudo
rm -rf .next
rm -rf node_modules

# Reinstalar
npm install

# Reiniciar
npm run dev
```

## Contato de Emergência

Se após TODOS esses passos ainda aparecer debug info:

1. Tire um screenshot do que aparece
2. Verifique o código fonte da página (Ctrl+U no navegador)
3. Procure por "DEBUG INFO" no código fonte
4. Se aparecer lá, há um problema de cache mais profundo

---

**Importante**: O código está limpo. O problema é 100% cache.
