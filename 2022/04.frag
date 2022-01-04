// based on
// https://thebookofshaders.com/edit.php#11/iching-03.frag
// https://thebookofshaders.com/edit.php#11/wood.frag

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return step(.5+b*.5, abs((sin(pos.x*PI)+b*2.0))*.5);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float loop=5.;
    float t = abs(loop - mod(u_time, 2.*loop));

    st = rotate2d(noise(st*1.4)) * st;
    st = st * vec2(2., 3.);

    float d = lines(st.xy, max(t,1.)*.40)*lines(st.yx, max(1.,loop-t)*.40);

    vec3 color = vec3(.1);
    if (d==0) color = vec3(.9,0.88,.85);
    gl_FragColor = vec4(color,1.0);
}
