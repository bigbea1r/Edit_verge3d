export default class ViewModal {
    constructor(textureLoader) {
        this.textureLoader = textureLoader;
    }

    createButtonsModels(items, textPrefix, idPrefix, clickHandler, container) {
        items.forEach((item, index) => {
            let button = document.createElement("button");
            button.innerHTML = `${textPrefix} ${index + 1}`;
            button.id = `${idPrefix}${index + 1}`;
            button.onclick = function() {
                clickHandler(index);
            };
            container.appendChild(button);
        });
    }


    additionModel(gltfLoader, model) {
        return new Promise((resolve, reject) => {
            gltfLoader.load(
                model.nameModel,
                (gltf) => {
                    const loadedModel = gltf.scene;
                    resolve(loadedModel);
                },
                undefined,
                (error) => {
                    reject(`An error happened while loading the model ${model.nameModel}: ${error}`);
                }
            );
        });
    }
    // applyShaders(material, textureData) {
            
    //     if (textureData.map) {
    //         material.map = this.textureLoader.load(textureData.map);
    //     } else {
    //         material.map = null; 
    //     }

    //     if (textureData.roughnessMap) {
    //     material.roughnessMap = this.textureLoader.load(textureData.roughnessMap);
    //     } else {
    //         material.roughnessMap = null; 
    //     }

    //     if (textureData.normalMap) {
    //         material.normalMap = this.textureLoader.load(textureData.normalMap);
    //     } else {
    //         material.normalMap = null; 
    //     }
    //     material.needsUpdate = true;
    // }
    // createShadersButton(array, nameMaterial, idBox) {
    //     array.forEach((item, index) => {
    //         for (const key in item) {
    //             let shaderData = item[key];
    //             let button = document.createElement("button");
    //             button.innerHTML = `${shaderData.shader_name}`;
    //             button.id = `${index + 1}`;

    //             button.onclick = () => { 
    //                 let material = nameMaterial[shaderData.shader_name];
    //                 this.applyShaders(material, shaderData.Texture);
    //             };

    //             idBox.appendChild(button);
    //         }
    //     });
    // }
}
