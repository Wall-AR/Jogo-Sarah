// DialogueManager.js - Sistema de gerenciamento de diálogos
class DialogueManager {
    constructor() {
        this.currentDialogue = null;
        this.currentLineIndex = 0;
        this.isTyping = false;
        this.typewriterSpeed = 50;
        this.typewriterIntervalId = null; // Added to store interval ID
        
        this.dialogueElement = document.getElementById('dialogue-text');
        this.nextButton = document.getElementById('btn-proximo');
        
        this.dialogues = this.initializeDialogues();
        this.setupEventListeners();
    }
    
    initializeDialogues() {
        return {
            fase1: [
                {
                    text: "Sarah... acorde. Você precisa resgatar Wallace.",
                    voice: "assets/vozes/01_fase1_intro_salem.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase1/fase1_cena_sarah_salem.png"
                },
                {
                    text: "Salem? O que está acontecendo? Onde estou?",
                    voice: "assets/vozes/02_fase1_sarah_confusa.mp3",
                    speaker: "Sarah",
                    background: "assets/imagens/fase1/fase1_cena_sarah_salem.png"
                },
                {
                    text: "Você está no plano astral, querida. Wallace foi capturado pelas forças do esquecimento.",
                    voice: "assets/vozes/03_fase1_salem_explicacao.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase1/fase1_cena_salem_aura.png"
                },
                {
                    text: "Ele se tornou o 'Deus Esquecido' e precisa ser resgatado antes que desapareça para sempre.",
                    voice: "assets/vozes/04_fase1_salem_urgencia.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase1/fase1_cena_salem_aura.png"
                },
                {
                    text: "Não! Eu não posso perdê-lo! O que preciso fazer?",
                    voice: "assets/vozes/05_fase1_sarah_determinada.mp3",
                    speaker: "Sarah",
                    background: "assets/imagens/fase1/fase1_cena_sarah_salem.png"
                },
                {
                    text: "Você deve passar por quatro provações cósmicas. Primeiro, encontre todas as manifestações de Wallace escondidas no reino Ghibli.",
                    voice: "assets/vozes/06_fase1_salem_missao.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase1/fase1_cena_oraculo_gatos.png"
                },
                {
                    text: "Os outros gatos místicos te guiarão. Lembre-se: o amor verdadeiro supera qualquer esquecimento.",
                    voice: "assets/vozes/07_fase1_salem_sabedoria.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase1/fase1_cena_oraculo_gatos.png"
                },
                {
                    text: "Eu vou salvá-lo, Salem. Nosso amor é mais forte que qualquer força cósmica!",
                    voice: "assets/vozes/08_fase1_sarah_promessa.mp3",
                    speaker: "Sarah",
                    background: "assets/imagens/fase1/fase1_cena_sarah_salem.png"
                }
            ],
            
            fase2_intro: [
                {
                    text: "Bem-vinda ao Reino Ghibli, Sarah. Aqui Wallace se escondeu em cinco formas diferentes.",
                    voice: "assets/vozes/09_fase2_intro_oraculo.mp3",
                    speaker: "Oráculo dos Gatos",
                    background: "assets/imagens/fase2/fase2_fundo_ghibli.png"
                },
                {
                    text: "Encontre todas as manifestações dele para liberar sua essência e prosseguir para o próximo desafio.",
                    voice: "assets/vozes/10_fase2_instrucoes.mp3",
                    speaker: "Oráculo dos Gatos",
                    background: "assets/imagens/fase2/fase2_fundo_ghibli.png"
                }
            ],
            
            fase2_complete: [
                {
                    text: "Incrível, Sarah! Você encontrou todas as manifestações de Wallace!",
                    voice: "assets/vozes/11_fase2_parabens.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase2/fase2_fundo_ghibli.png"
                },
                {
                    text: "Sinto sua energia se fortalecendo. Agora você deve passar pelo Ritual da Canábis Sagrada.",
                    voice: "assets/vozes/12_fase2_proximo_desafio.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase2/fase2_fundo_ghibli.png"
                }
            ],
            
            fase3_intro: [
                {
                    text: "Agora você entra no Vórtice Cósmico, onde deve coletar apenas as energias positivas.",
                    voice: "assets/vozes/13_fase3_intro_vortice.mp3",
                    speaker: "Voz Cósmica",
                    background: "assets/imagens/fase3/fase3_fundo_vortex_cosmico.png"
                },
                {
                    text: "Colete folhas douradas, cogumelos sagrados, comida e bebidas. Evite seringas e cigarros - eles drenam sua energia vital.",
                    voice: "assets/vozes/14_fase3_instrucoes.mp3",
                    speaker: "Voz Cósmica",
                    background: "assets/imagens/fase3/fase3_fundo_vortex_cosmico.png"
                },
                {
                    text: "Use as setas do teclado ou mova o mouse para controlar Sarah. Seja rápida e sábia!",
                    voice: "assets/vozes/15_fase3_controles.mp3",
                    speaker: "Voz Cósmica",
                    background: "assets/imagens/fase3/fase3_fundo_vortex_cosmico.png"
                }
            ],
            
            fase3_complete: [
                {
                    text: "Fantástico! Sua energia cósmica está purificada e amplificada!",
                    voice: "assets/vozes/16_fase3_sucesso.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase3/fase3_fundo_sala_zen.png"
                },
                {
                    text: "Agora você está pronta para o Quiz Cósmico do Amor - o teste final antes do resgate.",
                    voice: "assets/vozes/17_fase3_quiz_anuncio.mp3",
                    speaker: "Salem",
                    background: "assets/imagens/fase3/fase3_fundo_sala_zen.png"
                }
            ],
            
            fase4_intro: [
                {
                    text: "Este é o teste definitivo, Sarah. Responda às perguntas sobre seu amor por Wallace.",
                    voice: "assets/vozes/18_fase4_intro_teste.mp3",
                    speaker: "Guardião do Amor",
                    background: "assets/imagens/fase4/fase4_fundo_quiz.png"
                },
                {
                    text: "Apenas o conhecimento verdadeiro do coração pode quebrar as correntes do esquecimento.",
                    voice: "assets/vozes/19_fase4_importancia.mp3",
                    speaker: "Guardião do Amor",
                    background: "assets/imagens/fase4/fase4_fundo_quiz.png"
                }
            ],
            
            fase4_complete: [
                {
                    text: "Seu amor é verdadeiro e profundo, Sarah! As correntes do esquecimento se quebram!",
                    voice: "assets/vozes/20_fase4_vitoria.mp3",
                    speaker: "Guardião do Amor",
                    background: "assets/imagens/fase4/fase4_fundo_quiz.png"
                },
                {
                    text: "Agora você pode acessar o Altar Sagrado onde Wallace aguarda seu resgate final.",
                    voice: "assets/vozes/21_fase4_altar_liberado.mp3",
                    speaker: "Guardião do Amor",
                    background: "assets/imagens/fase4/fase4_fundo_quiz.png"
                }
            ],
            
            fase_final_intro: [
                {
                    text: "Sarah... você chegou até aqui. O Baú dos Prazeres Cósmicos contém a chave para meu retorno.",
                    voice: "assets/vozes/22_final_wallace_voz.mp3",
                    speaker: "Wallace (Voz Etérea)",
                    background: "assets/imagens/fase_final/fase_final_fundo_altar.png"
                },
                {
                    text: "Abra o baú e liberte-me do esquecimento. Nosso amor será eterno e transcendental.",
                    voice: "assets/vozes/23_final_wallace_pedido.mp3",
                    speaker: "Wallace (Voz Etérea)",
                    background: "assets/imagens/fase_final/fase_final_fundo_altar.png"
                }
            ],
            
            fase_final_complete: [
                {
                    text: "Meu amor... você me salvou! Agora somos eternos, unidos além do tempo e espaço.",
                    voice: "assets/vozes/24_final_wallace_gratidao.mp3",
                    speaker: "Wallace",
                    background: "assets/imagens/fase_final/fase_final_fundo_altar.png"
                },
                {
                    text: "Estas memórias são nossa prova de que o amor verdadeiro supera qualquer obstáculo cósmico.",
                    voice: "assets/vozes/25_final_memorias.mp3",
                    speaker: "Sarah",
                    background: "assets/imagens/fase_final/fase_final_fundo_altar.png"
                },
                {
                    text: "Para sempre juntos, meu Deus Esquecido que nunca mais será esquecido.",
                    voice: "assets/vozes/26_final_promessa_eterna.mp3",
                    speaker: "Sarah",
                    background: "assets/imagens/fase_final/fase_final_fundo_altar.png"
                }
            ]
        };
    }
    
