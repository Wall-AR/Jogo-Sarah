# 🎮 Resgate do Deus Esquecido

Um jogo web romântico psicodélico em pixel art criado especialmente para Sarah e Wallace.

## 🌟 Sobre o Jogo

Sarah precisa resgatar Wallace, o "Deus Esquecido", viajando por um universo psicodélico guiada pelo seu gato místico Salem. Passando por oráculos felinos, puzzles esotéricos e quizzes cósmicos, ela enfrentará armadilhas mentais e, no final, abrirá o baú dos prazeres cósmicos do amor.

## 🎯 Fases do Jogo

### Fase 1 - Diálogo e Revelação
- Narrativa introdutória com Salem
- Sistema de diálogos com áudio sincronizado
- Estabelece a missão de resgate

### Fase 2 - "Cadê o Wallace?"
- Quebra-cabeça de busca e encontre
- Encontre 5 manifestações de Wallace escondidas no Reino Ghibli
- Clique nas figuras para descobri-las

### Fase 3 - Ritual da Canábis Sagrada
- Minigame de coleta em tempo real
- Controle Sarah com setas do teclado ou mouse
- Colete itens bons (folhas douradas, cogumelos, comida, bebida)
- Evite itens ruins (seringas, cigarros)
- Meta: 50 pontos, 3 vidas

### Fase 4 - Quiz Cósmico do Amor
- 5 perguntas personalizadas sobre o casal
- Múltipla escolha com feedback visual e sonoro
- Teste o conhecimento verdadeiro do coração

### Fase Final - O Baú e as Memórias
- Abra o Baú dos Prazeres Cósmicos
- Revelar presentes especiais
- Slideshow de memórias do casal
- Animação de corações flutuantes
- Música especial: Careless Whisper Chiptune

## 🎵 Configuração de Áudio

### Músicas de Fundo
Adicione os seguintes arquivos na pasta `assets/musica/`:
- `music_intro_ambiente.mp3` - Música da tela inicial
- `music_fase2_ambiente.mp3` - Música da Fase 2
- `music_fase3_gameplay.mp3` - Música da Fase 3
- `music_fase4_quiz.mp3` - Música da Fase 4
- `music_fase_final_ambiente.mp3` - Música da Fase Final
- `music_careless_whisper_chiptune.mp3` - Música especial do final

### Efeitos Sonoros
Adicione os seguintes arquivos na pasta `assets/sfx/`:
- `sfx_botao_clique.mp3` - Som de clique em botões
- `sfx_salem_piscar.mp3` - Som quando Salem pisca
- `sfx_texto_avancar.mp3` - Som de digitação
- `sfx_transicao_cena.mp3` - Som de transição entre cenas
- `sfx_wallace_encontrado.mp3` - Som ao encontrar Wallace
- `sfx_fase2_completa.mp3` - Som de conclusão da Fase 2
- `sfx_item_bom_pego.mp3` - Som ao coletar item bom
- `sfx_item_ruim_pego.mp3` - Som ao coletar item ruim
- `sfx_fase3_completa.mp3` - Som de conclusão da Fase 3
- `sfx_resposta_certa.mp3` - Som de resposta correta
- `sfx_resposta_errada.mp3` - Som de resposta errada
- `sfx_fase4_completa.mp3` - Som de conclusão da Fase 4
- `sfx_puzzle_revelar_peca.mp3` - Som de revelação
- `sfx_puzzle_completo.mp3` - Som de puzzle completo
- `sfx_bau_pulsando.mp3` - Som do baú pulsando
- `sfx_bau_abrir.mp3` - Som de abertura do baú
- `sfx_presente_revelado.mp3` - Som de presente revelado
- `sfx_foto_transicao.mp3` - Som de transição de fotos
- `sfx_creditos_iniciar.mp3` - Som de início dos créditos

### Arquivos de Voz
Consulte o arquivo `LISTA_ARQUIVOS_VOZ.md` para a lista completa de 26 arquivos de voz necessários na pasta `assets/vozes/`.

