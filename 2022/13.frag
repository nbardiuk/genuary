uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// https://thebookofshaders.com/11/
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float pattern(float m, float filter, float seed){
    float r = 0.;
    for(float i=0.; i<m; i++){
        if(round(noise(vec2(i)*seed)) == filter) r++;
    }
    return mod(r, 2.);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float loop = 10.;
    float t = mod(u_time, loop);

    float tiles = 400.;
    st *= tiles;
    vec2 i_st = floor(st);
    i_st = abs(tiles/2. - i_st);
    i_st = abs(tiles/2. - i_st);

    vec3 color = vec3(1.);
    if (abs(i_st.y-tiles/2.) <= tiles/20.) {
        float mx = i_st.x + floor(48.*t);
        float my = i_st.y + floor(24.*t);
        float ib = pattern(mx, 0., 29.);
        float jb = pattern(my, mod(mx, 2.), 13.);
        if (jb == ib) color = vec3(.94, .2, .24);
    }

    gl_FragColor = vec4(color,1.);
}
