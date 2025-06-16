// Phases.js - Mecânicas específicas de cada fase
class PhaseManager {
    constructor(game) {
        this.game = game;
        this.currentPhaseData = {};
        
        this.init();
    }
    
    init() {
        this.setupPhaseSpecificMechanics();
    }
    
    setupPhaseSpecificMechanics() {
        // Configurações específicas para cada fase
        this.phaseConfigs = {
            fase2: {
                wallacePositions: [
                    { id: 1, x: 12, y: 25 },  // Canto superior esquerdo
                    { id: 2, x: 75, y: 15 },  // Canto superior direito
                    { id: 3, x: 30, y: 60 },  // Centro-esquerda
                    { id: 4, x: 65, y: 45 },  // Centro-direita
                    { id: 5, x: 45, y: 80 }   // Centro-inferior
                ],
                requiredFinds: 5
            },
            
            fase3: {
                goodItems: [
                    { src: 'assets/imagens/fase3/fase3_item_folha_dourada.png', points: 15, name: 'Folha Dourada' },
                    { src: 'assets/imagens/fase3/fase3_item_cogumelo_amanita.png', points: 20, name: 'Cogumelo Sagrado' },
                    { src: 'assets/imagens/fase3/fase3_item_comida.png', points: 10, name: 'Alimento Cósmico' },
                    { src: 'assets/imagens/fase3/fase3_item_bebida.png', points: 10, name: 'Néctar Divino' }
                ],
                badItems: [
                    { src: 'assets/imagens/fase3/fase3_item_seringa.png', damage: 1, name: 'Seringa Tóxica' },
                    { src: 'assets/imagens/fase3/fase3_item_cigarro.png', damage: 1, name: 'Fumaça Negativa' }
                ],
                spawnRate: 1500,  // Reduzido para spawnar mais rápido
                fallSpeed: 2,
                targetScore: 30,  // Reduzido de 50 para 30
                maxLives: 3
            },
            
            fase4: {
                questions: [
                    {
                        question: "Qual é a cor favorita da Sarah?",
                        answers: ["Roxo", "Azul", "Rosa", "Verde"],
                        correct: 0,
                        explanation: "Sarah ama a cor roxa, que representa misticismo e espiritualidade."
                    },
                    {
                        question: "Onde foi o primeiro encontro especial do casal?",
                        answers: ["Cinema", "Parque", "Restaurante", "Casa da Sarah"],
                        correct: 3,
                        explanation: "O primeiro momento mágico aconteceu na casa da Sarah."
                    },
                    {
                        question: "Qual é o filme favorito que assistem juntos?",
                        answers: ["Romance clássico", "Ficção científica", "Comédia romântica", "Terror psicológico"],
                        correct: 1,
                        explanation: "Eles adoram explorar universos de ficção científica juntos."
                    },
                    {
                        question: "Qual é o apelido mais carinhoso do Wallace?",
                        answers: ["Amor", "Querido", "Deus Esquecido", "Príncipe"],
                        correct: 2,
                        explanation: "Wallace é o 'Deus Esquecido' que Sarah sempre lembra com amor."
                    },
                    {
                        question: "Qual é a comida favorita para compartilhar?",
                        answers: ["Pizza", "Chocolate", "Sushi", "Hambúrguer"],
                        correct: 1,
                        explanation: "Chocolate é o doce que simboliza a doçura do relacionamento."
                    }
                ]
            }
        };
    }
    
    // Fase 2: Cadê o Wallace?
    initializePhase2() {
        const config = this.phaseConfigs.fase2;
        this.currentPhaseData = {
            wallaceFound: 0,
            totalWallace: config.requiredFinds,
            foundPositions: new Set(),
            wallaceElements: [] // To store elements for cleanup
        };
        
        this.setupWallacePositions();
        this.updateWallaceProgress();

        // Mostrar diálogo de introdução para Fase 2
        if (this.game.dialogueManager) {
            this.game.dialogueManager.showTransitionDialogue('fase2_intro', () => {
                // Gameplay for Fase 2 can start immediately after dialogue.
                // No specific gameActive flag needed for this phase's core mechanic.
                console.log("Fase 2 intro dialogue complete. Gameplay enabled.");
            });
        }
    }
    
