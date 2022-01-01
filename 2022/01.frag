uniform vec2 u_resolution;
uniform float u_time;

vec3 sideNormal(vec2 st, vec3 center){
    float sa = center.x/center.y;
    float ta = st.x/st.y;
    float sb = (1. - center.x)/center.y;
    float tb = (1. - st.x)/st.y;
    float sc = (1. - center.x)/(1. - center.y);
    float tc = (1. - st.x)/(1. - st.y);
    float sd = center.x/(1. - center.y);
    float td = st.x/(1. - st.y);
    vec3 a = vec3(0.);
    vec3 b = vec3(0.);
    if (ta > sa && tb > sb) {
        a.y = 1.;
        b.xy = vec2(1.);
        return cross(center - a, center - b);
    } else if (tb < sb && tc < sc) {
        b.y = 1.;
        return cross(center - a, center - b);
    } else if (td < sd && ta < sa) {
        a.x = 1.;
        b.xy = vec2(1.);
        return cross(center - a, center - b);
    } else if (td > sd && tc > sc) {
        b.x = 1.;
        return -cross(center - a, center - b);
    }
}

vec3 shade(vec2 st, vec3 center) {
    vec3 fragNormal = sideNormal(st, center);
    vec3 lightDirection  = vec3(1.,2.,-1.);
    return vec3(.20, .10, .0) + vec3(0.5) * max(dot(normalize(fragNormal), normalize(lightDirection)), 0.);
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float tiles = 50.;

    vec2 pos = vec2(.5) - ceil(st * tiles)/tiles;
    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);
    float f = a*3. + r*10. + u_time*3.;
    vec3 center = vec3(.5+.25*cos(f), .5+.25*sin(f), 4.);

    st = fract(st * tiles);

    gl_FragColor = vec4(shade(st, center), 1.);
}
