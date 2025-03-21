// ***************************************************************************
//
// Position Spline
// SETS the position of a particle along a spline
//
// ***************************************************************************

import { useContext } from 'react';

import catmullRom from '@/webgl/glsl/utils/catmullrom.glsl';

export const PositionSetSpline = ({
  spline,
  closed = false,
  debug = false,
}) => {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const defines = useMemo(() => {
    let d = {
      SPLINE_LENGTH: spline.length,
    };
    if (closed) {
      d.SPLINE_CLOSED = true;
    }
    return d;
  }, [spline, closed]);

  const { variable } = useSimulatorModule({
    name: 'PositionSetSpline',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec4 uPositionSpline[SPLINE_LENGTH];

        ${catmullRom}

        ivec4 getIndices(float pathProgress) {

          float splineMax = float(SPLINE_LENGTH);
          #if defined(SPLINE_CLOSED)
          return getCatmullRomSplineIndicesClosed(splineMax, pathProgress);
          #endif

          splineMax = float(SPLINE_LENGTH - 1);
          return getCatmullRomSplineIndices(splineMax, pathProgress);
        }
      `,
      execute: /*glsl*/ `
        float splineMax = float(SPLINE_LENGTH - 1);
        #if defined(SPLINE_CLOSED)
        splineMax = float(SPLINE_LENGTH);
        #endif

        float pathProgress = fract(progress) * splineMax;        

        ivec4 indices = getIndices(pathProgress);
        vec4 p0 = uPositionSpline[indices[0]];
        vec4 p1 = uPositionSpline[indices[1]];
        vec4 p2 = uPositionSpline[indices[2]];
        vec4 p3 = uPositionSpline[indices[3]];

        float pathProgressFract = fract(pathProgress);
        vec3 pathForce = catmullRomSpline(p0.xyz, p1.xyz, p2.xyz, p3.xyz, pathProgressFract);

        float pathRadius = 
            catmullRomSpline(
                p0.w, 
                p1.w, 
                p2.w, 
                p3.w, 
            pathProgressFract);

        vec3 toPos = texture2D(tShapeFrom, vec2(index, id)).xyz;
        toPos *= pathRadius;
        toPos += pathForce;
        
        nextPosition.xyz = toPos;
      `,
    },
    defines,
    uniforms: {
      uPositionSpline: { value: spline },
    },
  });

  useEffect(() => {
    if (!variable?.instance?.material?.uniforms?.uPositionSpline) return;
    variable.instance.material.uniforms.uPositionSpline.value = spline;
  }, [variable, spline]);

  useEffect(() => {
    if (!variable?.instance?.material?.defines) return;
    for (let key in Object.keys(variable.instance.material.defines)) {
      if (!(key in defines)) {
        delete variable.instance.material.defines[key];
      } else {
        variable.instance.material.defines[key] = defines[key];
      }
    }
  }, [variable, defines]);

  return (
    <>
      {debug ? (
        <DebugSpline
          spline={spline}
          closed={closed}
        />
      ) : (
        <></>
      )}
    </>
  );
};
