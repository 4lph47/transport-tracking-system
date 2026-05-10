# Instruções para Limpar Cache

## Problema
Você está vendo informações de debug antigas que já foram removidas do código:
```
🔍 DEBUG INFO
📊 Total Municipios: 2
📊 Total Vias: 111
...
```

## Solução: Limpar Cache

### Opção 1: Limpar Cache do Next.js (Recomendado)
```bash
cd transport-client

# Parar o servidor (Ctrl+C)

# Limpar cache do Next.js
rm -rf .next

# Reiniciar o servidor
npm run dev
```

### Opção 2: Limpar Cache do Navegador
1. Abra o DevTools (F12)
2. Clique com botão direito no botão de refresh
3. Selecione "Empty Cache and Hard Reload"

OU

1. Abra o navegador em modo anônimo/privado
2. Acesse http://localhost:3000

### Opção 3: Limpar Tudo (Mais Completo)
```bash
cd transport-client

# Parar o servidor (Ctrl+C)

# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules (opcional, se problemas persistirem)
rm -rf node_modules
npm install

# Reiniciar
npm run dev
```

## Verificação

Após limpar o cache, você deve ver:
- ✅ Sem mensagens de debug
- ✅ Apenas os 4 seletores: Município, Rota, Origem, Destino
- ✅ Seletor de destino mostra apenas paragens válidas (depois da origem)

## Nota

O código já foi limpo e não contém mais:
- ❌ Debug panels
- ❌ Console.log de debug
- ❌ Informações de desenvolvimento

Apenas console.error para erros reais foi mantido.