    setupWallacePositions() {
        const wallaceElements = document.querySelectorAll('.wallace-hidden');
        const config = this.phaseConfigs.fase2;
        
        // Clear previous listeners if any (e.g. if phase is restarted)
        this.currentPhaseData.wallaceElements.forEach(entry => {
            entry.element.removeEventListener('click', entry.handler);
        });
        this.currentPhaseData.wallaceElements = [];

        wallaceElements.forEach((wallace, index) => {
            if (config.wallacePositions[index]) {
                const pos = config.wallacePositions[index];
                wallace.style.left = `${pos.x}%`;
                wallace.style.top = `${pos.y}%`;
                
                const handler = (e) => this.handleWallaceClick(wallace, pos.id);
                wallace.addEventListener('click', handler);
                this.currentPhaseData.wallaceElements.push({ element: wallace, handler: handler });
            }
        });
    }
    
    handleWallaceClick(wallaceElement, wallaceId) {
        if (this.currentPhaseData.foundPositions.has(wallaceId)) return;
        
        this.currentPhaseData.foundPositions.add(wallaceId);
        this.currentPhaseData.wallaceFound++;
        
        // Efeito visual de descoberta
        if (this.game.animationManager) {
            this.game.animationManager.animateWallaceFound(wallaceElement);
        }
        // this.createWallaceFoundEffect(wallaceElement); // Removed local version
        
        // Som de descoberta
        if (this.game.audioManager) {
            this.game.audioManager.playSFX('assets/sfx/sfx_wallace_encontrado.mp3');
        }
        
        // Marcar como encontrado
        wallaceElement.classList.add('found');
        wallaceElement.style.pointerEvents = 'none';
        
        this.updateWallaceProgress();
        
        // Verificar se completou a fase
        if (this.currentPhaseData.wallaceFound >= this.currentPhaseData.totalWallace) {
            setTimeout(() => {
                this.completePhase2();
            }, 1500);
        }
    }
    
    // createWallaceFoundEffect(wallaceElement) { // Removed in favor of AnimationManager.animateWallaceFound
    //     // Flash de descoberta
    //     const flash = document.createElement('div');
    //     flash.style.position = 'absolute';
    //     flash.style.top = wallaceElement.style.top;
    //     flash.style.left = wallaceElement.style.left;
    //     flash.style.width = '120px';
    //     flash.style.height = '120px';
    //     flash.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,215,0,0.7) 50%, transparent 100%)';
    //     flash.style.borderRadius = '50%';
    //     flash.style.transform = 'translate(-50%, -50%)';
    //     flash.style.pointerEvents = 'none';
    //     flash.style.zIndex = '100';
    //     flash.style.animation = 'wallaceFlash 0.8s ease-out forwards';

    //     // Adicionar ao container
    //     const container = document.querySelector('.wallace-spots');
    //     if (container) {
    //         container.appendChild(flash);
    //     }

    //     // Zoom no Wallace encontrado
    //     wallaceElement.style.transition = 'all 0.6s ease-out';
    //     wallaceElement.style.transform = 'scale(1.5)';
    //     wallaceElement.style.filter = 'brightness(1.5) drop-shadow(0 0 20px rgba(255,215,0,0.8))';
    //     wallaceElement.style.zIndex = '50';

    //     // Remover efeitos após animação
    //     setTimeout(() => {
    //         if (flash.parentElement) {
    //             flash.remove();
    //         }
    //         wallaceElement.style.transform = 'scale(1)';
    //         wallaceElement.style.filter = 'brightness(1) opacity(0.7)';
    //     }, 800);
    // }
    
    updateWallaceProgress() {
        const progressElement = document.getElementById('wallace-found');
        if (progressElement) {
            progressElement.textContent = this.currentPhaseData.wallaceFound;
        }
    }
    
    completePhase2() {
        if (this.game.audioManager) {
            this.game.audioManager.playSFX('assets/sfx/sfx_fase2_completa.mp3');
        }
        
        // Mostrar diálogo de conclusão
        if (this.game.dialogueManager) {
            console.log("PhaseManager: completePhase2 - Calling showTransitionDialogue for 'fase2_complete'.");
            this.game.dialogueManager.showTransitionDialogue('fase2_complete', () => {
                console.log("PhaseManager: fase2_complete dialogue callback EXECUTING.");
                // this.cleanupPhase2(); // Cleanup now handled by Game.js calling phaseManager.cleanup()
                this.game.startPhase3();
            });
        } else {
            // Fallback if dialogueManager is not available (should not happen in normal flow)
            console.warn("PhaseManager: DialogueManager not available in completePhase2. Attempting direct transition.");
            // this.cleanupPhase2(); // Cleanup now handled by Game.js calling phaseManager.cleanup()
            this.game.startPhase3();
        }
    }

