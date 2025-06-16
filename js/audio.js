// AudioManager.js - Sistema de gerenciamento de áudio
class AudioManager {
    constructor(audioAssets) {
        this.audioAssets = audioAssets;
        this.currentMusic = null;
        this.isMuted = false;
        this.volume = 0.7;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.8;
        this.voiceVolume = 0.9;
        
        this.musicPlayer = document.getElementById('background-music');
        // this.sfxPlayer = document.getElementById('sfx-player'); // HTML element not used for SFX playback
        this.voicePlayer = document.getElementById('voice-player');
        
        this.init();
    }
    
    init() {
        // Configurar volumes iniciais
        if (this.musicPlayer) {
            this.musicPlayer.volume = this.musicVolume * this.volume;
        }
        
        // if (this.sfxPlayer) { // HTML element not used for SFX playback
        //     this.sfxPlayer.volume = this.sfxVolume * this.volume;
        // }
        
        if (this.voicePlayer) {
            this.voicePlayer.volume = this.voiceVolume * this.volume;
        }
        
        // Configurar eventos de erro
        this.setupErrorHandling();
        
        // Iniciar música de intro automaticamente
        this.startIntroMusic();
    }
    
    setupErrorHandling() {
        const handleAudioError = (audio, path) => {
            console.warn(`Erro ao reproduzir áudio: ${path}`);
        };
        
        if (this.musicPlayer) {
            this.musicPlayer.addEventListener('error', () => handleAudioError(this.musicPlayer, 'música de fundo'));
        }
        
        // if (this.sfxPlayer) { // HTML element not used for SFX playback
        //     this.sfxPlayer.addEventListener('error', () => handleAudioError(this.sfxPlayer, 'efeito sonoro'));
        // }
        
        if (this.voicePlayer) {
            this.voicePlayer.addEventListener('error', () => handleAudioError(this.voicePlayer, 'voz'));
        }
    }
    
