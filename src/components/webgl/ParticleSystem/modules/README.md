# Particle System - Modules

- a module adds shader chunks to the base life, velocity, position, and/or rotation shaders

- a SET module will set the next value
  e.g. `nextVelocity.xyz = vec3(0.0,1.0,0.0);`

- ADD modules should be added AFTER the set module, and should modify the next value without replacing it
  e.g.`nextVelocity.y -= 0.1 * uDelta;`