    cleanupPhase2() {
        this.currentPhaseData.wallaceElements.forEach(entry => {
            entry.element.removeEventListener('click', entry.handler);
        });
        this.currentPhaseData.wallaceElements = [];
    }
    
    // Fase 3: Ritual da Canábis Sagrada
    initializePhase3() {
        const config = this.phaseConfigs.fase3;
        this.currentPhaseData = {
            score: 0,
            lives: config.maxLives,
            targetScore: config.targetScore,
            itemSpawner: null,
            sarahPosition: 50,
            activeItems: new Set(),
            gameActive: false // Start inactive until intro dialogue finishes
        };
        
        this.setupPhase3Controls();
        this.startItemSpawning();
        this.updatePhase3UI();
        
        // Mostrar diálogo de introdução
        if (this.game.dialogueManager) {
            this.game.dialogueManager.showTransitionDialogue('fase3_intro', () => {
                this.currentPhaseData.gameActive = true; // Activate after dialogue
            });
        } else {
            this.currentPhaseData.gameActive = true; // Fallback if no dialogue manager
        }
    }
    
    setupPhase3Controls() {
        // Controles de teclado
        this.phase3KeyHandler = (e) => {
            if (!this.currentPhaseData.gameActive) return;
            
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.moveSarah('left');
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.moveSarah('right');
            }
        };
        
        document.addEventListener('keydown', this.phase3KeyHandler);
        
        // Controles de mouse
        this.phase3MouseHandler = (e) => {
            if (!this.currentPhaseData.gameActive) return;
            
            const gameArea = document.querySelector('.game-area');
            if (gameArea) {
                const rect = gameArea.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                
                if (x >= 10 && x <= 90) {
                    this.setSarahPosition(x);
                }
            }
        };
        
