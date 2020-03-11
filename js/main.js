(function () {
    'use strict';

    const getElementFromTemplate = (template) => {
        const wrapper = document.createElement(`div`);
        wrapper.innerHTML = template.trim();    
        return wrapper.firstChild;
    };

    const mainElement = document.querySelector(`.main`);

    const changeScreen = (element) => {
        mainElement.innerHTML = ``;
        mainElement.appendChild(element);
        return mainElement;
    };

    const  rand = (min, max) => {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return min + (max - min) * Math.random();
    };

    const randomColor = () => {
        return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
    };

    class AbstractView {
        constructor(){
            if(new.target === AbstractView){
                throw new Error(`Can't instantiate AbstractView, only concrete one`)
            }
        }
        get template () {
            throw new Error(`Template is required`);
        }
        get element(){
            if(this._element){
                return this._element;
            }
            this._element = this.render();
            this.bind(this._element);
            return this._element;
        }
        render(){
            return render(this.template);
        }
        bind(element){
            
        }
    }

    class ScreenView extends AbstractView {
        constructor() {
            super();
            this._element = null;
        }
        get template() {
            return `
        <div>
            <label>Введите число кубов</label> 
            <input class="count_cube" type="number" min="1" max="20" ></input>    
            <hr>
            <canvas id="c"></canvas>
        </div>
        `
        }
        get element() {
            if (!this._element) {
                this._element = this.render();
                this.bind();
            }
            return this._element;
        }
        render(){
            return getElementFromTemplate(this.template);
        }
        bind(){
            const input = this._element.querySelector(`.count_cube`);
            input.addEventListener(`change`,(evt) => {
                if(parseInt(evt.target.value)){
                    this.onClick(evt.target.value);
                }
            }); 
            window.addEventListener('mouseout', this.mouseOut);
            window.addEventListener('mouseleave', this.mouseLeave);
        }
        onClick(){}
        mouseOut(){}
        mouseLeave(){}
    }

    class AbstactElement{
        constructor(){
            if(new.target === AbstactElement){
                throw new Error(`Can't instantiate AbstactElement, only concrete one`)
            }
        }
        get element(){
            if(this._element){
                return this._element;
            }
            this._element = this.create();
            return this._element;
        }
        create(){

        }    
    }

    class SphereElement extends AbstactElement{
        constructor(type, idElem, x=0, y=0, z=0){
            super();
            this.type = type.toLowerCase();
            this.idElem = idElem;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        get element(){
            if(!this._element){
                this._element = this.create();
            }
            return this._element;
        }
        create(){
            const sphereGeometry = new THREE.SphereGeometry(0.1, 20, 20);
            let sphereMaterial;
            if(this.type === `dark`){
                sphereMaterial = new THREE.MeshPhongMaterial({
                    emissive: new THREE.Color(this.idElem),
                    color: new THREE.Color(0, 0, 0),
                    blending: THREE.NoBlending,
                });
            } else {            
                sphereMaterial = new THREE.MeshPhongMaterial({
                    color: randomColor()
                });            
            }
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(this.x,this.y,this.z);            
            return sphere;
        }
        copyPosition(position,rotation,scale){
            this._element.position.copy(position);
            this._element.rotation.copy(rotation);
            this._element.scale.copy(scale);
        }
    }

    class CubeElement extends AbstactElement {
        get element() {
            if (!this._element) {
                this._element = this.create();
            }
            return this._element;
        }
        create() {
            const geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(-1, -1, 1),  // 0
                new THREE.Vector3(1, -1, 1),  // 1
                new THREE.Vector3(-1, 1, 1),  // 2
                new THREE.Vector3(1, 1, 1),  // 3
                new THREE.Vector3(-1, -1, -1),  // 4
                new THREE.Vector3(1, -1, -1),  // 5
                new THREE.Vector3(-1, 1, -1),  // 6
                new THREE.Vector3(1, 1, -1),  // 7
            );
            geometry.faces.push(
                // front
                new THREE.Face3(0, 3, 2),
                new THREE.Face3(0, 1, 3),
                // right
                new THREE.Face3(1, 7, 3),
                new THREE.Face3(1, 5, 7),
                // back
                new THREE.Face3(5, 6, 7),
                new THREE.Face3(5, 4, 6),
                // left
                new THREE.Face3(4, 2, 6),
                new THREE.Face3(4, 0, 2),
                // top
                new THREE.Face3(2, 7, 6),
                new THREE.Face3(2, 3, 7),
                // bottom
                new THREE.Face3(4, 1, 0),
                new THREE.Face3(4, 5, 1),
            );
            const edges = new THREE.EdgesGeometry(geometry);
            const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
            cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
            cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
            cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
            return cube;
        }
        copyPosition(position, rotation, scale) {
            this._element.position.copy(position);
            this._element.rotation.copy(rotation);
            this._element.scale.copy(scale);
        }
    }

    class GeometryElement extends AbstactElement {
        get element() {
            if (!this._element) {
                this._element = this.create();
            }
            return this._element;
        }
        create() {
            const geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(-1, -1, 1),  // 0
                new THREE.Vector3(1, -1, 1),  // 1
                new THREE.Vector3(-1, 1, 1),  // 2
                new THREE.Vector3(1, 1, 1),  // 3
                new THREE.Vector3(-1, -1, -1),  // 4
                new THREE.Vector3(1, -1, -1),  // 5
                new THREE.Vector3(-1, 1, -1),  // 6
                new THREE.Vector3(1, 1, -1),  // 7
            );
            geometry.faces.push(
                // front
                new THREE.Face3(0, 3, 2),
                new THREE.Face3(0, 1, 3),
                // right
                new THREE.Face3(1, 7, 3),
                new THREE.Face3(1, 5, 7),
                // back
                new THREE.Face3(5, 6, 7),
                new THREE.Face3(5, 4, 6),
                // left
                new THREE.Face3(4, 2, 6),
                new THREE.Face3(4, 0, 2),
                // top
                new THREE.Face3(2, 7, 6),
                new THREE.Face3(2, 3, 7),
                // bottom
                new THREE.Face3(4, 1, 0),
                new THREE.Face3(4, 5, 1),
            );
            return geometry;
        }
    }

    class GPUPickHelper {
        constructor() {
            this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
            this.pixelBuffer = new Uint8Array(4);
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }
        pick(cssPosition, scene, camera, renderer, idToObject) {
            const { pickingTexture, pixelBuffer } = this;
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }
            const pixelRatio = renderer.getPixelRatio();
            camera.setViewOffset(
                renderer.getContext().drawingBufferWidth,
                renderer.getContext().drawingBufferHeight,
                cssPosition.x * pixelRatio | 0,
                cssPosition.y * pixelRatio | 0,
                1,
                1,
            );
            renderer.setRenderTarget(pickingTexture);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);
            camera.clearViewOffset();
            renderer.readRenderTargetPixels(
                pickingTexture,
                0,   // x
                0,   // y
                1,   // width
                1,   // height
                pixelBuffer);

            const id =
                (pixelBuffer[0] << 16) |
                (pixelBuffer[1] << 8) |
                (pixelBuffer[2]);
            const intersectedObject = (idToObject[id]) ? idToObject[id].mesh : undefined;
            const lines = (idToObject[id]) ? idToObject[id].lines : undefined;
            if (intersectedObject) {
                this.pickedObject = intersectedObject;                
                this.pickedObject.parent.children.forEach((el) => {
                    if(el.type ===`Line`) this.pickedObject.parent.remove(el);
                });
                this.pickedObject.parent.add(lines);                                
            }
        }
    }

    const COUNT_EDGE = 6;
    const FOV = 60;
    const ASPECT = 2;
    const NEAR = 0.1;
    const FAR = 200;
    class ScreenPresenter {
        constructor() {
            this.screen = new ScreenView();
            this.idToObject = {};
            this.idElem = 0;
            this.canvas = this.screen.element.querySelector('canvas');
            this.renderer = null;
            this.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
            this.camera.position.z = 30;
            this.pickingScene = new THREE.Scene();
            this.pickingScene.background = new THREE.Color(0);
            this.pickPosition = { x: 0, y: 0 };
            this.pickHelper = new GPUPickHelper();
            this.screen.onClick = (num) => { this.animation(num); };
            this.screen.mouseOut = () => { this.clearPickPosition(); };
            this.screen.mouseLeave = () => { this.clearPickPosition(); };
            this.idAnimaiton = null;
        }
        get element() {
            this.bind();
            return this.screen.element;
        }
        _getCanvasRelativePosition(event) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        }
        bind() {
            window.addEventListener('click', (event) => { this.setPickPosition(event); });
        }
        clean(){
            this.idToObject = {};
            this.idElem = 0;
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
            this.pickingScene = new THREE.Scene();
            this.pickingScene.background = new THREE.Color(0);
            this.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
            this.camera.position.z = 30;
            cancelAnimationFrame(this.idAnimaiton); 
            this.clearPickPosition();
        }
        animation(numObjects) {
            if(!numObjects) return;
            this.clean();        
            const scene = new THREE.Scene();
            scene.background = new THREE.Color('white');
            const cameraPole = new THREE.Object3D();
            scene.add(cameraPole);
            cameraPole.add(this.camera);
            {
                const color = 0xFFFFFF;
                const intensity = 1;
                const light = new THREE.DirectionalLight(color, intensity);
                light.position.set(-1, 2, 4);
                this.camera.add(light);
            }
            const createAdjacentEdge = (index, color) => {
                const cubeZero = [
                    [-1, -1, 1],
                    [1, -1, 1],
                    [-1, 1, 1],
                    [1, 1, 1],
                    [-1, -1, -1],
                    [1, -1, -1],
                    [-1, 1, -1],
                    [1, 1, -1]
                ];
                const material = new THREE.LineBasicMaterial({ 'color': color, linewidth: 2 });
                const points = [];
                for (let i = 0; i < COUNT_EDGE; i++) {
                    if (i % 2 === 0) {
                        points.push(new THREE.Vector3(...cubeZero[index]));
                    } else {
                        let [x, y, z] = cubeZero[index];
                        if (i === 1) {
                            x *= -1;
                        } else if (i === 3) {
                            y *= -1;
                        } else if (i === 5) {
                            z *= -1;
                        }
                        points.push(new THREE.Vector3(x, y, z));
                    }
                }
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                return (new THREE.Line(geometry, material));
            };
            const createSpheres = (geo, cube, clone) => {
                for (let i = 0; i < geo.vertices.length; i++) {
                    this.idElem++;
                    const sphere = new SphereElement(`light`, this.idElem, geo.vertices[i].x, geo.vertices[i].y, geo.vertices[i].z);
                    cube.add(sphere.element);
                    this.idToObject[this.idElem] = {
                        mesh: sphere.element,
                        lines: createAdjacentEdge(i, sphere.element.material.color)
                    };
                    const pickingSphere = new SphereElement(`dark`, this.idElem);
                    clone.add(pickingSphere.element);
                    pickingSphere.copyPosition(sphere.element.position, sphere.element.rotation, sphere.element.scale);
                }
            };
            for (let i = 0; i < numObjects; ++i) {
                const cube = new CubeElement();
                const cubeClone = new CubeElement();
                scene.add(cube.element);
                this.pickingScene.add(cubeClone.element);
                cubeClone.copyPosition(cube.element.position, cube.element.rotation, cube.element.scale);
                const geometry = new GeometryElement();
                createSpheres(geometry.element, cube.element, cubeClone.element);
            }
            function resizeRendererToDisplaySize(renderer) {
                const canvas = renderer.domElement;
                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                const needResize = canvas.width !== width || canvas.height !== height;
                if (needResize) {
                    renderer.setSize(width, height, false);
                }
                return needResize;
            }
            const render = (time) => {
                if (resizeRendererToDisplaySize(this.renderer)) {
                    const canvas = this.renderer.domElement;
                    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    this.camera.updateProjectionMatrix();
                }
                this.renderer.render(scene, this.camera);
                this.idAnimaiton = requestAnimationFrame(render);
            };

            //запуск анимации
            this.idAnimaiton = requestAnimationFrame(render);
        }

        setPickPosition(event) {
            if(this.idElem === 0) return;
            const pos = this._getCanvasRelativePosition(event);
            this.pickPosition.x = pos.x;
            this.pickPosition.y = pos.y;
            this.pickHelper.pick(this.pickPosition, this.pickingScene, this.camera, this.renderer, this.idToObject);
        }

        clearPickPosition() {
            this.pickPosition.x = -100000;
            this.pickPosition.y = -100000;
        }
    }

    const screenPresenter = new ScreenPresenter();
    changeScreen(screenPresenter.element);

}());

//# sourceMappingURL=main.js.map
