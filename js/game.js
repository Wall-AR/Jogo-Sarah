// Game.js - Sistema principal do jogo
class Game {
    constructor() {
        this.currentPhase = 'loading';
        this.gameData = {
            wallaceFound: 0,
            score: 0,
            lives: 3,
            currentQuestion: 0,
            quizAnswers: []
        };
        
        this.assets = {
            images: new Map(),
            audio: new Map(),
            loaded: 0,
            total: 0
        };
        
        this.screens = new Map();
        this.audioManager = null;
        this.dialogueManager = null;
        this.animationManager = null;
        // Instantiate DialogueManager early to get voice file paths for preloading
        // This assumes DialogueManager constructor can run without full game setup if only used for data retrieval.
        // Or, DialogueManager could have a static method to get dialogue data if it's purely data.
        // For now, direct instantiation:
        this.dialogueManager = new DialogueManager();
        
        this.init();
    }
    
    init() {
        this.setupScreens();
        this.setupEventListeners();
        this.preloadAssets();
    }
    
    setupScreens() {
        // Mapear todas as telas do jogo
        this.screens.set('loading', document.getElementById('loading-screen'));
        this.screens.set('tela-inicial', document.getElementById('tela-inicial'));
        this.screens.set('fase1', document.getElementById('fase1'));
        this.screens.set('fase2', document.getElementById('fase2'));
        this.screens.set('fase3', document.getElementById('fase3'));
        this.screens.set('fase4', document.getElementById('fase4'));
        this.screens.set('fase-final', document.getElementById('fase-final'));
        this.screens.set('creditos', document.getElementById('creditos'));
    }
    
