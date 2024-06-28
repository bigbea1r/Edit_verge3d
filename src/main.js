// Импорты
import '../src/style.css';
import * as v3d from '/node_modules/verge3d/build/v3d.module.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ViewModal from '../src/viewmodal.js';
import configMaterials from '../src/configMaterials.json'

// Initialize Verge3D scene, renderer, and camera
const scene = new v3d.Scene();
const camera = new v3d.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 6);

const renderer = new v3d.WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Loaders
const loader = new v3d.GLTFLoader();
const textureLoader = new v3d.TextureLoader();

// Создание экземпляра объекта ViewModal
let viewModal = new ViewModal(textureLoader);
// Add lights to the scene
const light1 = new v3d.PointLight(0xffffff, 1);
light1.position.set(-1, 1, 3);
scene.add(light1);

const light2 = new v3d.PointLight(0xffffff, 1);
light2.position.set(1, 1, -3);
scene.add(light2);

// Orbit controls
const controls = new v3d.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const addModel = [
    '/models/DoorSmall. Closed.glb',
    '/models/DoorSmall. Open1.glb',
    '/models/DoorBig. Closed.glb',
    '/models/DoorBig. Open1.glb',
];

let currentModel;
const nameMaterial = {};
const jsonString = JSON.stringify(configMaterials);
const parsedConfig = JSON.parse(jsonString)

// Загрузка и замена модели
function switchModel(index) {
    // Удаляем текущую модель, если она существует
    if (currentModel) {
        scene.remove(currentModel);
    }

    loader.load(addModel[index], (gltf) => {
        currentModel = gltf.scene;
        currentModel.rotation.y = 1.58;
        currentModel.position.y = -0.8;

        scene.add(currentModel);
        
        materialsDiv.appendChild(combobox);
    }, undefined, (error) => {
        console.error('Произошла ошибка', error);
    });
}
let materialsDiv = document.getElementById("materials");
materialsDiv.innerHTML = '';

let combobox = document.createElement('select');
combobox.id = "modelsCombobox";

function getPaths(obj, stopNodeName, currentPath = '') {
    let result = [];
    for (const key in obj) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        if (currentPath.endsWith(stopNodeName)) {
            result.push(newPath);
        } else 
            result = result.concat(getPaths(obj[key], stopNodeName, newPath));
            
    }
    return result;
}

let modelsDiv = document.getElementById("models");
modelsDiv.innerHTML = '';

viewModal.createButtonsModels(
    addModel,
    "Модель №",
    "modelButton",
    function(idx) {
        switchModel(idx);
    },
    modelsDiv
);

const paths = getPaths(configMaterials, 'MeshPhysicalMaterial');
console.log(paths);

paths.forEach(function(model) {
    let option = document.createElement('option');

    let parts = model.split('.');
    option.text = parts[parts.length - 1];
    option.value = model;

    combobox.appendChild(option);
});


console.log(combobox.value)

combobox.addEventListener('change', function(event) {
    applyMaterial(event.target.value, configMaterials, currentModel);
});

function applyMaterial(path, config, model) {
    console.log(path);
    console.log(config);
    console.log(model);
    model.traverse((node) => {
        if (node.isMesh && node.material) {
            nameMaterial[node.material.name] = node.material;
        }
    });
    console.log(nameMaterial);

    //----------1. Извлекаются параметры из конфига по Идентификатору----------

    const pathParts  = path.split('.') 
        let shaderData = parsedConfig;
    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        shaderData = shaderData[part];
        console.log(shaderData);
    }
    
        let  material = nameMaterial[shaderData.shader_name];

    console.log('Material found:', material);
    // ------------------------------------------------------------------------
    // -----------------------3. заменяются параметры--------------------------
    console.log(shaderData)
                    if (!material) {
                        console.error(`Material with shader ID ${shaderData.shader_name} not found.`);
                        return;
                    }
                    if (shaderData.Texture.map) {
                        material.map = textureLoader.load(shaderData.Texture.map);
                    } else {
                        material.map = null;
                    }
    
                    if (shaderData.Texture.roughnessMap) {
                        material.roughnessMap = textureLoader.load(shaderData.Texture.roughnessMap);
                    } else {
                        material.roughnessMap = null;
                    }
    
                    if (shaderData.Texture.normalMap) {
                        material.normalMap = textureLoader.load(shaderData.Texture.normalMap);
                    } else {
                        material.normalMap = null;
                    }
                    material.needsUpdate = true;

    return material
    //------------------------------------------------------------------------
}

document.addEventListener('DOMContentLoaded', () => {

    switchModel(0);

    function animate() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

animate();
});
