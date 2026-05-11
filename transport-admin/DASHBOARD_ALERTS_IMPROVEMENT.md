# Dashboard Alerts Improvement

## Mudanças Aplicadas

### 1. Posição do Aviso
**Antes:** Aviso de transportes sem motorista aparecia no final da página
**Depois:** Aviso agora aparece no **topo da página**, logo após o container principal

### 2. Botão de Ação
**Antes:** Link para `/motoristas/atribuir` com texto "Atribuir Agora"
**Depois:** Botão que redireciona para `/motoristas` com texto "Ver Motoristas"

### 3. Ícone do Botão
**Antes:** Ícone de adicionar (+)
**Depois:** Ícone de pessoa/motorista

## Estrutura do Aviso

```tsx
{stats.transportesSemMotorista > 0 && (
  <div className="bg-black text-white rounded-xl p-6 border-2 border-gray-800">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
          {/* Ícone de aviso */}
        </div>
        <div>
          <p className="text-lg font-bold text-white mb-1">
            Atenção: {stats.transportesSemMotorista} transportes estão sem motorista
          </p>
          <p className="text-sm text-gray-300">
            Cada transporte deve ter um motorista único atribuído para operar.
          </p>
        </div>
      </div>
      <button onClick={() => router.push('/motoristas')}>
        Ver Motoristas
      </button>
    </div>
  </div>
)}
```

## Benefícios

1. **Visibilidade Imediata** - Usuário vê o aviso assim que entra no dashboard
2. **Ação Direta** - Redireciona para a página de motoristas onde pode gerenciar atribuições
3. **Menos Confusão** - Não tenta ir para uma página de atribuição que pode não existir
4. **Melhor UX** - Aviso crítico no topo, informações secundárias abaixo

## Comportamento

- Aviso só aparece quando `stats.transportesSemMotorista > 0`
- Texto adapta-se ao número (singular/plural)
- Botão usa `router.push()` para navegação
- Design consistente com o resto do dashboard (preto/branco/cinza)

---

**Status:** ✅ COMPLETO
**Arquivo Modificado:** `transport-admin/app/dashboard/page.tsx`
