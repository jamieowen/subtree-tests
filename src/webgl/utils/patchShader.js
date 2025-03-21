export const patchShader = (material, patch) => {
  if (!material) {
    console.warn('patchShader', patch.name, 'Material is not defined');
    return;
  }

  // material.userData = material.userData || {};
  // material.userData.modules = material.userData.modules || [];
  // if (material.userData.modules.includes(patch.name)) {
  //   console.warn('patchShader', patch.name, 'Material already patched');
  //   return unpatchShader(material, patch);
  // }
  // material.userData.modules.push(patch.name);

  // Add uniforms and defines
  if (patch.uniforms) Object.assign(material.uniforms, patch.uniforms);
  material.defines = material.defines || {};
  if (patch.defines) Object.assign(material.defines, patch.defines);

  if (patch.vertexShader) {
    for (let [key, chunk] of Object.entries(patch.vertexShader)) {
      const chunkExists = material.vertexShader.includes(chunk);
      if (!chunkExists) {
        material.vertexShader = material.vertexShader.replace(
          `/// insert <${key}>`,
          `${chunk}\n/// insert <${key}>\n`
        );
      }
    }
  }

  if (patch.fragmentShader) {
    for (let [key, chunk] of Object.entries(patch.fragmentShader)) {
      const chunkExists = material.fragmentShader.includes(chunk);
      if (!chunkExists) {
        material.fragmentShader = material.fragmentShader.replace(
          `/// insert <${key}>`,
          `${chunk}\n/// insert <${key}>\n`
        );
      }
    }
  }

  // material.needsUpdate = true;

  return () => unpatchShader(material, JSON.parse(JSON.stringify(patch)));
};

export const unpatchShader = (material, patch) => {
  if (!material) {
    console.warn('unpatchShader', patch.name, 'Material is not defined');
    return;
  }

  // if (!material.userData.modules.includes(patch.name)) {
  //   // console.warn('patchShader', patch.name, 'Material already unpatched');
  //   return;
  // }
  // material.userData.modules.filter((name) => name !== patch.name);

  // Remove uniforms
  if (patch.uniforms) {
    for (let key of Object.keys(patch.uniforms)) {
      delete material.uniforms[key];
    }
  }

  // Remove defines
  if (material.defines && patch.defines) {
    for (let key of Object.keys(patch.defines)) {
      delete material.defines[key];
    }
  }

  // Remove shader chunks
  if (patch.vertexShader) {
    for (let [key, chunk] of Object.entries(patch.vertexShader)) {
      material.vertexShader = material.vertexShader.replace(
        `${chunk}\n/// insert <${key}>\n`,
        `/// insert <${key}>`
      );
    }
  }

  if (patch.fragmentShader) {
    for (let [key, chunk] of Object.entries(patch.fragmentShader)) {
      material.fragmentShader = material.fragmentShader.replace(
        `${chunk}\n/// insert <${key}>\n`,
        `/// insert <${key}>`
      );
    }
  }

  material.needsUpdate = true;
};