    playMusic(path, loop = true) {
        if (this.isMuted || !this.musicPlayer) return;
        
        try {
            // Parar música atual se estiver tocando
            this.stopMusic();
            
            this.musicPlayer.src = path;
            this.musicPlayer.loop = loop;
            this.musicPlayer.volume = this.musicVolume * this.volume;
            
            const playPromise = this.musicPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.currentMusic = path;
                    console.log(`Música iniciada: ${path}`);
                }).catch(error => {
                    console.warn(`Erro ao iniciar música: ${error}`);
                });
            }
        } catch (error) {
            console.warn(`Erro ao carregar música: ${error}`);
        }
    }
    
    stopMusic() {
        if (this.musicPlayer) {
            this.musicPlayer.pause();
            this.musicPlayer.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    changeMusic(newPath, fadeTime = 1000) {
        if (this.currentMusic === newPath) return;
        
        if (this.musicPlayer && this.currentMusic) {
            // Fade out da música atual
            this.fadeOut(this.musicPlayer, fadeTime / 2, () => {
                // Fade in da nova música
                this.playMusic(newPath);
                this.fadeIn(this.musicPlayer, fadeTime / 2);
            });
        } else {
            this.playMusic(newPath);
        }
    }
    
    playSFX(path, volume = 1.0) {
        if (this.isMuted) return;

        try {
            let sfx;
            const preloadedAsset = this.audioAssets.get(path);

            if (preloadedAsset) {
                sfx = preloadedAsset.cloneNode(); // Clone the preloaded Audio object
            } else {
                // Fallback if not found in preloaded assets (should not happen if preloading is comprehensive)
                console.warn(`SFX not found in preloaded assets: ${path}. Playing directly.`);
                sfx = new Audio(path);
            }

            sfx.volume = (this.sfxVolume * this.volume * volume);
            
            const playPromise = sfx.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // console.log(`SFX reproduzido: ${path}`);
                }).catch(error => {
                    console.warn(`Erro ao reproduzir SFX: ${path} - ${error}`);
                });
            }
            
            // Cloned Audio objects are not in the DOM, so sfx.remove() is not applicable.
            // They will be garbage collected when no longer referenced after 'ended'.
            sfx.addEventListener('ended', () => {
                // Optional: sfx = null; or other cleanup if managing a pool.
            });
            
        } catch (error) {
            console.warn(`Erro ao carregar SFX: ${path} - ${error}`);
        }
    }
    
    playVoice(path, onEnd = null) {
        if (this.isMuted || !this.voicePlayer) {
            if (onEnd) onEnd();
            return;
        }
        
        try {
            this.voicePlayer.src = path;
            this.voicePlayer.volume = this.voiceVolume * this.volume;
            
            // Configurar callback de fim
            const handleEnd = () => {
                this.voicePlayer.removeEventListener('ended', handleEnd);
                if (onEnd) onEnd();
            };
            
            this.voicePlayer.addEventListener('ended', handleEnd);
            
            const playPromise = this.voicePlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log(`Voz reproduzida: ${path}`);
                }).catch(error => {
                    console.warn(`Erro ao reproduzir voz: ${error}`);
                    if (onEnd) onEnd();
                });
            }
            
        } catch (error) {
            console.warn(`Erro ao carregar voz: ${error}`);
            if (onEnd) onEnd();
        }
    }
    
    stopVoice() {
        if (this.voicePlayer) {
            this.voicePlayer.pause();
            this.voicePlayer.currentTime = 0;
        }
    }
    
    fadeOut(audioElement, duration, callback = null) {
        if (!audioElement) return;
        
        const startVolume = audioElement.volume;
        const fadeStep = startVolume / (duration / 50);
        
        const fade = setInterval(() => {
            if (audioElement.volume > fadeStep) {
                audioElement.volume -= fadeStep;
            } else {
                audioElement.volume = 0;
                clearInterval(fade);
                if (callback) callback();
            }
        }, 50);
    }
    
    fadeIn(audioElement, duration) {
        if (!audioElement) return;
        
        const targetVolume = this.musicVolume * this.volume;
        const fadeStep = targetVolume / (duration / 50);
        
        audioElement.volume = 0;
        
        const fade = setInterval(() => {
            if (audioElement.volume < targetVolume - fadeStep) {
                audioElement.volume += fadeStep;
            } else {
                audioElement.volume = targetVolume;
                clearInterval(fade);
            }
        }, 50);
    }
    
    setVolume(newVolume) {
        this.volume = Math.max(0, Math.min(1, newVolume));
        
        if (this.musicPlayer) {
            this.musicPlayer.volume = this.musicVolume * this.volume;
        }
        
        // if (this.sfxPlayer) { // HTML element not used for SFX playback
        //     this.sfxPlayer.volume = this.sfxVolume * this.volume;
        // }
        
        if (this.voicePlayer) {
            this.voicePlayer.volume = this.voiceVolume * this.volume;
        }
    }
    
    setMusicVolume(newVolume) {
        this.musicVolume = Math.max(0, Math.min(1, newVolume));
        
        if (this.musicPlayer) {
            this.musicPlayer.volume = this.musicVolume * this.volume;
        }
    }
    
    setSFXVolume(newVolume) {
        this.sfxVolume = Math.max(0, Math.min(1, newVolume));
    }
    
    setVoiceVolume(newVolume) {
        this.voiceVolume = Math.max(0, Math.min(1, newVolume));
        
        if (this.voicePlayer) {
            this.voicePlayer.volume = this.voiceVolume * this.volume;
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            // Mutar todos os áudios
            if (this.musicPlayer) this.musicPlayer.volume = 0;
            // if (this.sfxPlayer) this.sfxPlayer.volume = 0; // HTML element not used for SFX playback
            if (this.voicePlayer) this.voicePlayer.volume = 0;
        } else {
            // Restaurar volumes
            if (this.musicPlayer) this.musicPlayer.volume = this.musicVolume * this.volume;
            // if (this.sfxPlayer) this.sfxPlayer.volume = this.sfxVolume * this.volume; // HTML element not used for SFX playback
            if (this.voicePlayer) this.voicePlayer.volume = this.voiceVolume * this.volume;
        }
        
        console.log(`Áudio ${this.isMuted ? 'mutado' : 'desmutado'}`);
    }
    
    pauseAll() {
        if (this.musicPlayer) this.musicPlayer.pause();
        if (this.voicePlayer) this.voicePlayer.pause();
    }
    
    resumeAll() {
        if (this.musicPlayer && this.currentMusic) {
            this.musicPlayer.play().catch(error => {
                console.warn(`Erro ao retomar música: ${error}`);
            });
        }
    }
    
    // Método para criar playlist de músicas ambiente
    createAmbientPlaylist(tracks, shuffle = false) {
        if (shuffle) {
            tracks = this.shuffleArray([...tracks]);
        }
        
        let currentTrack = 0;
        
        const playNext = () => {
            if (currentTrack < tracks.length) {
                this.playMusic(tracks[currentTrack], false);
                
                if (this.musicPlayer) {
                    this.musicPlayer.addEventListener('ended', () => {
                        currentTrack++;
                        if (currentTrack >= tracks.length) {
                            currentTrack = 0; // Reiniciar playlist
                        }
                        playNext();
                    }, { once: true });
                }
            }
        };
        
        playNext();
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Método para sincronizar áudio com texto
    syncAudioWithText(audioPath, text, textElement, typewriterSpeed = 50) {
        return new Promise((resolve) => {
            let charIndex = 0;
            
            // Iniciar reprodução de voz
            this.playVoice(audioPath, resolve);
            
            // Efeito de máquina de escrever
            const typewriter = setInterval(() => {
                if (charIndex < text.length) {
                    textElement.textContent = text.substring(0, charIndex + 1);
                    charIndex++;
                    
                    // Tocar som de digitação ocasionalmente
                    if (charIndex % 3 === 0) {
                        this.playSFX('assets/sfx/sfx_texto_avancar.mp3', 0.3);
                    }
                } else {
                    clearInterval(typewriter);
                }
            }, typewriterSpeed);
        });
    }
    
    // Método para criar efeitos sonoros espaciais
    createSpatialSFX(path, x, y, maxDistance = 1000) {
        const listener = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const distance = Math.sqrt(Math.pow(x - listener.x, 2) + Math.pow(y - listener.y, 2));
        const volume = Math.max(0, 1 - (distance / maxDistance));
        
        this.playSFX(path, volume);
    }
    
    // Métodos específicos para cada fase
    startIntroMusic() {
        this.playMusic('assets/musica/music_intro_ambiente.mp3', true);
    }
    
    startPhase1Music() {
        this.playMusic('assets/musica/music_fase1_ambiente.mp3', true);
    }
    
    startPhase2Music() {
        this.playMusic('assets/musica/music_fase2_ambiente.mp3', true);
    }
    
    startPhase3Music() {
        this.playMusic('assets/musica/music_fase3_gameplay.mp3', true);
    }
    
    startPhase4Music() {
        this.playMusic('assets/musica/music_fase4_quiz.mp3', true);
    }
    
    startFinalPhaseMusic() {
        this.playMusic('assets/musica/music_fase_final_ambiente.mp3', true);
    }
    
    playCarelessWhisper() {
        this.playMusic('assets/musica/music_careless_whisper_chiptune.mp3', false);
    }
}

