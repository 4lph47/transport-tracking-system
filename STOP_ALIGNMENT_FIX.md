# Correção do Alinhamento das Paragens

## Problema Identificado

As paragens e o ônibus estavam aparecendo longe da rota porque:

1. **Waypoints vs Rota OSRM**: Os waypoints no banco de dados são pontos-chave, mas o OSRM gera uma rota detalhada com centenas de pontos entre eles
2. **Coordenadas Desalinhadas**: As paragens estavam nos waypoints originais, mas a rota renderizada seguia o caminho detalhado do OSRM
3. **Distância Visual**: Isso criava uma distância visual entre as paragens e a linha da rota

## Solução Implementada

### 1. Snap to Route (Encaixe na Rota)

Implementei um algoritmo que "encaixa" cada paragem no ponto mais próximo da rota gerada:

```typescript
// Para cada paragem
stops.map(stop => {
  // Encontra o ponto mais próximo na rota
  let minDistance = Infinity;
  let closestPoint = stopLngLat;
  
  routeCoords.forEach(coord => {
    const distance = calculateDistance(coord, stopLngLat);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = coord;
    }
  });
  
  // Se a paragem está perto da rota (<1km), encaixa
  // Senão, usa a posição original
  return useSnapped ? closestPoint : stopLngLat;
});
```

### 2. Waypoints Alinhados

Garanti que os waypoints da rota correspondem exatamente às coordenadas das paragens:

**Via Zimpeto - Baixa:**
```
Waypoints: 32.6520,-25.9950; 32.6320,-25.9810; 32.6120,-25.9670; ...
Paragens:  32.6520,-25.9950; 32.6320,-25.9810; 32.6120,-25.9670; ...
           ✓ Alinhados!
```

### 3. Threshold de Distância

- **< 0.01 graus (~1km)**: Paragem é encaixada na rota
- **> 0.01 graus**: Paragem mantém posição original (pode estar em local específico)

## Como Funciona Agora

### Fluxo de Renderização:

1. **Banco de Dados** → Waypoints da rota
2. **OSRM** → Gera rota detalhada seguindo estradas
3. **Snap Algorithm** → Encaixa paragens na rota gerada
4. **Renderização** → Paragens aparecem sobre a linha da rota

### Resultado Visual:

```
Antes:
  Rota: ————————————————
  Paragem:     •  (longe da linha)
  
Depois:
  Rota: ————•———————————
  Paragem:   ↑ (sobre a linha)
```

## Benefícios

### 1. Precisão Visual
- Paragens aparecem exatamente sobre a rota
- Ônibus se move ao longo da linha visível
- Não há confusão sobre onde as paragens estão

### 2. Flexibilidade
- Se uma paragem está intencionalmente fora da rota (>1km), mantém posição original
- Permite paragens em locais específicos quando necessário

### 3. Compatibilidade
- Funciona com qualquer rota OSRM
- Funciona com rotas manuais (sem OSRM)
- Fallback para posições originais se necessário

## Testando

### 1. Reinicie o servidor
```bash
cd transport-client
npm run dev
```

### 2. Selecione uma rota
- Município: Maputo
- Via: Zimpeto - Baixa
- Paragem: Qualquer

### 3. Clique em "Acompanhar"

### 4. Observe:
- ✅ Paragens estão sobre a linha azul da rota
- ✅ Ônibus se move ao longo da linha
- ✅ Não há espaço entre paragens e rota

## Detalhes Técnicos

### Cálculo de Distância

```typescript
const dx = coord[0] - stopLngLat[0];
const dy = coord[1] - stopLngLat[1];
const distance = Math.sqrt(dx * dx + dy * dy);
```

Usa distância euclidiana simples (suficiente para distâncias curtas).

### Threshold

```typescript
const useSnapped = minDistance < 0.01;
```

- 0.01 graus ≈ 1.1 km no equador
- ≈ 1 km em Maputo (latitude -25°)

### Performance

- O(n × m) onde n = número de paragens, m = pontos na rota
- Típico: 6 paragens × 200 pontos = 1200 comparações
- Executa em <1ms, imperceptível para o usuário

## Casos Especiais

### Paragem Longe da Rota
Se uma paragem está >1km da rota:
- Mantém posição original
- Útil para paragens em desvios ou locais específicos

### Rota Sem OSRM
Se OSRM falhar:
- Usa waypoints diretos
- Paragens já estão nos waypoints
- Alinhamento perfeito automaticamente

### Múltiplas Rotas
Cada rota tem seu próprio conjunto de paragens:
- Snap é feito independentemente
- Não há conflito entre rotas

## Próximos Passos

### Melhorias Possíveis:

1. **Interpolação**: Em vez de snap, interpolar entre pontos da rota
2. **Distância Real**: Usar Haversine em vez de euclidiana
3. **Offset Visual**: Pequeno offset para paragens não ficarem exatamente sobre a linha
4. **Indicadores**: Setas ou marcadores mostrando direção da rota

### Dados Reais:

1. **GPS Real**: Quando conectar GPS real dos ônibus
2. **Paragens Reais**: Importar coordenadas exatas das paragens de Maputo
3. **Rotas Oficiais**: Usar rotas oficiais dos operadores de transporte

## Conclusão

As paragens agora aparecem corretamente sobre a rota, criando uma experiência visual coerente e profissional. O sistema é robusto e funciona com qualquer tipo de rota! ✅
