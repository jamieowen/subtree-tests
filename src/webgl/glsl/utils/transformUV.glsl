 vec2 translateUV(vec2 uv, vec2 translate) {
        return uv - translate;
    }

    vec2 rotateUV(vec2 uv, float r, vec2 origin) {
        float c = cos(r);
        float s = sin(r);
        mat2 m = mat2(c, -s,
                    s, c);
        vec2 st = uv - origin;
        st = m * st;
        return st + origin;
    }

    vec2 scaleUV(vec2 uv, vec2 scale, vec2 origin) {
        vec2 st = uv - origin;
        st /= scale;
        return st + origin;
    }

    vec2 rotateUV(vec2 uv, float r) {
        return rotateUV(uv, r, vec2(0.5));
    }

    vec2 scaleUV(vec2 uv, vec2 scale) {
        return scaleUV(uv, scale, vec2(0.5));
    }

    vec2 skewUV(vec2 st, vec2 skew) {
        return st + st.gr * skew;
    }

    vec2 transformUV(vec2 uv, float a[9]) {

        // Array consists of the following
        // 0 translate.x
        // 1 translate.y
        // 2 skew.x
        // 3 skew.y
        // 4 rotate
        // 5 scale.x
        // 6 scale.y
        // 7 origin.x
        // 8 origin.y

        vec2 st = uv;

        //Translate
        st -= vec2(a[0], a[1]);

        //Skew
        st = st + st.gr * vec2(a[2], a[3]);

        //Rotate
        st = rotateUV(st, a[4], vec2(a[7], a[8]));

        //Scale
        st = scaleUV(st, vec2(a[5], a[6]), vec2(a[7], a[8]));

        return st;
    }