// AnimationManager.js - Sistema de gerenciamento de animações
class AnimationManager {
    constructor() {
        this.activeAnimations = new Map();
        this.animationId = 0;
        
        this.init();
    }
    
    init() {
        this.setupInitialAnimations();
    }
    
    setupInitialAnimations() {
        // Configurar animações da tela inicial
        this.setupSalemBlinking();
        this.setupFloatingAnimations();
        this.setupParticleEffects();
    }
    
    setupSalemBlinking() {
        const salemFloating = document.getElementById('salem-floating');
        if (!salemFloating) return;
        
        let isBlinking = false;
        
        const blink = () => {
            if (isBlinking) return;
            
            isBlinking = true;
            
            // Trocar para sprite piscando
            salemFloating.src = 'assets/imagens/tela_inicio/tela_inicio_salem_piscando_1.png';
            
            setTimeout(() => {
                salemFloating.src = 'assets/imagens/tela_inicio/tela_inicio_salem_piscando_2.png';
                
                // Tocar som de piscar
                if (window.game && window.game.audioManager) {
                    window.game.audioManager.playSFX('assets/sfx/sfx_salem_piscar.mp3', 0.5);
                }
                
                setTimeout(() => {
                    salemFloating.src = 'assets/imagens/tela_inicio/tela_inicio_salem_flutuando.png';
                    isBlinking = false;
                }, 150);
            }, 100);
        };
        
        // Piscar a cada 3-7 segundos aleatoriamente
        const scheduleNextBlink = () => {
            const delay = 3000 + Math.random() * 4000;
            setTimeout(() => {
                blink();
                scheduleNextBlink();
            }, delay);
        };
        
        scheduleNextBlink();
    }
    
    setupFloatingAnimations() {
        // Animações de flutuação já estão no CSS, mas podemos adicionar variações
        this.addFloatingVariation('sarah-floating');
        this.addFloatingVariation('salem-floating');
    }
    
    addFloatingVariation(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Adicionar pequenas variações aleatórias na animação
        const randomDelay = Math.random() * 2;
        const randomDuration = 3.5 + Math.random() * 1;
        
        element.style.animationDelay = `${randomDelay}s`;
        element.style.animationDuration = `${randomDuration}s`;
    }
    
    setupParticleEffects() {
        // Criar sistema de partículas para estrelas cintilantes
        this.createStarParticles();
    }
    
    createStarParticles() {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        
        container.appendChild(particleContainer);
        
        // Criar partículas de estrela
        for (let i = 0; i < 20; i++) {
            this.createStarParticle(particleContainer);
        }
    }
    
    createStarParticle(container) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            opacity: 0;
            box-shadow: 0 0 6px #fff;
        `;
        
        // Posição aleatória
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(star);
        
        // Animação de cintilação
        this.animateStarTwinkle(star);
    }
    
    animateStarTwinkle(star) {
        const twinkle = () => {
            star.style.opacity = '0';
            
            setTimeout(() => {
                star.style.opacity = '1';
                star.style.transform = `scale(${0.5 + Math.random() * 1})`;
                
                setTimeout(() => {
                    star.style.opacity = '0';
                    
                    // Reposicionar aleatoriamente
                    setTimeout(() => {
                        star.style.left = `${Math.random() * 100}%`;
                        star.style.top = `${Math.random() * 100}%`;
                        twinkle();
                    }, 1000 + Math.random() * 2000);
                }, 1000 + Math.random() * 2000);
            }, 500 + Math.random() * 1000);
        };
        
        // Iniciar com delay aleatório
        setTimeout(twinkle, Math.random() * 3000);
    }
    
    startInitialAnimations() {
        // Animação de entrada da tela inicial
        this.fadeInTitle();
        this.animateCharacterEntrance();
    }
    
    fadeInTitle() {
        const title = document.querySelector('.game-title');
        if (!title) return;
        
        title.style.opacity = '0';
        title.style.transform = 'translateY(-50px) scale(0.8)';
        
        setTimeout(() => {
            title.style.transition = 'all 2s ease-out';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0) scale(1)';
        }, 500);
    }
    
    animateCharacterEntrance() {
        const sarah = document.getElementById('sarah-floating');
        const salem = document.getElementById('salem-floating');
        
        if (sarah) {
            sarah.style.opacity = '0';
            sarah.style.transform = 'translateX(-100px)';
            
            setTimeout(() => {
                sarah.style.transition = 'all 1.5s ease-out';
                sarah.style.opacity = '1';
                sarah.style.transform = 'translateX(0)';
            }, 1000);
        }
        
        if (salem) {
            salem.style.opacity = '0';
            salem.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                salem.style.transition = 'all 1.5s ease-out';
                salem.style.opacity = '1';
                salem.style.transform = 'translateX(0)';
            }, 1500);
        }
    }
    
    // Animações para Fase 2 - Wallace Hunt
    animateWallaceFound(wallaceElement) {
        if (!wallaceElement) return;
        
        // Efeito de descoberta
        wallaceElement.style.transition = 'all 0.5s ease-out';
        wallaceElement.style.transform = 'scale(1.3)';
        wallaceElement.style.filter = 'brightness(1.5) drop-shadow(0 0 20px #ffd700)';
        
        // Criar efeito de partículas douradas
        this.createGoldenParticles(wallaceElement);
        
        setTimeout(() => {
            wallaceElement.style.transform = 'scale(1.1)';
            wallaceElement.style.filter = 'brightness(1.2) drop-shadow(0 0 10px #ffd700)';
        }, 500);
    }
    
    createGoldenParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: #ffd700;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 10px #ffd700;
            `;
            
