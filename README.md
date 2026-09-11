# TSL Mobile

Aplicativo mobile para gestão de fornecedores, comunicados, fluxo financeiro e contatos, desenvolvido com React Native + Expo.

## Visão geral

Este projeto foi pensado para facilitar o uso diário de uma operação comercial, com funcionalidades para:

- visualizar e buscar fornecedores;
- consultar fornecedores no mapa;
- verificar distância em relação à localização do usuário;
- visualizar detalhes do fornecedor;
- criar comunicados e notícias internas;
- acompanhar fluxo de caixa;
- salvar contatos e abrir ações de navegação/telefone/e-mail.

## Stack tecnológica

- React Native
- Expo
- React Navigation
- Async Storage
- Expo Location
- Expo Image Picker
- Expo Contacts
- react-native-maps
- lucide-react-native

## Estrutura do projeto

```bash
.
├── android/
├── assets/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── mocks/
│   ├── pages/
│   ├── services/
│   └── utils/
├── App.js
├── app.json
├── index.js
├── package.json
├── README.md
└── .gitignore
```

## Funcionalidades principais

### Fornecedores
- listagem de fornecedores;
- filtro por categoria e proximidade;
- alternância entre visualização em lista e mapa;
- detalhe do fornecedor com endereço, telefone e e-mail;
- ações de rota, ligação e salvamento em contatos.

### Comunicados
- criação de anúncios/comunicados;
- visualização de notícias e detalhes do conteúdo;
- anexos e imagens.

### Fluxo de caixa
- painel com transações financeiras e informações financeiras do dia/operacional.

### Localização
- obtenção da localização atual do usuário;
- cálculo de distância entre usuário e fornecedores;
- abertura de rotas no mapa.

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Node.js 18+
- npm ou yarn
- Android Studio (para Android)
- Xcode (para iOS, se for rodar no macOS)
- Expo CLI

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/llamari/mobile_tsl.git
cd mobile_tsl
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o ambiente Expo:

```bash
npm start
```

## Execução

### Em Android

```bash
npm run android
```

### Em iOS

```bash
npm run ios
```

### Em navegador web

```bash
npm run web
```

## Variáveis e configurações importantes

A aplicação usa permissões de câmera, localização, contatos e documentos, configuradas em `app.json`.

Para mapas do Android, é necessário configurar a chave de API do Google Maps corretamente no projeto Expo/Android.

## Observações

- Os dados de fornecedores e outras informações são carregados por mocks locais e armazenamento persistente.
- O projeto pode ser expandido com backend real em seguida, substituindo os mocks por integrações com API.
- O app foi estruturado para facilitar manutenção e extensão de módulos.
