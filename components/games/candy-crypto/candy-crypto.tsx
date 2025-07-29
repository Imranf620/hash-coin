"use client";
import Loading from "@/components/ui/loading";
import { useEffect, useRef, useState } from "react";

const CandyCryptoGame = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const scriptsLoadedRef = useRef(false);
  const gameInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple script loading
    if (scriptsLoadedRef.current) return;

    const loadScript = (src:any) => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve(null);
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script); // Use head instead of body
      });
    };

    const loadCSS = (href:any) => {
      return new Promise((resolve) => {
        // Check if CSS already exists
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) {
          resolve(null);
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = resolve; // Don't fail if CSS can't load
        document.head.appendChild(link);
      });
    };

    async function loadAllScripts() {
      try {
        scriptsLoadedRef.current = true;

        // Load CSS first
        await loadCSS('/games-assets/candy-crypto/style.css');

        // Load scripts in sequence
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.min.js');
        
        // Wait a bit for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await loadScript('/games-assets/candy-crypto/game.js');

        // Wait a bit more before initializing
        await new Promise(resolve => setTimeout(resolve, 200));

        // Initialize game only once
        if (!gameInitializedRef.current && typeof window.initGame === 'function') {
          gameInitializedRef.current = true;
          window.initGame();
        } else if (!window.initGame) {
          console.warn('initGame function not found');
        }
      } catch (error) {
        console.error('Script loading failed:', error);
        scriptsLoadedRef.current = false; // Allow retry
      }finally{
        setLoading(false)
      }
    }

    loadAllScripts();

    // Cleanup function
    return () => {
      // Clean up game if needed
      if (window.cleanupGame && typeof window.cleanupGame  === 'function') {
        window.cleanupGame();
      }
    };
  }, []);

  if(loading) return <Loading/>

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Splash Screen */}
      <div id="splash-screen" className="screen active">
        <div id="splash-3d-container"></div>
        <div className="floating-shapes">
          <div className="floating-shape shape-circle color-red" style={{top: "10%", left: "15%"}}></div>
          <div className="floating-shape shape-square color-blue" style={{top: "20%", right: "20%"}}></div>
          <div className="floating-shape shape-triangle color-green" style={{top: "70%", left: "10%"}}></div>
          <div className="floating-shape shape-circle color-yellow" style={{top: "80%", right: "15%"}}></div>
          <div className="floating-shape shape-square color-purple" style={{top: "15%", left: "80%"}}></div>
        </div>
        <div className="splash-content">
          <div className="title-container">
            <h1 className="splash-title">EIGHT <br />NEIGHBORS</h1>
            <h2 className="splash-subtitle">Fireworks Edition</h2>
          </div>
          <div className="menu-container">
            <button id="start-game-btn" className="btn btn-primary">Start Game</button>
            <button id="settings-btn" className="btn btn-secondary">Settings</button>
          </div>
        </div>
      </div>

      {/* Settings Screen */}
      <div id="settings-screen" className="screen">
        <h1 className="splash-title">Settings</h1>
        <div className="menu-container">
          <div className="setting-item">
            <label htmlFor="rows-setting">Rows</label>
            <select id="rows-setting" defaultValue="11">
              <option value="7">7</option>
              <option value="9">9</option>
              <option value="11">11</option>
              <option value="13">13</option>
              <option value="15">15</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="cols-setting">Columns</label>
            <select id="cols-setting" defaultValue="11">
              <option value="7">7</option>
              <option value="9">9</option>
              <option value="11">11</option>
              <option value="13">13</option>
              <option value="15">15</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="template-setting">Board Shape</label>
            <select id="template-setting" defaultValue="rectangle">
              <option value="rectangle">Rectangle</option>
              <option value="diamond">Diamond</option>
              <option value="cross">Cross</option>
              <option value="circle">Circle</option>
              <option value="random">Random</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="mingroup-setting">Min Group Size</label>
            <select id="mingroup-setting" defaultValue="2">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <button id="back-to-splash-btn" className="btn btn-danger">Back</button>
        </div>
      </div>

      {/* Game Screen */}
      <div id="game-screen" className="screen">
        <div id="container"></div>
        <div id="game-ui">
          <div id="game-menu-btn">☰</div>
          <div className="rotation-controls">
            <button id="rotate-left-btn" className="rotate-btn" title="Rotate Left">↺</button>
            <button id="rotate-right-btn" className="rotate-btn" title="Rotate Right">↻</button>
          </div>
          <div id="game-score">0</div>
        </div>
        <div id="gameOver" className="overlay">
          <h2>Game Over!</h2>
          <p>No more moves available.</p>
          <button id="restartGame" className="btn btn-primary">Play Again</button>
        </div>
        <div id="gameWin" className="overlay">
          <h2>Level Complete!</h2>
          <p>You collected all the prizes!</p>
          <button id="nextLevel" className="btn btn-primary">Next Level</button>
        </div>
      </div>
    </div>
  );
};

export default CandyCryptoGame;