            document.body.appendChild(particle);
            
            // Animar partícula
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Animações para Fase 3 - Canábis Ritual
    animateItemCollection(item, isGood) {
        if (!item) return;
        
        const color = isGood ? '#32cd32' : '#dc143c';
        
        // Efeito de coleta
        item.style.transition = 'all 0.3s ease-out';
        item.style.transform = 'scale(1.5)';
        item.style.filter = `brightness(1.5) drop-shadow(0 0 15px ${color})`;
        
        // Criar efeito de absorção
        this.createAbsorptionEffect(item, color);
        
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.5)';
        }, 300);
    }
    
    createAbsorptionEffect(element, color) {
        const rect = element.getBoundingClientRect();
        const sarah = document.getElementById('sarah-player');
        const sarahRect = sarah ? sarah.getBoundingClientRect() : null;
        
        if (!sarahRect) return;
        
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const endX = sarahRect.left + sarahRect.width / 2;
        const endY = sarahRect.top + sarahRect.height / 2;
        
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${startX}px;
            top: ${startY}px;
            box-shadow: 0 0 10px ${color};
        `;
        
        document.body.appendChild(trail);
        
        trail.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.5)`, opacity: 0.8 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-in-out'
        }).onfinish = () => trail.remove();
    }
    
    animateSarahMovement(direction) {
        const sarah = document.getElementById('sarah-player');
        if (!sarah) return;
        
        // Adicionar efeito de movimento
        sarah.style.transform = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
        
        // Efeito de "passo"
        sarah.style.transition = 'transform 0.1s ease';
        sarah.style.transform += ' translateY(-5px)';
        
        setTimeout(() => {
            sarah.style.transform = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
        }, 100);
    }
    
    // Animações para Fase 4 - Quiz
    animateQuizAnswer(button, isCorrect) {
        if (!button) return;
        
        if (isCorrect) {
            // Efeito de resposta correta
            this.createSuccessEffect(button);
        } else {
            // Efeito de resposta incorreta
            this.createErrorEffect(button);
        }
    }
    
    createSuccessEffect(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: #32cd32;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                box-shadow: 0 0 10px #32cd32;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 30 + Math.random() * 30;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    createErrorEffect(element) {
        // Efeito de tremor
        const originalTransform = element.style.transform;
        
        element.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-3px)' },
            { transform: 'translateX(3px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
    }
    
    // Animações para Fase Final
    animateTreasureChestPulse(chest) {
        if (!chest) return;
        
        const pulseAnimation = chest.animate([
            { transform: 'scale(1)', filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' },
            { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 1))' },
            { transform: 'scale(1)', filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' }
        ], {
            duration: 1500,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        return pulseAnimation;
    }
    
    animateChestOpening(closedChest, openChest) {
        if (!closedChest || !openChest) return;
        
        // Efeito de abertura dramática
        closedChest.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.1)', opacity: 0.8 },
            { transform: 'scale(0.9)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-in-out'
        }).onfinish = () => {
            closedChest.classList.add('hidden');
            openChest.classList.remove('hidden');
            
            // Animar baú aberto aparecendo
            openChest.animate([
                { transform: 'scale(0.9)', opacity: 0 },
                { transform: 'scale(1.1)', opacity: 0.8 },
                { transform: 'scale(1)', opacity: 1 }
            ], {
                duration: 600,
                easing: 'ease-out'
            });
        };
    }
    
    animateMemoryTransition(currentPhoto, nextPhoto) {
        if (!currentPhoto || !nextPhoto) return;
        
        // Fade out atual
        currentPhoto.animate([
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.95)' }
        ], {
            duration: 500,
            easing: 'ease-in-out'
        }).onfinish = () => {
            currentPhoto.classList.remove('active');
            nextPhoto.classList.add('active');
            
            // Fade in próxima
            nextPhoto.animate([
                { opacity: 0, transform: 'scale(1.05)' },
                { opacity: 1, transform: 'scale(1)' }
            ], {
                duration: 500,
                easing: 'ease-in-out'
            });
        };
    }
    
    createHeartFloatingAnimation() {
        const heartsContainer = document.getElementById('hearts-animation');
        if (!heartsContainer) return;
        
        const hearts = heartsContainer.querySelectorAll('.floating-heart');
        
        hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.animate([
                    { opacity: 0, transform: 'translateY(100px) scale(0.5) rotate(0deg)' },
                    { opacity: 1, transform: 'translateY(-50px) scale(1) rotate(180deg)' },
                    { opacity: 0, transform: 'translateY(-200px) scale(0.5) rotate(360deg)' }
                ], {
                    duration: 3000,
                    iterations: Infinity,
                    easing: 'ease-in-out'
                });
            }, index * 1000);
        });
    }
    
    // Transições entre telas
    createScreenTransition(fromScreen, toScreen, type = 'fade') {
        switch (type) {
            case 'fade':
                this.fadeTransition(fromScreen, toScreen);
                break;
            case 'slide':
                this.slideTransition(fromScreen, toScreen);
                break;
            case 'zoom':
                this.zoomTransition(fromScreen, toScreen);
                break;
        }
    }
    
    fadeTransition(fromScreen, toScreen) {
        if (fromScreen) {
            fromScreen.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-in-out'
            }).onfinish = () => {
                fromScreen.style.display = 'none';
                
                if (toScreen) {
                    toScreen.style.display = 'block';
                    toScreen.animate([
                        { opacity: 0 },
                        { opacity: 1 }
                    ], {
                        duration: 500,
                        easing: 'ease-in-out'
                    });
                }
            };
        }
    }
    
    slideTransition(fromScreen, toScreen, direction = 'left') {
        const translateValue = direction === 'left' ? '-100%' : '100%';
        
        if (fromScreen) {
            fromScreen.animate([
                { transform: 'translateX(0)' },
                { transform: `translateX(${translateValue})` }
            ], {
                duration: 600,
                easing: 'ease-in-out'
            }).onfinish = () => {
                fromScreen.style.display = 'none';
                fromScreen.style.transform = 'translateX(0)';
                
                if (toScreen) {
                    toScreen.style.display = 'block';
                    toScreen.style.transform = `translateX(${direction === 'left' ? '100%' : '-100%'})`;
                    
                    toScreen.animate([
                        { transform: `translateX(${direction === 'left' ? '100%' : '-100%'})` },
                        { transform: 'translateX(0)' }
                    ], {
                        duration: 600,
                        easing: 'ease-in-out'
                    });
                }
            };
        }
    }
    
    zoomTransition(fromScreen, toScreen) {
        if (fromScreen) {
            fromScreen.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.8)', opacity: 0 }
            ], {
                duration: 400,
                easing: 'ease-in'
            }).onfinish = () => {
                fromScreen.style.display = 'none';
                fromScreen.style.transform = 'scale(1)';
                
                if (toScreen) {
                    toScreen.style.display = 'block';
                    toScreen.animate([
                        { transform: 'scale(1.2)', opacity: 0 },
                        { transform: 'scale(1)', opacity: 1 }
                    ], {
                        duration: 400,
                        easing: 'ease-out'
                    });
                }
            };
        }
    }
    
    // Limpeza de animações
    stopAnimation(animationId) {
        const animation = this.activeAnimations.get(animationId);
        if (animation) {
            animation.cancel();
            this.activeAnimations.delete(animationId);
        }
    }
    
    stopAllAnimations() {
        this.activeAnimations.forEach(animation => animation.cancel());
        this.activeAnimations.clear();
    }
}

