# 🔴 Pokédex React

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Uma aplicação web interativa e responsiva que simula uma **Pokédex**, desenvolvida para listar, filtrar e exibir detalhes de Pokémon consumindo a [PokeAPI](https://pokeapi.co/). O projeto foca em uma interface moderna, navegação fluida e personalização visual.

## 🚀 Funcionalidades Principais

- **Listagem de Pokémon:** Visualização em grid com cards personalizados e imagens em alta definição (*Official Artwork*).
- **Busca Inteligente:** Barra de pesquisa na Navbar para filtrar Pokémon por **Nome** ou **ID** em tempo real.
- **Filtros Avançados:**
  - **Por Geração:** Navegue facilmente entre a 1ª até a 4ª geração.
  - **Por Categoria (Tipo):** Filtre Pokémon por tipos (Fogo, Água, Elétrico, etc.) com cores temáticas.
- **Perfil Detalhado:** Ao clicar em um card, veja:
  - Status base (HP, Ataque, Defesa, etc.) com barras de progresso.
  - Descrição (Flavor Text).
  - Cadeia de Evoluções interativa.
  - Cores do layout dinâmicas baseadas no tipo do Pokémon.

## 🌗 Destaque: Modo Claro e Escuro

Implementamos um sistema completo de temas (Theme Context) para melhor acessibilidade e conforto visual:

* **Tema Claro:** Interface limpa com cores vivas e o **Pikachu** como mascote no topo.
* **Tema Escuro:** Interface confortável para ambientes com pouca luz, alterando o mascote automaticamente para o **Gengar**.
* **Persistência:** O botão na Navbar permite alternar instantaneamente entre os modos.

## 🛠️ Tecnologias Utilizadas

* **React.js (Vite):** Para construção da interface e alta performance.
* **React Router DOM:** Para gerenciamento de rotas (Home, Categorias, Gerações, Profile).
* **Axios / Fetch API:** Para consumo de dados assíncronos da PokeAPI.
* **Context API:** Para gerenciamento global do estado do Tema (Dark/Light).
* **CSS3:** Estilização responsiva, Grid Layout e Variáveis CSS.

## 📂 Estrutura do Projeto

```bash
src/
├── assets/          # Imagens (Logos Pikachu/Gengar, ícones)
├── componentes/     # Componentes reutilizáveis (NavBar, Cards)
├── context/         # Contexto do Tema (Dark Mode)
├── pages/           # Páginas principais:
│   ├── Home.jsx
│   ├── Categorias.jsx
│   ├── Geracoes.jsx
│   └── Profile.jsx
├── App.jsx          # Configuração de Rotas
└── main.jsx         # Ponto de entrada