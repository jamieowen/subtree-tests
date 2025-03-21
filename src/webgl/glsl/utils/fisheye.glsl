
vec2 fisheyeSt(vec2 st, float pr, float pow){
    vec2 p = st;//normalized coords with some cheat

    float prop = uResolution.x / uResolution.y;//screen proroption
    vec2 m = vec2(.5);//center coords
    // vec2 m = vec2(.5, .5 / prop);//center coords
    vec2 d = p - m;//vector from center to current fragment
    float r = sqrt(dot(d, d)); // distance of pixel from center

    // float power = ( 1.0 * 3.141592 / (2.0 * sqrt(dot(m, m))) ) *
    float power = ( 2. * 3.141592 / (2.0 * sqrt(dot(m, m))) ) *
          -clamp(pr, 0.001, 1.) * 2. * pow;//amount of effect

    float bind; //radius of 1:1 effect
    if (power > 0.0) bind = sqrt(dot(m, m)); //stick to corners
    else {if (prop < 1.0) bind = m.x; else bind = m.y;} //stick to borders

    //Weird formulas
    vec2 uv;
    if (power > 0.0)//fisheye
      uv = m + normalize(d) * tan(r * power) * bind / tan( bind * power);
    else if (power < 2.0)//antifisheye
      uv = m + normalize(d) * atan(r * -power * 10.0) * bind / atan(-power * bind * 10.0);
    else uv = p;//no effect for power = 1.0

    return vec2(uv.x, uv.y);
}