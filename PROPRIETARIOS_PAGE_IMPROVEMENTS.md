# Melhorias na Página de Proprietários

## Resumo das Melhorias Implementadas

### 1. Header com Banner e Foto/Logo
- Banner gradiente no topo
- Foto grande (160x160px) para indivíduos com ícone de pessoa
- Logo grande (160x160px) para empresas com ícone de edifício
- Badge indicando tipo (🏢 EMPRESA ou 👤 INDIVÍDUO)
- Nome em destaque com informações básicas

### 2. Cards de Estatísticas Coloridos
- **Azul**: Total de transportes
- **Verde**: Capacidade total (soma de lotação)
- **Roxo**: Transportes ativos
- **Laranja**: Anos de operação

### 3. Layout Melhorado
- Banner de fundo com gradiente
- Foto/Logo sobreposta ao banner
- Informações organizadas em grid responsivo
- Botões de ação com sombras e hover effects

### 4. Campos Adicionais Suportados
```typescript
interface Proprietario {
  // Básico
  nome: string;
  bi: string;
  nacionalidade: string;
  birthDate: string;
  
  // Tipo
  tipoProprietario?: string; // "Empresa" ou "Indivíduo"
  foto?: string; // Para indivíduos
  logo?: string; // Para empresas
  
  // Empresa
  nomeComercial?: string;
  dataFundacao?: string;
  numeroFuncionarios?: number;
  website?: string;
  redesSociais?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  
  // Indivíduo
  profissao?: string;
  estadoCivil?: string;
  genero?: string;
  
  // Documentos
  dataEmissaoBI?: string;
  dataValidadeBI?: string;
  
  // Endereço
  endereco: string;
  cidade?: string;
  provincia?: string;
  codigoPostal?: string;
  
  // Financeiro
  iban?: string;
  banco?: string;
  
  // Contacto
  contacto1: number;
  contacto2?: number;
  email?: string;
}
```

### 5. Diferenciação Visual
- **Empresas**: Logo com ícone de edifício, fundo cinza
- **Indivíduos**: Foto com ícone de pessoa, fundo azul

## Como Usar

### Para adicionar foto/logo:
1. No banco de dados, adicione o campo `foto` ou `logo` com URL da imagem
2. Adicione o campo `tipoProprietario` com valor "Empresa" ou "Indivíduo"

### Exemplo de dados:
```json
{
  "nome": "Transportes Maputo Lda",
  "tipoProprietario": "Empresa",
  "logo": "https://example.com/logo.png",
  "nomeComercial": "TM Transportes",
  "website": "https://transportesmaputo.co.mz"
}
```

## Próximos Passos

1. Atualizar o schema do Prisma para incluir novos campos
2. Criar formulário de edição com upload de imagens
3. Adicionar validação de imagens (tamanho, formato)
4. Implementar storage de imagens (AWS S3, Cloudinary, etc.)

