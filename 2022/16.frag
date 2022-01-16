uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

float sdCircle( vec2 p, float r ) {
    return length(p) - r;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float loop = 10.;
    float t = mod(u_time, loop);

    vec3 color = vec3(0.);

    vec2 c = st-vec2(.5,.2);
    float s = .01;
    float r = .5;
    float b = pow(abs(loop/2. - t)+.2, .5);

    float a = 8.*PI/loop*t;
    float d = sdCircle(c - vec2(r*sin(a), r*cos(a)), s);
    color += d*vec3(b,0.,0.);

    a += PI/2+PI/6;
    d = sdCircle(c - vec2(r*sin(a), r*cos(a)), s);
    color += d*vec3(0.,b,0.);

    a += PI/2+PI/6;
    d = sdCircle(c - vec2(r*sin(a), r*cos(a)), s);
    color += d*vec3(0.,0.,b);

    gl_FragColor = vec4(color,1.);
}
