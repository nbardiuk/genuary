uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float rectSDF(vec2 st, vec2 s){
    st = st*2. - 1.;
    return max(abs(st.x/s.x),abs(st.y/s.y));
}

vec3 tile (vec2 st, float t){
    if (min(min(st.x, st.y), (1. - max(st.x, st.y))) <= .005) return vec3(.97);

    for (int i=0; i<8;i++) {
        vec2 p = vec2(1. - float(i)/3.) - st + t/10.;
        float a = atan(p.y, p.x);
        float r = length(p);
        float r1 = .2 + 0.5*sin(a*2.)*cos(a*4.);
        float r2 = .3 + 0.5*sin(a*3.)*cos(a*3.);
        if (r<r1) return vec3(.18,.32,.66);
        if (r<r2) return vec3(.91,.51,.1);
    }
    return vec3(1.);
}

vec3 four_tiles(vec2 st, float t) {
    st *= 2.;
    vec2 f_st = fract(st);
    vec2 i_st = floor(st);

    float a = 0.;
    if (i_st == vec2(1.,0.)) a = 1.*PI/2.;
    if (i_st == vec2(1.,1.)) a = 2.*PI/2.;
    if (i_st == vec2(0.,1.)) a = 3.*PI/2.;

    return tile(rotate2d(a)*(f_st - vec2(.5)) + vec2(.5), t);
}

vec3 window(vec2 st, float t) {
    vec3 brown = vec3(.93);
    if (min(st.x, (1. - st.x)) <= .06) return brown;
    if (min(st.y, (1. - st.y)) <= .08) return brown;
    if (abs(st.x-.5) <= .03) return brown;
    return vec3(.39,.37,.41)-.05*sin(st.x*50.);
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float loop = 10.;
    float t = mod(u_time, loop);

    float tiles = 13.;
    vec2 p = st* tiles;
    vec2 f_st = fract(p);
    vec2 i_st = floor(p);

    vec3 c = four_tiles(f_st,t);
    if (rectSDF(p-((tiles-1.)/2.), vec2(6.,8.)) <= 1.) {
        c = window((p-vec2(3.5,2.5))/vec2(6.,8.), t);
    }

    gl_FragColor = vec4(c, 1.);
}