        document.addEventListener('mousemove', this.phase3MouseHandler);
    }
    
    moveSarah(direction) {
        const step = 5;
        
        if (direction === 'left' && this.currentPhaseData.sarahPosition > 10) {
            this.currentPhaseData.sarahPosition -= step;
        } else if (direction === 'right' && this.currentPhaseData.sarahPosition < 90) {
            this.currentPhaseData.sarahPosition += step;
        }
        
        this.setSarahPosition(this.currentPhaseData.sarahPosition);
        
        // Animação de movimento
        if (this.game.animationManager) {
            this.game.animationManager.animateSarahMovement(direction);
        }
    }
    
    setSarahPosition(x) {
        this.currentPhaseData.sarahPosition = Math.max(10, Math.min(90, x));
        
        const sarahContainer = document.querySelector('.sarah-container');
        if (sarahContainer) {
            sarahContainer.style.left = `${this.currentPhaseData.sarahPosition}%`;
        }
    }
    
    startItemSpawning() {
        const config = this.phaseConfigs.fase3;
        
        // Garantir que o spawner anterior seja limpo
        if (this.currentPhaseData.itemSpawner) {
            clearInterval(this.currentPhaseData.itemSpawner);
        }
        
        this.currentPhaseData.itemSpawner = setInterval(() => {
            if (this.currentPhaseData.gameActive && this.currentPhaseData.lives > 0) {
                this.spawnRandomItem();
            }
        }, config.spawnRate);
        
        // Spawnar primeiro item imediatamente
        setTimeout(() => {
            if (this.currentPhaseData.gameActive) {
                this.spawnRandomItem();
            }
        }, 500);
    }
    
    spawnRandomItem() {
        const config = this.phaseConfigs.fase3;
        const allItems = [...config.goodItems, ...config.badItems];
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        const isGoodItem = config.goodItems.includes(randomItem);
        
        const itemElement = this.createFallingItem(randomItem, isGoodItem);
        this.animateItemFall(itemElement, randomItem, isGoodItem);
    }
    
    createFallingItem(itemData, isGood) {
        const item = document.createElement('img');
        item.src = itemData.src;
        item.className = 'falling-item';
        item.style.left = `${Math.random() * 80 + 10}%`;
        item.style.top = '0px';
        item.style.position = 'absolute';
        item.style.zIndex = '10';
        
        // Adicionar dados do item
        item.dataset.isGood = isGood;
        item.dataset.points = isGood ? itemData.points : 0;
        item.dataset.damage = isGood ? 0 : itemData.damage;
        item.dataset.name = itemData.name;
        
        const itemsContainer = document.getElementById('items-container');
        if (itemsContainer) {
            itemsContainer.appendChild(item);
        }
        
        // Adicionar evento de clique
        item.addEventListener('click', () => {
            this.collectItem(item, isGood, itemData);
        });
        
        return item;
    }
    
    animateItemFall(item, itemData, isGood) {
        const config = this.phaseConfigs.fase3;
        let position = 0;
        const fallSpeed = config.fallSpeed + Math.random() * 1;
        
        const fall = () => {
            if (!this.currentPhaseData.gameActive) {
                item.remove();
                return;
            }
            
            position += fallSpeed;
            item.style.top = `${position}px`;
            
            // Verificar colisão com Sarah
            if (this.checkCollisionWithSarah(item)) {
                this.collectItem(item, isGood, itemData);
                return;
            }
            
            // Remover se saiu da tela
            if (position > window.innerHeight) {
                item.remove();
            } else {
                requestAnimationFrame(fall);
            }
        };
        
        fall();
        
        // Remover após timeout
        setTimeout(() => {
            if (item.parentElement) {
                item.remove();
            }
        }, 10000);
    }
    
    checkCollisionWithSarah(item) {
        const sarahContainer = document.querySelector('.sarah-container');
        if (!sarahContainer || !item) return false;
        
        const sarahRect = sarahContainer.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        
        return (
            itemRect.left < sarahRect.right &&
            itemRect.right > sarahRect.left &&
            itemRect.top < sarahRect.bottom &&
            itemRect.bottom > sarahRect.top
        );
    }
    
    collectItem(item, isGood, itemData) {
        if (!this.currentPhaseData.gameActive) return;
        
        // Animação de coleta
        if (this.game.animationManager) {
            this.game.animationManager.animateItemCollection(item, isGood);
        }
        
        // Atualizar pontuação/vidas
        if (isGood) {
            this.currentPhaseData.score += itemData.points || 10;
            if (this.game.audioManager) {
                this.game.audioManager.playSFX('assets/sfx/sfx_item_bom_pego.mp3');
            }
        } else {
            this.currentPhaseData.lives -= itemData.damage || 1;
            if (this.game.audioManager) {
                this.game.audioManager.playSFX('assets/sfx/sfx_item_ruim_pego.mp3');
            }
        }
        
        this.updatePhase3UI();
        
        // Remover item
        setTimeout(() => {
            if (item.parentElement) {
                item.remove();
            }
        }, 300);
        
        // Verificar condições de fim
        if (this.currentPhaseData.lives <= 0) {
            this.gameOverPhase3();
        } else if (this.currentPhaseData.score >= this.currentPhaseData.targetScore) {
            this.completePhase3();
        }
    }
    
    updatePhase3UI() {
        const scoreElement = document.getElementById('score');
        const livesDisplay = document.getElementById('lives-display');
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');
        
        if (scoreElement) scoreElement.textContent = this.currentPhaseData.score;
        
        // Atualizar vidas (corações)
        if (livesDisplay) {
            const hearts = livesDisplay.querySelectorAll('.life-heart');
            hearts.forEach((heart, index) => {
                if (index < this.currentPhaseData.lives) {
                    heart.style.opacity = '1';
                    heart.style.animation = 'heartbeat 1.5s ease-in-out infinite';
                } else {
                    heart.style.opacity = '0.3';
                    heart.style.animation = 'none';
                }
            });
        }
        
        // Atualizar barra de progresso
        const progress = Math.min(100, (this.currentPhaseData.score / this.currentPhaseData.targetScore) * 100);
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;
        if (progressFill) progressFill.style.width = `${progress}%`;
    }
    
    gameOverPhase3() {
        this.currentPhaseData.gameActive = false;
        this.cleanupPhase3();
        
        setTimeout(() => {
            alert('Suas energias se esgotaram! Reiniciando o ritual...');
            this.initializePhase3();
        }, 1000);
    }
    
    completePhase3() {
        this.currentPhaseData.gameActive = false;
        this.cleanupPhase3();
        
        if (this.game.audioManager) {
            this.game.audioManager.playSFX('assets/sfx/sfx_fase3_completa.mp3');
        }
        
        // Mostrar diálogo de conclusão
        if (this.game.dialogueManager) {
            this.game.dialogueManager.showTransitionDialogue('fase3_complete', () => {
                this.game.startPhase4();
            });
        } else {
            // Fallback if dialogueManager is not available
            this.game.startPhase4();
        }
    }
    
    cleanupPhase3() {
        // Limpar spawner
        if (this.currentPhaseData.itemSpawner) {
            clearInterval(this.currentPhaseData.itemSpawner);
        }
        
        // Remover event listeners
        document.removeEventListener('keydown', this.phase3KeyHandler);
        document.removeEventListener('mousemove', this.phase3MouseHandler);
        
        // Limpar itens restantes
        const itemsContainer = document.getElementById('items-container');
        if (itemsContainer) {
            itemsContainer.innerHTML = '';
        }
    }
    
    // Fase 4: Quiz Cósmico
    initializePhase4() {
        const config = this.phaseConfigs.fase4;
        this.currentPhaseData = {
            currentQuestion: 0,
            correctAnswers: 0,
            questions: [...config.questions],
            answers: []
        };
        
        // Mostrar diálogo de introdução
        if (this.game.dialogueManager) {
            this.game.dialogueManager.showTransitionDialogue('fase4_intro', () => {
                this.showQuestion();
            });
        } else {
            this.showQuestion();
        }
    }
    
    showQuestion() {
        const questionData = this.currentPhaseData.questions[this.currentPhaseData.currentQuestion];
        if (!questionData) {
            this.completePhase4();
            return;
        }
        
        const questionText = document.getElementById('question-text');
        const answersContainer = document.getElementById('answers-container');
        const currentQuestionElement = document.getElementById('current-question');
        const totalQuestionsElement = document.getElementById('total-questions');
        
        if (questionText) questionText.textContent = questionData.question;
        if (currentQuestionElement) currentQuestionElement.textContent = this.currentPhaseData.currentQuestion + 1;
        if (totalQuestionsElement) totalQuestionsElement.textContent = this.currentPhaseData.questions.length;
        
        if (answersContainer) {
            answersContainer.innerHTML = '';
            
            questionData.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = answer;
                
                button.addEventListener('click', () => {
                    this.answerQuestion(index, questionData.correct, button, questionData);
                });
                
                answersContainer.appendChild(button);
            });
        }
    }
    
    answerQuestion(selectedIndex, correctIndex, button, questionData) {
        const isCorrect = selectedIndex === correctIndex;
        
        // Animação de resposta
        if (this.game.animationManager) {
            this.game.animationManager.animateQuizAnswer(button, isCorrect);
        }
        
        // Som de resposta
        if (this.game.audioManager) {
            const sfx = isCorrect ? 'assets/sfx/sfx_resposta_certa.mp3' : 'assets/sfx/sfx_resposta_errada.mp3';
            this.game.audioManager.playSFX(sfx);
        }
        
        // Marcar botão
        button.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Registrar resposta
        this.currentPhaseData.answers.push({
            question: questionData.question,
            selectedAnswer: questionData.answers[selectedIndex],
            correctAnswer: questionData.answers[correctIndex],
            isCorrect: isCorrect,
            explanation: questionData.explanation
        });
        
        if (isCorrect) {
            this.currentPhaseData.correctAnswers++;
        }
        
        // Desabilitar todos os botões
        const allButtons = document.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.disabled = true);
        
        // Mostrar explicação brevemente
        setTimeout(() => {
            this.currentPhaseData.currentQuestion++;
            this.showQuestion();
        }, 2000);
    }
    
    completePhase4() {
        if (this.game.audioManager) {
            this.game.audioManager.playSFX('assets/sfx/sfx_fase4_completa.mp3');
        }
        
        // Mostrar resultado do quiz
        const score = this.currentPhaseData.correctAnswers;
        const total = this.currentPhaseData.questions.length;
        
        console.log(`Quiz concluído: ${score}/${total} respostas corretas`);
        
        // Mostrar diálogo de conclusão
        if (this.game.dialogueManager) {
            this.game.dialogueManager.showTransitionDialogue('fase4_complete', () => {
                this.game.startFinalPhase();
            });
        } else {
            // Fallback if dialogueManager is not available
            this.game.startFinalPhase();
        }
    }
    
    // Fase Final: O Baú
    initializeFinalPhase() {
        this.currentPhaseData = {
            chestOpened: false,
            memoriesStarted: false,
            currentMemory: 0,
            memoryInterval: null,
            chestPulseAnimationId: null, // To store chest pulse animation ID
            chestClickHandler: null // To store chest click handler
        };
        
        // Mostrar diálogo de introdução
        if (this.game.dialogueManager) {
            this.game.dialogueManager.showTransitionDialogue('fase_final_intro', () => {
                this.setupTreasureChest();
            });
        } else {
            this.setupTreasureChest();
        }
    }
    
    setupTreasureChest() {
        const bauFechado = document.getElementById('bau-fechado');
        const bauAberto = document.getElementById('bau-aberto');
        
        if (bauFechado) {
            // Animação de pulsação
            if (this.game.animationManager) {
                // Stop previous pulse if any (e.g., phase restart)
                if (this.currentPhaseData.chestPulseAnimationId) {
                    this.game.animationManager.stopAnimation(this.currentPhaseData.chestPulseAnimationId);
                }
                this.currentPhaseData.chestPulseAnimationId = this.game.animationManager.animateTreasureChestPulse(bauFechado);
            }
            
            // Som de pulsação
            if (this.game.audioManager) {
                this.game.audioManager.playSFX('assets/sfx/sfx_bau_pulsando.mp3');
            }

            // Remove previous handler if exists
            if (this.currentPhaseData.chestClickHandler && bauFechado.getAttribute('listener') === 'true') {
                 bauFechado.removeEventListener('click', this.currentPhaseData.chestClickHandler);
            }

            this.currentPhaseData.chestClickHandler = () => this.openTreasureChest();
            bauFechado.addEventListener('click', this.currentPhaseData.chestClickHandler);
            bauFechado.setAttribute('listener', 'true'); // Mark that listener is attached
        }
    }
    
    openTreasureChest() {
        if (this.currentPhaseData.chestOpened) return;
        
        this.currentPhaseData.chestOpened = true;
        
        const bauFechado = document.getElementById('bau-fechado');
        const bauAberto = document.getElementById('bau-aberto');
        const treasureContents = document.getElementById('treasure-contents');

        // Stop pulsing animation
        if (this.game.animationManager && this.currentPhaseData.chestPulseAnimationId) {
            this.game.animationManager.stopAnimation(this.currentPhaseData.chestPulseAnimationId);
            this.currentPhaseData.chestPulseAnimationId = null;
        }

        // Remove click listener
        if (this.currentPhaseData.chestClickHandler && bauFechado) {
            bauFechado.removeEventListener('click', this.currentPhaseData.chestClickHandler);
            bauFechado.removeAttribute('listener');
            this.currentPhaseData.chestClickHandler = null;
        }
        const memoriesSlideshow = document.getElementById('memories-slideshow');
        const heartsAnimation = document.getElementById('hearts-animation');
        
        // Som de abertura
        if (this.game.audioManager) {
            this.game.audioManager.playSFX('assets/sfx/sfx_bau_abrir.mp3');
        }
        
        // Animação de abertura
        if (this.game.animationManager) {
            this.game.animationManager.animateChestOpening(bauFechado, bauAberto);
        }
        
        setTimeout(() => {
            // Revelar conteúdo
            if (treasureContents) {
                treasureContents.classList.remove('hidden');
                if (this.game.audioManager) {
                    this.game.audioManager.playSFX('assets/sfx/sfx_presente_revelado.mp3');
                }
            }
            
            setTimeout(() => {
                // Iniciar slideshow de memórias
                if (memoriesSlideshow) {
                    memoriesSlideshow.classList.remove('hidden');
                    this.startMemoriesSlideshow();
                }
                
                // Iniciar animação de corações
                if (heartsAnimation) {
                    heartsAnimation.classList.remove('hidden');
                    if (this.game.animationManager) {
                        this.game.animationManager.createHeartFloatingAnimation();
                    }
                }
                
                // Trocar música para Careless Whisper
                if (this.game.audioManager) {
                    this.game.audioManager.playCarelessWhisper();
                }
                
                // Mostrar diálogo final
                setTimeout(() => {
                    if (this.game.dialogueManager) {
                        this.game.dialogueManager.showTransitionDialogue('fase_final_complete', () => {
                            this.showCredits();
                        });
                    } else {
                        this.showCredits();
                    }
                }, 5000);
                
            }, 2000);
        }, 1000);
    }
    
    startMemoriesSlideshow() {
        const photos = document.querySelectorAll('.memory-photo');
        if (photos.length === 0) return;
        
        this.currentPhaseData.memoriesStarted = true;
        this.currentPhaseData.currentMemory = 0;
        
        const showNextPhoto = () => {
            const currentPhoto = photos[this.currentPhaseData.currentMemory];
            const nextIndex = (this.currentPhaseData.currentMemory + 1) % photos.length;
            const nextPhoto = photos[nextIndex];
            
            if (this.game.animationManager) {
                this.game.animationManager.animateMemoryTransition(currentPhoto, nextPhoto);
            } else {
                // Fallback simples
                photos.forEach(photo => photo.classList.remove('active'));
                nextPhoto.classList.add('active');
            }
            
            if (this.game.audioManager) {
                this.game.audioManager.playSFX('assets/sfx/sfx_foto_transicao.mp3', 0.5);
            }
            
            this.currentPhaseData.currentMemory = nextIndex;
        };
        
        // Trocar foto a cada 3 segundos
        this.currentPhaseData.memoryInterval = setInterval(showNextPhoto, 3000);
    }
    
    showCredits() {
        if (this.game.audioManager) {
            this.game.audioManager.playSFX('assets/sfx/sfx_creditos_iniciar.mp3');
        }
        
        // Limpar interval das memórias
        if (this.currentPhaseData.memoryInterval) {
            clearInterval(this.currentPhaseData.memoryInterval);
            this.currentPhaseData.memoryInterval = null;
        }
        
        setTimeout(() => {
            this.game.changeScreen('fase-final', 'creditos');
        }, 3000);
    }
    
    // Limpeza geral
    cleanup() {
        // Fase 2 cleanup
        if (this.currentPhaseData.wallaceElements && this.currentPhaseData.wallaceElements.length > 0) {
            this.cleanupPhase2();
        }

        // Fase 3 cleanup
        if (this.currentPhaseData.itemSpawner || this.phase3KeyHandler || this.phase3MouseHandler) {
            this.cleanupPhase3(); // Ensure phase 3 specific cleanup is called
        }
        // Note: cleanupPhase3 already clears itemSpawner, phase3KeyHandler, phase3MouseHandler. Redundant here.
        // Simpler:
        // if (this.game.currentPhase === 'fase3') { // Or check based on currentPhaseData properties
        //     this.cleanupPhase3();
        // }


        // Fase Final cleanup
        if (this.currentPhaseData.memoryInterval) {
            clearInterval(this.currentPhaseData.memoryInterval);
            this.currentPhaseData.memoryInterval = null;
        }
        if (this.game.animationManager && this.currentPhaseData.chestPulseAnimationId) {
            this.game.animationManager.stopAnimation(this.currentPhaseData.chestPulseAnimationId);
            this.currentPhaseData.chestPulseAnimationId = null;
        }
        const bauFechado = document.getElementById('bau-fechado');
        if (this.currentPhaseData.chestClickHandler && bauFechado) {
            bauFechado.removeEventListener('click', this.currentPhaseData.chestClickHandler);
            bauFechado.removeAttribute('listener');
            this.currentPhaseData.chestClickHandler = null;
        }

        // General cleanup for any phase-specific data if needed
        this.currentPhaseData = {}; // Reset current phase data

        // The lines below were too generic and are now handled by specific cleanups or this reset.
        // if (this.currentPhaseData.itemSpawner) { // Handled by cleanupPhase3
        //     clearInterval(this.currentPhaseData.itemSpawner);
        // }
        // if (this.currentPhaseData.memoryInterval) { // Handled by its own block above
        //     clearInterval(this.currentPhaseData.memoryInterval);
        // }
        // if (this.phase3KeyHandler) { // Handled by cleanupPhase3
        //     document.removeEventListener('keydown', this.phase3KeyHandler);
        // }
        // if (this.phase3MouseHandler) { // Handled by cleanupPhase3
        //     document.removeEventListener('mousemove', this.phase3MouseHandler);
        // }
    }
}

