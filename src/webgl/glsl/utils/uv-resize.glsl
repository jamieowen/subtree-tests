#define CONTAIN 0
#define COVER 1

vec2 UVResize(vec2 uvBase, vec2 resolution, vec2 aspect, vec2 scale, int fit) {
    
    vec2 st = resolution / aspect;
    float r = fit == COVER ? max(st.x, st.y) : min(st.x, st.y);
    
    vec2 uv = uvBase;
    uv -= vec2(0.5);
    uv *= st;
    uv *= 1.0 / r;
    uv *= 1.0 / scale;
    uv += vec2(0.5);
    
    return uv;
}