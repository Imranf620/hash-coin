
    // --- SCREEN MANAGEMENT ---
    const screens = document.querySelectorAll('.screen');
    const gameOverOverlay = document.getElementById('gameOver');
    const gameWinOverlay = document.getElementById('gameWin');

    function showScreen(screenId) {
      screens.forEach(screen => screen.classList.remove('active'));
      const activeScreen = document.getElementById(screenId);
      if (activeScreen) activeScreen.classList.add('active');
      
      // Handle splash screen 3D scene
      if (screenId === 'splash-screen' && window.splashScene) {
        window.splashScene.startAnimation();
      } else if (window.splashScene) {
        window.splashScene.stopAnimation();
      }
    }

    function showOverlay(overlayElement) {
        overlayElement.classList.add('visible');
    }

    function hideOverlay(overlayElement) {
        overlayElement.classList.remove('visible');
    }

    // --- SPLASH SCREEN 3D SCENE ---
    class SplashScene {
      constructor() {
        this.container = document.getElementById('splash-3d-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true // Enable transparency
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 8;
        this.shapes = [];
        this.isAnimating = false;
        
        // Shape atlas from the game
        this.shapeAtlas = [
          { name: 'Sphere', color: 0xff4444, geometryFactory: s => new THREE.SphereGeometry(s, 16, 12) },
          { name: 'Cube', color: 0x44ff44, geometryFactory: s => new THREE.BoxGeometry(s, s, s) },
          { name: 'Tetra', color: 0x4488ff, geometryFactory: s => new THREE.TetrahedronGeometry(s) },
          { name: 'Octa', color: 0xffff44, geometryFactory: s => new THREE.OctahedronGeometry(s) },
          { name: 'Icosa', color: 0xff44ff, geometryFactory: s => new THREE.IcosahedronGeometry(s) },
          { name: 'Dodeca', color: 0x44ffff, geometryFactory: s => new THREE.DodecahedronGeometry(s) }
        ];
        
        this.setupLighting();
        this.createFloatingShapes();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
      }
      
      setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const directionalLight2 = new THREE.DirectionalLight(0x6b46c1, 0.4);
        directionalLight2.position.set(-5, -5, 3);
        this.scene.add(directionalLight2);
      }
      
      createFloatingShapes() {
        const positions = [
          { x: -6, y: 3, z: -2 },
          { x: 6, y: -2, z: -1 },
          { x: -4, y: -3, z: 1 },
          { x: 4, y: 4, z: 0 },
          { x: -2, y: 1, z: -3 },
          { x: 2, y: -4, z: 2 },
          { x: 7, y: 1, z: -2 },
          { x: -7, y: -1, z: 1 },
          { x: 0, y: 5, z: -1 },
          { x: -1, y: -5, z: 0 },
          { x: 5, y: 3, z: 1 },
          { x: -5, y: 2, z: -1 }
        ];
        
        positions.forEach((pos, i) => {
          const shapeData = this.shapeAtlas[i % this.shapeAtlas.length];
          const size = 0.4 + Math.random() * 0.3;
          
          const geometry = shapeData.geometryFactory(size);
          const material = new THREE.MeshPhongMaterial({
            color: shapeData.color,
            shininess: 60,
            specular: 0x444444,
            transparent: true,
            opacity: 0.8
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(pos.x, pos.y, pos.z);
          
          // Random initial rotation
          mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          );
          
          // Animation properties
          mesh.userData = {
            originalPosition: { ...pos },
            floatSpeed: 0.5 + Math.random() * 1.5,
            rotationSpeed: {
              x: (Math.random() - 0.5) * 0.02,
              y: (Math.random() - 0.5) * 0.02,
              z: (Math.random() - 0.5) * 0.02
            },
            floatOffset: Math.random() * Math.PI * 2
          };
          
          this.shapes.push(mesh);
          this.scene.add(mesh);
          
          // Pop-in animation
          mesh.scale.set(0.01, 0.01, 0.01);
          new TWEEN.Tween(mesh.scale)
            .to({ x: 1, y: 1, z: 1 }, 800)
            .easing(TWEEN.Easing.Elastic.Out)
            .delay(i * 100)
            .start();
        });
      }
      
      startAnimation() {
        this.isAnimating = true;
        this.animate();
      }
      
      stopAnimation() {
        this.isAnimating = false;
      }
      
      animate() {
        if (!this.isAnimating) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        TWEEN.update();
        
        const time = Date.now() * 0.001;
        
        this.shapes.forEach(shape => {
          const userData = shape.userData;
          
          // Floating animation
          shape.position.y = userData.originalPosition.y + 
            Math.sin(time * userData.floatSpeed + userData.floatOffset) * 0.5;
          shape.position.x = userData.originalPosition.x + 
            Math.cos(time * userData.floatSpeed * 0.7 + userData.floatOffset) * 0.2;
          
          // Rotation animation
          shape.rotation.x += userData.rotationSpeed.x;
          shape.rotation.y += userData.rotationSpeed.y;
          shape.rotation.z += userData.rotationSpeed.z;
        });
        
        this.renderer.render(this.scene, this.camera);
      }
      
      onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }

    // --- GLOBAL UI EVENT LISTENERS ---
   window.initGame = function () {
      // Initialize splash scene
      window.splashScene = new SplashScene();
      window.splashScene.startAnimation();
      
      const game = new BubblePopper();
      game.animate();

      console.log('start')
      document.getElementById('start-game-btn').addEventListener('click', () => {
        console.log('hyy')
        showScreen('game-screen');
        game.createNewBoard();
      });
      document.getElementById('settings-btn').addEventListener('click', () => showScreen('settings-screen'));
      document.getElementById('back-to-splash-btn').addEventListener('click', () => showScreen('splash-screen'));
      document.getElementById('game-menu-btn').addEventListener('click', () => {
        game.pauseGame(true);
        showScreen('splash-screen');
      });
      document.getElementById('restartGame').addEventListener('click', () => {
        hideOverlay(gameOverOverlay);
        game.createNewBoard();
      });
      document.getElementById('nextLevel').addEventListener('click', () => {
        hideOverlay(gameWinOverlay);
        game.createNewBoard();
      });
      
      document.getElementById('rotate-left-btn').addEventListener('click', () => {
        game.rotateBoard('left');
      });
      
      document.getElementById('rotate-right-btn').addEventListener('click', () => {
        game.rotateBoard('right');
      });
    }

    // --- TUBE CONNECTION CLASS ---
    class TubeConnection {
      constructor(start, end, scene) {
        this.startShape = start;
        this.endShape = end;
        this.scene = scene;
        this.create();
      }
      create() {
        const startPos = this.startShape.mesh.position;
        const endPos = this.endShape.mesh.position;
        const distance = startPos.distanceTo(endPos);
        const tubeRadius = this.startShape.size * 0.15;
        const geometry = new THREE.CylinderGeometry(tubeRadius, tubeRadius, distance, 8, 1, false);
        const material = new THREE.MeshPhongMaterial({
          color: this.startShape.color,
          transparent: true,
          opacity: 0.7,
          shininess: 80,
          emissive: this.startShape.color,
          emissiveIntensity: 0.4
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.lerpVectors(startPos, endPos, 0.5);
        const direction = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        this.mesh.setRotationFromQuaternion(quaternion);
        this.scene.add(this.mesh);
      }
      remove() {
        if (this.mesh) {
          this.scene.remove(this.mesh);
          this.mesh.geometry.dispose();
          this.mesh.material.dispose();
          this.mesh = null;
        }
      }
    }

    // --- SHAPE CLASS ---
    class Shape {
      constructor(x, y, z, size, shapeData, row, col) {
        this.geometry = shapeData.geometryFactory(size * 0.8);
        this.material = new THREE.MeshPhongMaterial({
          color: shapeData.color,
          shininess: 30,
          specular: 0x444444
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
        if (shapeData.name !== 'Sphere') {
          this.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        }
        this.shapeType = shapeData.name;
        this.color = shapeData.color;
        this.row = row;
        this.col = col;
        this.size = size;
        this.originalScale = { x: 1, y: 1, z: 1 };
      }
      popIn(delay = 0) {
        this.mesh.scale.set(0.01, 0.01, 0.01);
        new TWEEN.Tween(this.mesh.scale).to({ x: 1, y: 1, z: 1 }, 500)
          .easing(TWEEN.Easing.Elastic.Out).delay(delay).start();
      }
      
      // New fireworks-style explosion with grow then pop
      explode(delay = 0, onComplete) {
        // First stage: Grow dramatically
        const growTween = new TWEEN.Tween(this.mesh.scale)
          .to({ x: 1.5, y: 1.5, z: 1.5 }, 200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .delay(delay);
        
        // Second stage: Pop out cleanly
        const popTween = new TWEEN.Tween(this.mesh.scale)
          .to({ x: 0.01, y: 0.01, z: 0.01 }, 300)
          .easing(TWEEN.Easing.Back.In)
          .onComplete(() => {
            if (onComplete) onComplete();
          });
        
        // Chain the animations: grow then pop
        growTween.chain(popTween);
        growTween.start();
      }
      
      popOut(onComplete) {
        new TWEEN.Tween(this.mesh.scale).to({ x: 0.01, y: 0.01, z: 0.01 }, 300)
          .easing(TWEEN.Easing.Back.In).onComplete(() => {
            if (onComplete) onComplete();
          }).start();
      }
      dispose() {
        this.geometry.dispose();
        this.material.dispose();
      }
    }

    // --- PRIZE CLASS ---
    class Prize {
      constructor(x, y, z, size) {
        this.geometry = new THREE.TorusGeometry(size, size / 4, 8, 50);
        this.material = new THREE.MeshPhongMaterial({
          color: 0xffd700,
          shininess: 100,
          specular: 0xffffff
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
      }
      collect() {
          const flyUp = new TWEEN.Tween(this.mesh.position)
              .to({ z: this.mesh.position.z + 5 }, 500)
              .easing(TWEEN.Easing.Circular.In);
          
          new TWEEN.Tween(this.mesh.scale)
              .to({ x: 0.01, y: 0.01, z: 0.01 }, 500)
              .onComplete(() => this.dispose())
              .chain(flyUp)
              .start();
      }
      rotate() {
        this.mesh.rotation.y += 0.02;
        this.mesh.rotation.x += 0.01;
      }
      dispose() {
        if(this.mesh.parent) this.mesh.parent.remove(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
      }
    }

    // --- MAIN GAME CLASS ---
    class BubblePopper {
      constructor() {
        this.init();
      }
      init() {
        this.container = document.getElementById('container');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000033);
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        this.raycaster = new THREE.Raycaster();
        this.pointerPos = new THREE.Vector2();
        this.hoveredShape = null;
        this.tubeConnections = [];
        this.shapes = [];
        this.prizes = [];
        
        this.shapeAtlas = [
          { name: 'Sphere', color: 0xff0000, geometryFactory: s => new THREE.SphereGeometry(s * 1.1, 20, 16) },
          { name: 'Cube', color: 0x00ff00, geometryFactory: s => new THREE.BoxGeometry(s * 1.5, s * 1.5, s * 1.5) },
          { name: 'Tetra', color: 0x0080ff, geometryFactory: s => new THREE.TetrahedronGeometry(s * 1.4) },
          { name: 'Octa', color: 0xffff00, geometryFactory: s => new THREE.OctahedronGeometry(s * 1.5) },
          { name: 'Icosa', color: 0xff00ff, geometryFactory: s => new THREE.IcosahedronGeometry(s * 1.25) },
          { name: 'Dodeca', color: 0xffffff, geometryFactory: s => new THREE.DodecahedronGeometry(s * 1.1, 0) }
        ];

        this.isAnimating = false;
        this.gamePaused = false;
        
        this.scoreElement = document.getElementById('game-score');
        this.gameOverElement = document.getElementById('gameOver');
        this.gameWinElement = document.getElementById('gameWin');
        this.rotateLeftBtn = document.getElementById('rotate-left-btn');
        this.rotateRightBtn = document.getElementById('rotate-right-btn');

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
        
        this.defineBoardTemplates();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.container.addEventListener('mousedown', this.onPointerDown.bind(this));
        this.container.addEventListener('mousemove', this.onPointerMove.bind(this));
        this.container.addEventListener('touchstart', this.onPointerDown.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.onPointerMove.bind(this), { passive: false });
      }

      defineBoardTemplates() {
        this.boardTemplates = {
          rectangle: (r, c) => Array(r).fill().map(() => Array(c).fill(true)),
          diamond: (r, c) => {
            const layout = Array(r).fill().map(() => Array(c).fill(false));
            const midR = Math.floor(r / 2), midC = Math.floor(c / 2);
            const maxDist = Math.min(midR, midC);
            for (let i = 0; i < r; i++) for (let j = 0; j < c; j++)
                if (Math.abs(i - midR) + Math.abs(j - midC) <= maxDist) layout[i][j] = true;
            return layout;
          },
          cross: (r, c) => {
            const layout = Array(r).fill().map(() => Array(c).fill(false));
            const midR = Math.floor(r / 2), midC = Math.floor(c / 2);
            const arm = Math.max(1, Math.floor(Math.min(r, c) / 5));
            for (let i = 0; i < r; i++) for (let j = 0; j < c; j++)
                if (Math.abs(i - midR) <= arm || Math.abs(j - midC) <= arm) layout[i][j] = true;
            return layout;
          },
          circle: (r, c) => {
            const layout = Array(r).fill().map(() => Array(c).fill(false));
            const cR = (r - 1) / 2, cC = (c - 1) / 2;
            const radius = Math.min(r, c) / 2 - 0.5;
            for (let i = 0; i < r; i++) for (let j = 0; j < c; j++)
                if (Math.sqrt((i - cR) ** 2 + (j - cC) ** 2) <= radius) layout[i][j] = true;
            return layout;
          },
          random: (r, c) => Array(r).fill().map(() => Array(c).fill(false)).map(row => row.map(() => Math.random() > 0.4))
        };
      }
      
      // --- Unified Input Handlers ---
      getPointerCoordinates(e) {
          const eventX = e.touches ? e.touches[0].clientX : e.clientX;
          const eventY = e.touches ? e.touches[0].clientY : e.clientY;
          this.pointerPos.x = (eventX / window.innerWidth) * 2 - 1;
          this.pointerPos.y = -(eventY / window.innerHeight) * 2 + 1;
      }
      onPointerMove(e) {
        if (this.isAnimating || this.gamePaused) return;
        this.getPointerCoordinates(e);
        this.raycaster.setFromCamera(this.pointerPos, this.camera);
        
        // Only check shape meshes, not prizes
        const shapeMeshes = [];
        for (let i = 0; i < this.shapes.length; i++) {
          for (let j = 0; j < this.shapes[i].length; j++) {
            if (this.shapes[i]?.[j]?.mesh) {
              shapeMeshes.push(this.shapes[i][j].mesh);
            }
          }
        }
        
        const intersects = this.raycaster.intersectObjects(shapeMeshes);
        let newHoveredShape = null;
        if (intersects.length > 0) {
          const obj = intersects[0].object;
          for (let i = 0; i < this.shapes.length; i++) for (let j = 0; j < this.shapes[i].length; j++) {
            if (this.shapes[i]?.[j]?.mesh === obj) {
              newHoveredShape = this.shapes[i][j];
              break;
            }
          }
        }
        if (newHoveredShape !== this.hoveredShape) {
          this.clearTubeConnections();
          if (newHoveredShape) {
            this.hoveredShape = newHoveredShape;
            this.highlightConnectedGroup(newHoveredShape);
          } else {
            this.hoveredShape = null;
          }
        }
      }
      onPointerDown(e) {
        if (e.type === 'touchstart') e.preventDefault();
        if (this.isAnimating || this.gamePaused) return;
        this.getPointerCoordinates(e);
        this.raycaster.setFromCamera(this.pointerPos, this.camera);
        
        // Only check shape meshes, not prizes
        const shapeMeshes = [];
        for (let i = 0; i < this.shapes.length; i++) {
          for (let j = 0; j < this.shapes[i].length; j++) {
            if (this.shapes[i]?.[j]?.mesh) {
              shapeMeshes.push(this.shapes[i][j].mesh);
            }
          }
        }
        
        const intersects = this.raycaster.intersectObjects(shapeMeshes);
        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
          for (let i = 0; i < this.shapes.length; i++) for (let j = 0; j < this.shapes[i].length; j++) {
            if (this.shapes[i]?.[j]?.mesh === clickedObject) {
              this.clearTubeConnections();
              this.processShapeClick(i, j);
              return;
            }
          }
        }
      }
      onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.positionBoardElements();
        
        // Update splash scene if it exists
        if (window.splashScene) {
          window.splashScene.onWindowResize();
        }
      }

      // --- Board Setup and Management ---
      positionBoardElements() {
        if (this.shapes.length === 0 && this.prizes.length === 0) return;
        this.spacing = 1.1;
        this.pieceSize = this.spacing * 0.5;
        const boardWidth = this.columns * this.spacing;
        const boardHeight = this.rows * this.spacing;
        const fovInRadians = THREE.MathUtils.degToRad(this.camera.fov);
        const distH = (boardHeight / 2) / Math.tan(fovInRadians / 2);
        const distW = (boardWidth / 2) / (Math.tan(fovInRadians / 2) * this.camera.aspect);
        this.camera.position.z = Math.max(distH, distW) * 1.15;
        this.camera.lookAt(0, 0, 0);

        const offsetX = -((this.columns - 1) * this.spacing) / 2;
        const offsetY = ((this.rows - 1) * this.spacing) / 2;
        
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.columns; j++) {
            if (this.shapes[i]?.[j]) {
                this.shapes[i][j].mesh.position.x = offsetX + j * this.spacing;
                this.shapes[i][j].mesh.position.y = offsetY - i * this.spacing;
            }
        }
        this.prizes.forEach(p => {
            if (p.prizeObj) {
                p.prizeObj.mesh.position.x = offsetX + p.col * this.spacing;
                p.prizeObj.mesh.position.y = offsetY - p.row * this.spacing;
            }
        });
      }
      clearBoard(fullClear = true) {
        this.clearTubeConnections();
        const toRemove = [];
        this.scene.traverse(o => {
          if (o.type === 'Mesh' || o.type === 'Sprite') toRemove.push(o);
        });
        toRemove.forEach(o => {
            if (o === this.scene.background || !o.parent) return;
            o.parent.remove(o);
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
                else o.material.dispose();
            }
        });
        this.shapes = [];
        this.prizes = [];
        if(fullClear) TWEEN.removeAll();
      }
      createNewBoard() {
        this.clearBoard();
        this.score = 0;
        this.updateScore();
        this.pauseGame(false);
        this.isAnimating = true;
        this.setRotationButtonsEnabled(false);

        this.rows = parseInt(document.getElementById('rows-setting').value);
        this.columns = parseInt(document.getElementById('cols-setting').value);
        this.boardTemplate = document.getElementById('template-setting').value;
        this.minGroupSize = parseInt(document.getElementById('mingroup-setting').value);
        
        let attempts = 0;
        do {
            this.generateBoardState();
            attempts++;
        } while (!this.hasValidMoves() && attempts < 50);

        if (attempts >= 50) console.error("Failed to generate a valid board.");

        this.positionBoardElements();
        this.animateShapesIn();
      }
      generateBoardState() {
        this.clearBoard(false);
        this.boardLayout = this.boardTemplates[this.boardTemplate](this.rows, this.columns);
        this.shapes = Array(this.rows).fill().map(() => Array(this.columns).fill(null));

        const offsetX = -((this.columns - 1) * 1.1) / 2;
        const offsetY = ((this.rows - 1) * 1.1) / 2;
        const activeCells = [];
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.columns; j++) {
            if (this.boardLayout[i][j]) activeCells.push({ row: i, col: j });
        }
        this.prizes = [];
        const prizesCount = Math.min(Math.floor(activeCells.length / 5), 10);
        activeCells.sort(() => 0.5 - Math.random());
        for (let p = 0; p < Math.min(prizesCount, activeCells.length); p++) {
            this.prizes.push({ ...activeCells[p], collected: false });
        }
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.columns; j++) {
            if (!this.boardLayout[i][j]) continue;
            const shapeData = this.shapeAtlas[Math.floor(Math.random() * this.shapeAtlas.length)];
            const x = offsetX + j * 1.1;
            const y = offsetY - i * 1.1;
            const shape = new Shape(x, y, 0, 0.55, shapeData, i, j);
            this.shapes[i][j] = shape;
            this.scene.add(shape.mesh);
            const prizeData = this.prizes.find(p => p.row === i && p.col === j);
            if (prizeData) {
              const prize = new Prize(x, y, 0.1, 0.55 * 1.2);
              this.scene.add(prize.mesh);
              prizeData.prizeObj = prize;
            }
        }
      }
      animateShapesIn() {
          let maxDelay = 0;
          for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.columns; j++) {
              if (this.shapes[i]?.[j]) {
                  const delay = (i + j) * 20;
                  this.shapes[i][j].popIn(delay);
                  if (delay > maxDelay) maxDelay = delay;
              }
          }
          setTimeout(() => { 
            this.isAnimating = false;
            this.setRotationButtonsEnabled(true);
          }, maxDelay + 500);
      }
      
      // --- Board Rotation ---
      rotateBoard(direction) {
        if (this.isAnimating || this.gamePaused) return;
        
        this.isAnimating = true;
        this.clearTubeConnections();
        this.setRotationButtonsEnabled(false);
        
        // Store rotation direction for animation
        this.lastRotationDirection = direction;
        
        // First animate the visual rotation, then update data structures
        this.animateVisualRotation(() => {
          // After visual rotation completes, update the logical board structure
          const rotatedLayout = this.rotateArray2D(this.boardLayout, direction);
          const rotatedShapes = this.rotateArray2D(this.shapes, direction);
          
          // Store old dimensions
          const oldRows = this.rows;
          const oldCols = this.columns;
          
          // Update dimensions (they swap during rotation)
          this.rows = oldCols;
          this.columns = oldRows;
          
          // Update board layout and shapes
          this.boardLayout = rotatedLayout;
          this.shapes = rotatedShapes;
          
          // Update row/col properties for all shapes and rotate prizes
          this.updateShapePositions(direction);
          this.rotatePrizes(direction, oldRows, oldCols);
          
          // Snap pieces to proper grid positions
          this.positionBoardElements();
          
          // Apply gravity after a brief pause
          setTimeout(() => this.applyGravity(), 200);
        });
      }
      
      rotateArray2D(array, direction) {
        const rows = array.length;
        const cols = array[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(null));
        
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (direction === 'right') {
              // Clockwise: new[j][rows-1-i] = old[i][j]
              rotated[j][rows - 1 - i] = array[i][j];
            } else {
              // Counter-clockwise: new[cols-1-j][i] = old[i][j]
              rotated[cols - 1 - j][i] = array[i][j];
            }
          }
        }
        return rotated;
      }
      
      updateShapePositions(direction) {
        // Update row/col properties for all shapes after rotation
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            const shape = this.shapes[i]?.[j];
            if (shape) {
              shape.row = i;
              shape.col = j;
            }
          }
        }
      }
      
      rotatePrizes(direction, oldRows, oldCols) {
        // Update prize positions after board rotation
        this.prizes.forEach(prize => {
          const oldRow = prize.row;
          const oldCol = prize.col;
          
          if (direction === 'right') {
            prize.row = oldCol;
            prize.col = oldRows - 1 - oldRow;
          } else {
            prize.row = oldCols - 1 - oldCol;
            prize.col = oldRow;
          }
        });
      }
      
      animateVisualRotation(onComplete) {
        let animationsPending = 0;
        const animationDuration = 800;
        
        // Calculate board center for rotation
        const boardCenterX = 0; // Board is already centered at origin
        const boardCenterY = 0;
        
        const onAnimationComplete = () => {
          if (--animationsPending === 0) {
            if (onComplete) onComplete();
          }
        };
        
        // Animate all shapes rotating around board center
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            const shape = this.shapes[i]?.[j];
            if (shape) {
              const currentPos = shape.mesh.position;
              
              // Calculate the rotated position around board center
              const relativeX = currentPos.x - boardCenterX;
              const relativeY = currentPos.y - boardCenterY;
              
              let newRelativeX, newRelativeY;
              if (this.lastRotationDirection === 'right') {
                // 90° clockwise: (x,y) -> (y,-x)
                newRelativeX = relativeY;
                newRelativeY = -relativeX;
              } else {
                // 90° counter-clockwise: (x,y) -> (-y,x)
                newRelativeX = -relativeY;
                newRelativeY = relativeX;
              }
              
              const finalX = boardCenterX + newRelativeX;
              const finalY = boardCenterY + newRelativeY;
              
              animationsPending++;
              new TWEEN.Tween(shape.mesh.position)
                .to({ x: finalX, y: finalY }, animationDuration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(onAnimationComplete)
                .start();
            }
          }
        }
        
        // Animate prizes rotating around board center
        this.prizes.forEach(prize => {
          if (prize.prizeObj) {
            const currentPos = prize.prizeObj.mesh.position;
            
            // Calculate the rotated position around board center
            const relativeX = currentPos.x - boardCenterX;
            const relativeY = currentPos.y - boardCenterY;
            
            let newRelativeX, newRelativeY;
            if (this.lastRotationDirection === 'right') {
              // 90° clockwise: (x,y) -> (y,-x)
              newRelativeX = relativeY;
              newRelativeY = -relativeX;
            } else {
              // 90° counter-clockwise: (x,y) -> (-y,x)
              newRelativeX = -relativeY;
              newRelativeY = relativeX;
            }
            
            const finalX = boardCenterX + newRelativeX;
            const finalY = boardCenterY + newRelativeY;
            
            animationsPending++;
            new TWEEN.Tween(prize.prizeObj.mesh.position)
              .to({ x: finalX, y: finalY }, animationDuration)
              .easing(TWEEN.Easing.Quadratic.InOut)
              .onComplete(onAnimationComplete)
              .start();
          }
        });
        
        if (animationsPending === 0) {
          if (onComplete) onComplete();
        }
      }
      
      setRotationButtonsEnabled(enabled) {
        this.rotateLeftBtn.disabled = !enabled;
        this.rotateRightBtn.disabled = !enabled;
      }
      
      // --- Gameplay Logic ---
      processShapeClick(row, col) {
        const shape = this.shapes[row]?.[col];
        if (!shape) return;
        const connected = this.findConnectedShapes(row, col, shape.shapeType);
        if (connected.length < this.minGroupSize) return;
        
        this.isAnimating = true;
        this.setRotationButtonsEnabled(false);
        
        // Calculate distance from clicked piece for fireworks timing
        const clickedRow = row;
        const clickedCol = col;
        const explosionWaves = this.groupShapesByDistance(connected, clickedRow, clickedCol);
        
        this.triggerFireworksExplosion(explosionWaves, connected);
      }
      
      // Group shapes by their distance from the clicked shape for wave-based explosions
      groupShapesByDistance(connected, clickedRow, clickedCol) {
        const waves = {};
        connected.forEach(({ row, col }) => {
          const distance = Math.max(Math.abs(row - clickedRow), Math.abs(col - clickedCol));
          if (!waves[distance]) waves[distance] = [];
          waves[distance].push({ row, col });
        });
        return waves;
      }
      
      // Trigger the fireworks explosion with staggered timing
      triggerFireworksExplosion(explosionWaves, allConnected) {
        this.score += allConnected.length * 10;
        let callbacksPending = allConnected.length;
        
        const onExplosionComplete = () => {
          if (--callbacksPending === 0) {
            // Clear the shapes from the board after all explosions
            allConnected.forEach(({ row: r, col: c }) => { 
              if (this.shapes[r]) this.shapes[r][c] = null 
            });
            this.updateScore();
            setTimeout(() => this.applyGravity(), 200);
          }
        };

        // Explode each wave with increasing delay
        const waveDelays = Object.keys(explosionWaves).sort((a, b) => parseInt(a) - parseInt(b));
        waveDelays.forEach((distance, waveIndex) => {
          const wave = explosionWaves[distance];
          const baseDelay = waveIndex * 80; // 80ms between waves for snappy timing
          
          wave.forEach((pos, pieceIndex) => {
            const { row: r, col: c } = pos;
            const shapeToRemove = this.shapes[r]?.[c];
            if (shapeToRemove) {
              // Small random offset within the wave for more natural explosion
              const pieceDelay = baseDelay + (pieceIndex * 15);
              
              // Handle prize collection
              const prizeIndex = this.prizes.findIndex(p => p.row === r && p.col === c && !p.collected);
              if (prizeIndex !== -1) {
                this.prizes[prizeIndex].collected = true;
                this.score += 50;
                if (this.prizes[prizeIndex].prizeObj) {
                  setTimeout(() => {
                    this.prizes[prizeIndex].prizeObj.collect();
                  }, pieceDelay);
                }
              }
              
              // Trigger the fireworks explosion
              shapeToRemove.explode(pieceDelay, () => {
                this.scene.remove(shapeToRemove.mesh);
                shapeToRemove.dispose();
                onExplosionComplete();
              });
            } else {
              onExplosionComplete();
            }
          });
        });
      }
      
      findConnectedShapes(row, col, targetShapeType) {
        const visited = new Set();
        const connected = [];
        const stack = [{ row, col }];
        visited.add(`${row},${col}`);
        while (stack.length > 0) {
          const { row: r, col: c } = stack.pop();
          if (!this.boardLayout[r]?.[c] || this.shapes[r]?.[c]?.shapeType !== targetShapeType) continue;
          connected.push({ row: r, col: c });
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.columns && !visited.has(`${nr},${nc}`) && this.shapes[nr]?.[nc]) {
              visited.add(`${nr},${nc}`);
              stack.push({ row: nr, col: nc });
            }
          }
        }
        return connected;
      }
      applyGravity() {
        let animationsPending = 0;
        const offsetY = ((this.rows - 1) * this.spacing) / 2;
        const onGravityComplete = () => {
            if (--animationsPending === 0) this.removeEmptyColumns();
        };

        for (let j = 0; j < this.columns; j++) {
          let emptySpaces = 0;
          for (let i = this.rows - 1; i >= 0; i--) {
            if (!this.boardLayout[i]?.[j]) { emptySpaces = 0; continue; }
            if (!this.shapes[i][j]) {
              emptySpaces++;
            } else if (emptySpaces > 0) {
              const shape = this.shapes[i][j];
              const targetRow = i + emptySpaces;
              this.shapes[targetRow][j] = shape; this.shapes[i][j] = null;
              shape.row = targetRow;
              const newY = offsetY - targetRow * this.spacing;
              animationsPending++;
              new TWEEN.Tween(shape.mesh.position).to({ y: newY }, 500)
                .easing(TWEEN.Easing.Bounce.Out).onComplete(onGravityComplete).start();
              
              this.prizes.filter(p => p.row === i && p.col === j && !p.collected).forEach(p => {
                p.row = targetRow;
                if (p.prizeObj) new TWEEN.Tween(p.prizeObj.mesh.position).to({ y: newY }, 500).easing(TWEEN.Easing.Bounce.Out).start();
              });
            }
          }
        }
        if (animationsPending === 0) this.removeEmptyColumns();
      }
      removeEmptyColumns() {
        const emptyCols = [];
        for (let j = 0; j < this.columns; j++) {
          if (this.boardLayout.some(r => r[j]) && !this.shapes.some(r => r[j])) {
              emptyCols.push(j);
          }
        }
        if (emptyCols.length > 0) {
          this.score += emptyCols.length * 100;
          this.updateScore();
          
          let animationsPending = 0;
          const newColCount = this.columns - emptyCols.length;
          const offsetX = -((newColCount - 1) * this.spacing) / 2;
          
          const onShiftComplete = () => {
              if (--animationsPending === 0) {
                  this.finalizeColumnRemoval(emptyCols);
              }
          };

          for (let j = 0; j < this.columns; j++) {
              const shift = emptyCols.filter(c => c < j).length;
              if (shift > 0) {
                  const newCol = j - shift;
                  const newX = offsetX + newCol * this.spacing;
                  for (let i = 0; i < this.rows; i++) {
                      const shape = this.shapes[i][j];
                      if (shape) {
                          animationsPending++;
                          new TWEEN.Tween(shape.mesh.position).to({ x: newX }, 500)
                              .easing(TWEEN.Easing.Quadratic.Out).onComplete(onShiftComplete).start();
                          const prize = this.prizes.find(p => p.row === i && p.col === j && p.prizeObj);
                          if (prize) {
                              new TWEEN.Tween(prize.prizeObj.mesh.position).to({ x: newX }, 500)
                                  .easing(TWEEN.Easing.Quadratic.Out).start();
                          }
                      }
                  }
              }
          }
          if (animationsPending === 0) this.finalizeColumnRemoval(emptyCols);
        } else {
          this.checkGameState();
        }
      }
      finalizeColumnRemoval(emptyCols) {
        // This function now runs AFTER the shift animations are complete.
        emptyCols.sort((a, b) => b - a).forEach(col => {
            for (let i = 0; i < this.rows; i++) {
                this.shapes[i].splice(col, 1);
                this.boardLayout[i].splice(col, 1);
            }
        });
        this.columns -= emptyCols.length;
        
        // Update internal col property for all shapes and prizes
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.columns; j++) {
            if (this.shapes[i]?.[j]) this.shapes[i][j].col = j;
        }
        this.prizes.forEach(p => {
            const shift = emptyCols.filter(c => c < p.col).length;
            if (shift > 0) p.col -= shift;
        });

        // Recenter camera based on the new final state
        this.positionBoardElements(); 
        this.checkGameState();
      }
      
      // --- Game State and UI Updates ---
      checkGameState() {
        this.isAnimating = false;
        this.setRotationButtonsEnabled(true);
        if (this.prizes.length > 0 && this.prizes.every(p => p.collected)) {
          this.winLevel();
          return;
        }
        if (!this.hasValidMoves()) {
          this.endGame();
        }
      }
      hasValidMoves() {
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.columns; j++) {
            const s = this.shapes[i]?.[j];
            if (s && this.findConnectedShapes(i, j, s.shapeType).length >= this.minGroupSize) return true;
        }
        return false;
      }
      endGame() {
        this.pauseGame(true);
        this.setRotationButtonsEnabled(false);
        showOverlay(this.gameOverElement);
      }
      winLevel() {
        this.pauseGame(true);
        this.setRotationButtonsEnabled(false);
        showOverlay(this.gameWinElement);
      }
      pauseGame(isPaused) {
        this.gamePaused = isPaused;
        this.isAnimating = isPaused;
        this.setRotationButtonsEnabled(!isPaused);
      }
      updateScore() {
        this.scoreElement.textContent = this.score;
      }

      // --- Highlighting ---
      clearTubeConnections() {
        this.tubeConnections.forEach(t => t.remove());
        this.tubeConnections = [];
        this.shapes.flat().filter(s => s).forEach(s => s.mesh.material.emissive.setHex(0x000000));
      }
      highlightConnectedGroup(shape) {
        const connected = this.findConnectedShapes(shape.row, shape.col, shape.shapeType);
        if (connected.length < this.minGroupSize) return;
        connected.map(({ row, col }) => this.shapes[row][col]).forEach(s => s.mesh.material.emissive.setHex(0x555555));
        this.createTubesBetweenConnected(connected);
      }
      createTubesBetweenConnected(points) {
        const pointMemo = new Set(points.map(pos => `${pos.row},${pos.col}`));
        const connections = new Set();
        points.forEach(({ row, col }) => {
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr, nc = col + dc;
            if (pointMemo.has(`${nr},${nc}`)) {
              const id = [row, col, nr, nc].sort((a,b) => a-b).join(',');
              if (!connections.has(id)) {
                connections.add(id);
                this.tubeConnections.push(new TubeConnection(this.shapes[row][col], this.shapes[nr][nc], this.scene));
              }
            }
          }
        });
      }

      // --- Animation Loop ---
      animate() {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();
        if(!this.gamePaused) {
            this.prizes.forEach(p => {
              if (!p.collected && p.prizeObj) p.prizeObj.rotate();
            });
        }
        this.renderer.render(this.scene, this.camera);
      }
    }
