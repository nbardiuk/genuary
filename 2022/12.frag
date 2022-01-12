uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

float rectSDF(vec2 st, vec2 s){
    st = st*2. - 1.;
    return max(abs(st.x/s.x),abs(st.y/s.y));
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float loop = 4.;
    float t = abs(loop - mod(u_time, loop*2.));
    vec3 color = vec3(.93);
    float side = 1.;
    float da = PI/pow(t/4.+1.6, 4.);
    for (float i=0.; i<22.; i++){
        float a = da*i;
        vec2 p = rotate2d(a)*(st-.5)+.5;
        float d = rectSDF(p, vec2(1.));
        side *= sin(PI/4.)/sin(PI*.75-da);
        if (d<side) { 
            if (mod(i,2.) == 0.) {
                color = vec3(0.); 
            } else {
                color = vec3(.93); 
            }
        }
    }
    gl_FragColor = vec4(color,1.);
}
