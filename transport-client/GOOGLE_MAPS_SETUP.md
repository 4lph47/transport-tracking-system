# 🗺️ Configuração do Google Maps 3D

Este guia explica como configurar o Google Maps 3D para o Transport Client.

## 📋 Pré-requisitos

- Conta Google
- Cartão de crédito (para ativar a API, mas há créditos gratuitos mensais)

## 🚀 Passos para Configuração

### 1. Acesse o Google Cloud Console

Vá para: [https://console.cloud.google.com/google/maps-apis/credentials](https://console.cloud.google.com/google/maps-apis/credentials)

### 2. Crie ou Selecione um Projeto

- Clique em **"Selecionar um projeto"** no topo da página
- Clique em **"Novo Projeto"**
- Dê um nome ao projeto (ex: "Transport App")
- Clique em **"Criar"**

### 3. Ative a Maps JavaScript API

- No menu lateral, vá em **"APIs e Serviços" > "Biblioteca"**
- Procure por **"Maps JavaScript API"**
- Clique nela e depois em **"Ativar"**

### 4. Crie uma Chave de API

- No menu lateral, vá em **"APIs e Serviços" > "Credenciais"**
- Clique em **"Criar Credenciais"** > **"Chave de API"**
- Sua chave será criada e exibida

### 5. Configure Restrições (Importante!)

Para segurança, configure restrições na chave:

#### Restrições de Aplicativo:
- Clique na chave criada para editá-la
- Em **"Restrições de aplicativo"**, selecione **"Referenciadores HTTP (sites)"**
- Adicione os seguintes referenciadores:
  ```
  localhost:3000/*
  http://localhost:3000/*
  https://seu-dominio.com/*
  ```

#### Restrições de API:
- Em **"Restrições de API"**, selecione **"Restringir chave"**
- Selecione apenas: **Maps JavaScript API**
- Clique em **"Salvar"**

### 6. Configure a Chave no Projeto

1. Abra o arquivo `.env.local` na raiz do projeto `transport-client`
2. Substitua `YOUR_API_KEY_HERE` pela sua chave:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SuaChaveAquiAIzaSy...
```

3. Salve o arquivo

### 7. Reinicie o Servidor de Desenvolvimento

```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

## 💰 Custos

O Google Maps oferece:
- **$200 USD em créditos gratuitos por mês**
- Isso equivale a aproximadamente **28.000 carregamentos de mapa por mês**
- Para a maioria dos projetos em desenvolvimento, isso é suficiente

## ✅ Verificação

Após configurar:

1. Acesse: `http://localhost:3000/track/1`
2. O mapa 3D deve aparecer com:
   - ✅ Vista 3D com inclinação
   - ✅ Ônibus animado 3D
   - ✅ Marcadores de paragens
   - ✅ Rota desenhada
   - ✅ Controles de zoom e navegação

## 🐛 Solução de Problemas

### Erro: "RefererNotAllowedMapError"
**Solução:** Adicione `localhost:3000/*` aos referenciadores autorizados na configuração da chave.

### Erro: "ApiNotActivatedMapError"
**Solução:** Ative a "Maps JavaScript API" no Google Cloud Console.

### Erro: "InvalidKeyMapError"
**Solução:** Verifique se a chave foi copiada corretamente no arquivo `.env.local`.

### Mapa não aparece
**Solução:** 
1. Verifique se o arquivo `.env.local` está na raiz de `transport-client`
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do navegador (Ctrl+Shift+R)

## 📚 Recursos Adicionais

- [Documentação Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Preços do Google Maps](https://mapsplatform.google.com/pricing/)
- [Guia de Segurança de API Keys](https://developers.google.com/maps/api-security-best-practices)

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- Nunca compartilhe sua chave de API publicamente
- Sempre configure restrições de referenciador
- Não faça commit do arquivo `.env.local` no Git (já está no `.gitignore`)
- Para produção, use variáveis de ambiente do seu provedor de hospedagem

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12) para erros específicos
2. [Status do Google Maps](https://status.cloud.google.com/)
3. Documentação oficial do Google Maps
