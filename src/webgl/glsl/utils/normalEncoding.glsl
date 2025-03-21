// https://knarkowicz.wordpress.com/2014/04/16/octahedron-normal-vector-encoding/

vec2 normalOctWrap(vec2 v) {
    vec2 w = 1.0 - abs( v.yx );
    if (v.x < 0.0) w.x = -w.x;
    if (v.y < 0.0) w.y = -w.y;
    return w;
}
 
vec2 normalEncode(vec3 n) {
    // n /= (abs(n.x) + abs(n.y) + abs(n.z));
    // n.xy = n.z >= 0.0 ? n.xy : normalOctWrap(n.xy);
    // n.xy = n.xy * 0.5 + 0.5;
    // return n.xy;

    n /= ( abs( n.x ) + abs( n.y ) + abs( n.z ) );
    n.xy = n.z > 0.0 ? n.xy : normalOctWrap( n.xy );
    n.xy = n.xy * 0.5 + 0.5;
    return n.xy;
}
 
vec3 normalDecode(vec2 f) {
    // f = f * 2.0 - 1.0;
 
    // // https://twitter.com/Stubbesaurus/status/937994790553227264
    // vec3 n = vec3(f.x, f.y, 1.0 - abs(f.x) - abs(f.y));
    // float t = clamp(-n.z, 0., 1.);
    // n.x += n.x >= 0.0 ? -t : t;
    // n.y += n.y >= 0.0 ? -t : t;
    // return normalize(n);

    f = f * 2.0 - 1.0;
 
    // https://twitter.com/Stubbesaurus/status/937994790553227264
    vec3 n = vec3( f.x, f.y, 1.0 - abs( f.x ) - abs( f.y ) );
    float t = max( -n.z, 0.0 );
    // float t = clamp(-n.z, 0.0, 1.0);
    n.x += n.x >= 0.0 ? -t : t;
    n.y += n.y >= 0.0 ? -t : t;
    return normalize( n );
}