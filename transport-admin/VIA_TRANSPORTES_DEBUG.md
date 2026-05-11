# Debug: Transportes não aparecem na página da Via

## Problema
Quando um transporte é associado a uma via (através da página de transportes), ele não aparece na página de detalhes da via, mesmo que o `_count.transportes` mostre o número correto.

## Investigação

### 1. Banco de Dados ✅
```bash
node check-via-transportes.js
```
**Resultado:** Os dados estão corretos no banco. As vias têm transportes associados.

Exemplo:
```
Via: Av. das Indústrias - Rua da Igreja (V034)
  _count.transportes: 1
  transportes.length: 1
  Transportes:
    - ACD-003M (33)
```

### 2. API ✅
Arquivo: `transport-admin/app/api/vias/[id]/route.ts`

A API está incluindo os transportes corretamente:
```typescript
transportes: {
  select: {
    id: true,
    matricula: true,
    modelo: true,
    marca: true,
    codigo: true,
    motorista: {
      select: {
        nome: true,
      },
    },
  },
},
```

### 3. Frontend - Possível Problema ⚠️

Arquivo: `transport-admin/app/vias/[id]/page.tsx`

**Console.log adicionado** para debug na função `fetchVia`:
```typescript
console.log('Via data received:', data);
console.log('Transportes count:', data._count?.transportes);
console.log('Transportes array:', data.transportes);
console.log('Transportes length:', data.transportes?.length);
```

## Próximos Passos

1. **Abrir o console do navegador** ao visualizar uma via
2. **Verificar os logs** para ver se:
   - `data.transportes` está definido
   - `data.transportes.length` é maior que 0
   - Os dados estão chegando corretamente

3. **Possíveis causas**:
   - Cache do navegador
   - Problema com o estado React
   - Problema com a renderização condicional

## Solução Temporária

Se os dados estiverem chegando mas não renderizando, pode ser um problema de cache. Tente:
1. Hard refresh (Ctrl+Shift+R)
2. Limpar cache do navegador
3. Reiniciar o servidor de desenvolvimento

## Mudanças Aplicadas

1. ✅ Removido botão "Atribuir Transporte" da página de visualização
2. ✅ Adicionado console.log para debug
3. ✅ Texto atualizado: "Edite a via para atribuir transportes"
4. ✅ Cards de transporte clicáveis (redirecionam para detalhes do transporte)

---

**Próximo passo:** Verificar os logs do console do navegador ao abrir uma via que deveria ter transportes.