    setupEventListeners() {
        // Botão começar
        const btnComecar = document.getElementById('btn-comecar');
        if (btnComecar) {
            btnComecar.addEventListener('click', () => this.startGame());
        }
        
        // Controles de áudio
        const muteToggle = document.getElementById('mute-toggle');
        const volumeSlider = document.getElementById('volume-slider');
        
        if (muteToggle) {
            muteToggle.addEventListener('click', () => this.toggleMute());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Eventos de mouse para fase 3
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    preloadAssets() {
        const imagePaths = [
            // Tela inicial
            'assets/imagens/tela_inicio/tela_inicio_fundo.png',
            'assets/imagens/tela_inicio/tela_inicio_titulo.png',
            'assets/imagens/tela_inicio/tela_inicio_sarah_flutuando.png',
            'assets/imagens/tela_inicio/tela_inicio_salem_flutuando.png',
            'assets/imagens/tela_inicio/tela_inicio_salem_piscando_1.png',
            'assets/imagens/tela_inicio/tela_inicio_salem_piscando_2.png',
            
            // UI
            'assets/ui/ui_botao_comecar.png',
            'assets/ui/ui_botao_comecar_hover.png',
            'assets/ui/ui_caixa_dialogo.png',
            
            // Fase 1
            'assets/imagens/fase1/fase1_cena_sarah_salem.png',
            'assets/imagens/fase1/fase1_cena_salem_aura.png',
            'assets/imagens/fase1/fase1_cena_oraculo_gatos.png',
            
            // Fase 2
            'assets/imagens/fase2/fase2_fundo_ghibli.png',
            'assets/imagens/fase2/fase2_wallace_escondido_1.png',
            'assets/imagens/fase2/fase2_wallace_escondido_2.png',
            'assets/imagens/fase2/fase2_wallace_escondido_3.png',
            'assets/imagens/fase2/fase2_wallace_escondido_4.png',
            'assets/imagens/fase2/fase2_wallace_escondido_5.png',
            
            // Fase 3
            'assets/imagens/fase3/fase3_fundo_vortex_cosmico.png',
            'assets/imagens/fase3/fase3_fundo_sala_zen.png',
            'assets/imagens/fase3/fase3_sarah_idle.png',
            'assets/imagens/fase3/fase3_item_folha_dourada.png',
            'assets/imagens/fase3/fase3_item_cogumelo_amanita.png',
            'assets/imagens/fase3/fase3_item_comida.png',
            'assets/imagens/fase3/fase3_item_bebida.png',
            'assets/imagens/fase3/fase3_item_seringa.png',
            'assets/imagens/fase3/fase3_item_cigarro.png',
            
            // Fase 4
            'assets/imagens/fase4/fase4_fundo_quiz.png',
            
            // Fase Final
            'assets/imagens/fase_final/fase_final_fundo_altar.png',
            'assets/imagens/fase_final/fase_final_bau_fechado.png',
            'assets/imagens/fase_final/fase_final_bau_aberto.png',
            'assets/imagens/fase_final/fase_final_chocolates.png',
            'assets/imagens/fase_final/fase_final_camisola_sexy.png',
            'assets/imagens/fase_final/fase_final_coracao_pixel.png',
            'assets/imagens/fase_final/fase_final_imagem_casal_1.png',
            'assets/imagens/fase_final/fase_final_imagem_casal_2.png',
            'assets/imagens/fase_final/fase_final_imagem_casal_3.png'
        ];
        
        const audioPaths = [
            // Músicas
            'assets/musica/music_intro_ambiente.mp3',
            'assets/musica/music_fase1_ambiente.mp3', // Added missing music track
            'assets/musica/music_fase2_ambiente.mp3',
            'assets/musica/music_fase3_gameplay.mp3',
            'assets/musica/music_fase4_quiz.mp3',
            'assets/musica/music_fase_final_ambiente.mp3',
            'assets/musica/music_careless_whisper_chiptune.mp3',
            
            // SFX
            'assets/sfx/sfx_botao_clique.mp3',
            'assets/sfx/sfx_salem_piscar.mp3',
            'assets/sfx/sfx_texto_avancar.mp3',
            'assets/sfx/sfx_transicao_cena.mp3',
            'assets/sfx/sfx_wallace_encontrado.mp3',
            'assets/sfx/sfx_fase2_completa.mp3',
            'assets/sfx/sfx_item_bom_pego.mp3',
            'assets/sfx/sfx_item_ruim_pego.mp3',
            'assets/sfx/sfx_fase3_completa.mp3',
            'assets/sfx/sfx_resposta_certa.mp3',
            'assets/sfx/sfx_resposta_errada.mp3',
            'assets/sfx/sfx_fase4_completa.mp3',
            'assets/sfx/sfx_puzzle_revelar_peca.mp3',
            'assets/sfx/sfx_puzzle_completo.mp3',
            'assets/sfx/sfx_bau_pulsando.mp3',
            'assets/sfx/sfx_bau_abrir.mp3',
            'assets/sfx/sfx_presente_revelado.mp3',
            'assets/sfx/sfx_foto_transicao.mp3',
            'assets/sfx/sfx_creditos_iniciar.mp3'
        ];

        // Get voice file paths from DialogueManager
        const voiceFilePaths = this.dialogueManager.getVoiceFilePaths();
        const allAudioPaths = audioPaths.concat(voiceFilePaths);
        
        this.assets.total = imagePaths.length + allAudioPaths.length;
        
        // Carregar imagens
        imagePaths.forEach(path => this.loadImage(path));
        
        // Carregar áudios (including voices)
        allAudioPaths.forEach(path => this.loadAudio(path));
    }
    
    loadImage(path) {
        const img = new Image();
        img.onload = () => {
            this.assets.images.set(path, img);
            this.updateLoadingProgress();
        };
        img.onerror = () => {
            console.warn(`Falha ao carregar imagem: ${path}`);
            this.updateLoadingProgress();
        };
        img.src = path;
    }
    
    loadAudio(path) {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => {
            this.assets.audio.set(path, audio);
            this.updateLoadingProgress();
        });
        audio.addEventListener('error', () => {
            console.warn(`Falha ao carregar áudio: ${path}`);
            this.updateLoadingProgress();
        });
        audio.src = path;
    }
    
    updateLoadingProgress() {
        this.assets.loaded++;
        const progress = (this.assets.loaded / this.assets.total) * 100;
        
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (this.assets.loaded >= this.assets.total) {
            setTimeout(() => this.finishLoading(), 500);
        }
    }
    
    finishLoading() {
        this.changeScreen('loading', 'tela-inicial');
        
        // Inicializar managers
        this.audioManager = new AudioManager(this.assets.audio);
        // this.dialogueManager was already instantiated
        if (!this.dialogueManager) { // Should not happen if instantiated before init
            this.dialogueManager = new DialogueManager();
        }
        this.animationManager = new AnimationManager();
        this.phaseManager = new PhaseManager(this);
        
        // A música de intro já é iniciada automaticamente no AudioManager
        
        // Iniciar animações da tela inicial
        this.animationManager.startInitialAnimations();
    }
    
    changeScreen(fromScreen, toScreen) {
        const from = this.screens.get(fromScreen);
        const to = this.screens.get(toScreen);

        // Call cleanup for the outgoing phase if it's a game phase
        if (fromScreen && fromScreen.startsWith('fase')) {
            if (this.phaseManager) {
                console.log(`Cleaning up phase: ${fromScreen}`);
                this.phaseManager.cleanup();
            }
        }
        
        if (from) {
            from.classList.remove('active');
            from.classList.add('fade-out');
        }
        
        setTimeout(() => {
            if (from) {
                from.classList.remove('fade-out');
                from.style.display = 'none';
            }
            
            if (to) {
                to.style.display = 'block';
                to.classList.add('fade-in');
                to.classList.add('active');
                
                setTimeout(() => {
                    to.classList.remove('fade-in');
                }, 1000);
            }
            
            this.currentPhase = toScreen;
        }, 1000); // Changed from 500ms to 1000ms to match fadeOut animation in styles.css
    }
    
    startGame() {
        this.audioManager.playSFX('assets/sfx/sfx_botao_clique.mp3');
        this.audioManager.playSFX('assets/sfx/sfx_transicao_cena.mp3');
        
        setTimeout(() => {
            this.changeScreen('tela-inicial', 'fase1');
            this.audioManager.startPhase1Music();
            this.startPhase1();
        }, 1000);
    }
    
    startPhase1() {
        this.dialogueManager.startDialogue('fase1');
    }
    
    startPhase2() {
        this.changeScreen('fase1', 'fase2');
        this.audioManager.startPhase2Music();
        this.phaseManager.initializePhase2();
    }
    
    startPhase3() {
        this.changeScreen('fase2', 'fase3');
        this.audioManager.startPhase3Music();
        this.phaseManager.initializePhase3();
    }
    
    startPhase4() {
        this.changeScreen('fase3', 'fase4');
        this.audioManager.startPhase4Music();
        this.phaseManager.initializePhase4();
    }
    
    startFinalPhase() {
        this.changeScreen('fase4', 'fase-final');
        this.audioManager.startFinalPhaseMusic();
        this.phaseManager.initializeFinalPhase();
    }
    
    
    handleKeyPress(e) {
        // Teclas globais
        if (e.key === 'Escape') {
            this.togglePause();
        } else if (e.key === 'm' || e.key === 'M') {
            this.toggleMute();
        }
    }
    
    handleMouseMove(e) {
        // Fase 3 mouse move logic is now handled by PhaseManager.js
        // if (this.currentPhase === 'fase3') {
        //     const sarahContainer = document.querySelector('.sarah-container');
        //     if (sarahContainer) {
        //         const gameArea = document.querySelector('.game-area');
        //         const rect = gameArea.getBoundingClientRect();
        //         const x = ((e.clientX - rect.left) / rect.width) * 100;
        //
        //         if (x >= 10 && x <= 90) {
        //             sarahContainer.style.left = `${x}%`;
        //         }
        //     }
        // }
    }
    
    toggleMute() {
        if (this.audioManager) {
            this.audioManager.toggleMute();
            
            const muteBtn = document.getElementById('mute-toggle');
            if (muteBtn) {
                muteBtn.textContent = this.audioManager.isMuted ? '🔇' : '🔊';
            }
        }
    }
    
    setVolume(value) {
        if (this.audioManager) {
            this.audioManager.setVolume(value / 100);
        }
    }
    
    togglePause() {
        // Implementar pausa se necessário
        console.log('Pause toggled');
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

