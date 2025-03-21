gltf-transform dedup subway.glb dedup.glb
gltf-transform instance dedup.glb instance.glb
gltf-transform flatten instance.glb flatten.glb
gltf-transform dequantize flatten.glb dequantize.glb
gltf-transform weld dequantize.glb weld.glb
gltf-transform simplify weld.glb simplify.glb --ratio 0.0001 --error 0.001
gltf-transform resample simplify.glb resample.glb
gltf-transform prune resample.glb prune.glb
gltf-transform sparse prune.glb sparse.glb
gltf-transform resize sparse.glb resize.glb --width 1024 --height 1024
gltf-transform draco resize.glb subway-o.glb
gltf-transform gzip subway-o.glb