    setupEventListeners() {
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextLine());
        }
        
        // Permitir avanço com Enter ou Espaço
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && this.currentDialogue && !this.isTyping) {
                e.preventDefault();
                this.nextLine();
            }
        });
    }
    
    startDialogue(dialogueKey) {
        this.currentDialogue = this.dialogues[dialogueKey];
        this.currentLineIndex = 0;
        
        if (this.currentDialogue && this.currentDialogue.length > 0) {
            this.showLine(this.currentDialogue[0]);
        }
    }
    
    showLine(line) {
        if (!line || !this.dialogueElement) return;
        
        this.isTyping = true;
        
        // Trocar background se especificado
        if (line.background) {
            this.changeBackground(line.background);
        }
        
        // Limpar texto atual
        this.dialogueElement.textContent = '';
        
        // Esconder botão próximo durante digitação
        if (this.nextButton) {
            this.nextButton.classList.add('hidden');
        }
        
        // Iniciar efeito de máquina de escrever
        this.typewriterEffect(line.text, line.voice).then(() => {
            this.isTyping = false;
            
            // Mostrar botão próximo após completar a digitação
            if (this.nextButton) {
                this.nextButton.classList.remove('hidden');
            }
        });
    }
    
    typewriterEffect(text, voicePath) {
        return new Promise((resolve) => {
            let charIndex = 0;
            
            // Iniciar reprodução de voz se disponível
            if (voicePath && window.game && window.game.audioManager) {
                window.game.audioManager.playVoice(voicePath, resolve);
            }
            
            // Efeito de máquina de escrever
            // Clear any existing interval before starting a new one
            if (this.typewriterIntervalId) {
                clearInterval(this.typewriterIntervalId);
                this.typewriterIntervalId = null;
            }

            this.typewriterIntervalId = setInterval(() => {
                if (charIndex < text.length) {
                    this.dialogueElement.textContent = text.substring(0, charIndex + 1);
                    charIndex++;
                    
                    // Tocar som de digitação ocasionalmente
                    if (charIndex % 3 === 0 && window.game && window.game.audioManager) {
                        window.game.audioManager.playSFX('assets/sfx/sfx_texto_avancar.mp3', 0.2);
                    }
                } else {
                    clearInterval(this.typewriterIntervalId);
                    this.typewriterIntervalId = null;
                    
                    // Se não há voz, resolver imediatamente
                    if (!voicePath) {
                        resolve();
                    }
                }
            }, this.typewriterSpeed);
        });
    }
    
    nextLine() {
        if (this.isTyping) return;
        
        this.currentLineIndex++;
        
        if (this.currentLineIndex < this.currentDialogue.length) {
            // Mostrar próxima linha
            this.showLine(this.currentDialogue[this.currentLineIndex]);
        } else {
            // Diálogo terminado
            this.endDialogue();
        }
    }
    
    endDialogue() {
        this.currentDialogue = null;
        this.currentLineIndex = 0;
        
        // Determinar próxima ação baseada na fase atual
        if (window.game) {
            const currentPhase = window.game.currentPhase;
            
            switch (currentPhase) {
                case 'fase1':
                    window.game.startPhase2();
                    break;
                case 'fase2':
                    // Diálogo de conclusão da fase 2 já foi mostrado
                    break;
                case 'fase3':
                    // Diálogo de conclusão da fase 3 já foi mostrado
                    break;
                case 'fase4':
                    // Diálogo de conclusão da fase 4 já foi mostrado
                    break;
                case 'fase-final':
                    // Continuar com a sequência final
                    break;
            }
        }
    }
    
    changeBackground(backgroundPath) {
        const backgroundImage = document.querySelector('#fase1 .background-image');
        if (backgroundImage) {
            backgroundImage.src = backgroundPath;
        }
    }
    
    // Método para mostrar diálogos de transição entre fases
    showTransitionDialogue(dialogueKey, callback) {
        this.startDialogue(dialogueKey);
        
        // Configurar callback para quando o diálogo terminar
        const originalEndDialogue = this.endDialogue.bind(this);
        this.endDialogue = () => {
            this.endDialogue = originalEndDialogue;
            if (callback) callback();
        };
    }
    
    // Método para pular diálogo (se necessário)
    skipDialogue() {
        if (this.currentDialogue) {
            this.currentLineIndex = this.currentDialogue.length;
            this.endDialogue();
        }
    }
    
    // Método para pausar/retomar diálogo
    pauseDialogue() {
        if (window.game && window.game.audioManager) {
            window.game.audioManager.stopVoice(); // Stops current voice playback
        }
        if (this.typewriterIntervalId) {
            clearInterval(this.typewriterIntervalId); // Stops text typing
            this.typewriterIntervalId = null;
        }
        // Note: this.isTyping is set to false when the typewriterEffect promise resolves or in showLine.
        // If we pause mid-typing, isTyping might still be true from showLine's perspective.
        // Forcing it false ensures the "Next" button might appear if needed, or input is unblocked.
        this.isTyping = false;
        // To allow "Next" button to show if dialogue was paused mid-line,
        // as the normal typewriter promise resolution that shows it might be bypassed.
        if (this.nextButton && this.currentDialogue) {
            this.nextButton.classList.remove('hidden');
        }
    }
    
    resumeDialogue() {
        // Resuming should ideally continue from where it left off, but current showLine restarts the line.
        // For simplicity, we'll stick to restarting the current line's display.
        if (this.currentDialogue && this.currentLineIndex < this.currentDialogue.length) {
            this.showLine(this.currentDialogue[this.currentLineIndex]);
        }
    }
    
    // Método para configurar velocidade de digitação
    setTypewriterSpeed(speed) {
        this.typewriterSpeed = Math.max(10, Math.min(200, speed));
    }
    
    // Método para obter lista de arquivos de voz necessários
    getVoiceFilesList() {
        const voiceFiles = [];
        
        Object.values(this.dialogues).forEach(dialogue => {
            dialogue.forEach(line => {
                if (line.voice) {
                    voiceFiles.push({
                        file: line.voice,
                        text: line.text,
                        speaker: line.speaker
                    });
                }
            });
        });
        
        return voiceFiles;
    }
    
    // Método para exportar diálogos para arquivo
    exportDialogues() {
        const exportData = {
            dialogues: this.dialogues,
            voiceFiles: this.getVoiceFilesList(),
            instructions: "Adicione os arquivos de voz na pasta assets/vozes/ com os nomes especificados"
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    getVoiceFilePaths() {
        const voicePaths = new Set();
        Object.values(this.dialogues).forEach(dialogueSet => {
            dialogueSet.forEach(line => {
                if (line.voice) {
                    voicePaths.add(line.voice);
                }
            });
        });
        return Array.from(voicePaths);
    }
}

