import { useLayoutEffect, useMemo } from 'react';

function renderPerformanceDomElement() {
  const wrapper = document.createElement('div');
  wrapper.className = 'performance-stats';
  wrapper.style.fontFamily = 'monospace';
  wrapper.style.fontWeight = '100';
  wrapper.style.backgroundColor = '#000';
  wrapper.style.color = '#fff';
  wrapper.style.padding = '10px';
  wrapper.style.position = 'fixed';
  wrapper.style.display = 'flex';
  wrapper.style.flexFlow = 'column wrap';
  wrapper.style.justifyContent = 'space-around';
  wrapper.style.zIndex = '999';
  wrapper.style.bottom = '0px';
  wrapper.style.left = '0px';
  wrapper.style.minWidth = '220px';

  const createItem = (name) => {
    const item = document.createElement('div');
    item.className = 'performance-stats__item';
    item.style.display = 'flex';
    item.style.flexFlow = 'row nowrap';
    item.style.gap = '4rem';
    item.style.justifyContent = 'space-between';
    item.style.paddingBottom = '5px';
    wrapper.appendChild(item);

    const label = document.createElement('span');
    label.className = 'performance-stats__label';
    label.innerText = name;
    item.appendChild(label);

    const value = document.createElement('span');
    value.style.paddingLeft = '15px';
    value.className = 'performance-stats__value';

    item.appendChild(value);

    return value;
  };

  return [
    wrapper,
    createItem('Render calls'),
    createItem('Triangles'),
    createItem('Geometries'),
    createItem('Textures'),
    createItem('Shaders'),
    createItem('Lines'),
    createItem('Points'),
  ];
}

// Vanilla
export function getPerformanceInfo(gl, debug) {
  const [
    wrapper,
    calls,
    triangles,
    geometries,
    textures,
    shaders,
    lines,
    points,
  ] = renderPerformanceDomElement();
  gl.info.autoReset = false;

  if (debug) document.body.appendChild(wrapper);

  return function (_gl) {
    if (!debug) return;

    const renderer = _gl ?? gl;

    calls.innerText = `${Math.round(renderer.info.render.calls)}`;
    triangles.innerText = `${Math.round(renderer.info.render.triangles)}`;
    geometries.innerText = `${Math.round(renderer.info.memory.geometries)}`;
    textures.innerText = `${Math.round(renderer.info.memory.textures)}`;
    shaders.innerText = `${Math.round(renderer.info.programs?.length)}`;
    lines.innerText = `${Math.round(renderer.info.render.lines)}`;
    points.innerText = `${Math.round(renderer.info.render.points)}`;

    renderer.info.reset();
  };
}

export default function usePerformance(gl, debug = false) {
  const isDebug = debug;

  const [
    wrapper,
    calls,
    triangles,
    geometries,
    textures,
    shaders,
    lines,
    points,
  ] = useMemo(() => {
    return renderPerformanceDomElement();
  }, []);

  useLayoutEffect(() => {
    if (!isDebug) return;

    gl.info.autoReset = false;
    document.body.appendChild(wrapper);
  }, [gl.info, isDebug, wrapper]);

  function update() {
    if (!isDebug) return;

    calls.innerText = `${Math.round(gl.info.render.calls)}`;
    triangles.innerText = `${Math.round(gl.info.render.triangles)}`;
    geometries.innerText = `${Math.round(gl.info.memory.geometries)}`;
    textures.innerText = `${Math.round(gl.info.memory.textures)}`;
    shaders.innerText = `${Math.round(gl.info.programs?.length)}`;
    lines.innerText = `${Math.round(gl.info.render.lines)}`;
    points.innerText = `${Math.round(gl.info.render.points)}`;

    gl.info.reset();
  }

  return { update };
}