## 🎮 Como Jogar

### Controles Gerais
- **Mouse**: Clique para interagir com elementos
- **Enter/Espaço**: Avançar diálogos
- **M**: Alternar mute/unmute
- **Esc**: Pausar (se implementado)

### Controles da Fase 3
- **Setas ←→** ou **A/D**: Mover Sarah
- **Mouse**: Mover Sarah seguindo o cursor
- **Clique**: Coletar itens

## 🚀 Como Executar

1. **Servidor Local**:
   ```bash
   cd resgate-do-deus-esquecido
   python3 -m http.server 8000
   ```
   Acesse: `http://localhost:8000`

2. **Servidor Web**: Faça upload de todos os arquivos para seu servidor web

## 📁 Estrutura de Arquivos

```
resgate-do-deus-esquecido/
├── index.html              # Arquivo principal
├── styles.css              # Estilos do jogo
├── js/
│   ├── game.js             # Lógica principal
│   ├── audio.js            # Sistema de áudio
│   ├── dialogue.js         # Sistema de diálogos
│   ├── animations.js       # Sistema de animações
│   └── phases.js           # Mecânicas das fases
├── assets/
│   ├── imagens/            # Todas as imagens do jogo
│   │   ├── tela_inicio/    # Imagens da tela inicial
│   │   ├── fase1/          # Imagens da Fase 1
│   │   ├── fase2/          # Imagens da Fase 2
│   │   ├── fase3/          # Imagens da Fase 3
│   │   ├── fase4/          # Imagens da Fase 4
│   │   └── fase_final/     # Imagens da Fase Final
│   ├── ui/                 # Elementos de interface
│   ├── musica/             # Músicas de fundo (adicionar)
│   ├── sfx/                # Efeitos sonoros (adicionar)
│   └── vozes/              # Arquivos de voz (adicionar)
├── README.md               # Este arquivo
├── LISTA_ARQUIVOS_VOZ.md   # Lista detalhada de vozes
└── todo.md                 # Lista de tarefas
```

## 🎨 Características Técnicas

- **Responsivo**: Funciona em desktop e mobile
- **Pixel Art**: Renderização crisp para gráficos pixelados
- **Animações**: CSS3 e JavaScript para efeitos suaves
- **Sistema de Estados**: Gerenciamento robusto de fases
- **Preload**: Carregamento otimizado de assets
- **Controles de Áudio**: Volume e mute integrados

## 💝 Personalização

### Modificar Perguntas do Quiz
Edite o arquivo `js/phases.js`, seção `fase4.questions` para personalizar as perguntas do quiz.

### Alterar Diálogos
Edite o arquivo `js/dialogue.js` para modificar os textos dos diálogos.

### Ajustar Dificuldade
No arquivo `js/phases.js`, modifique:
- `fase3.targetScore`: Meta de pontos da Fase 3
- `fase3.spawnRate`: Velocidade de spawn de itens
- `fase2.requiredFinds`: Número de Wallace para encontrar

## 🐛 Solução de Problemas

### Áudio não funciona
- Verifique se os arquivos de áudio estão nas pastas corretas
- Alguns navegadores requerem interação do usuário antes de reproduzir áudio
- Teste em diferentes navegadores

### Imagens não carregam
- Verifique se todas as imagens estão nas pastas corretas
- Confirme que os nomes dos arquivos correspondem exatamente

### Performance lenta
- Use um servidor web local em vez de abrir o arquivo diretamente
- Otimize as imagens se necessário
- Feche outras abas do navegador

## 🎭 Créditos

**Desenvolvido com amor para Sarah e Wallace**

- **Conceito**: Jogo romântico psicodélico
- **Arte**: Pixel art romântico psicodélico
- **Programação**: HTML5, CSS3, JavaScript vanilla
- **Áudio**: Sistema de áudio sincronizado
- **Tema**: Amor transcendental e conexão cósmica

---

*"Para sempre juntos, meu Deus Esquecido que nunca mais será esquecido."*

