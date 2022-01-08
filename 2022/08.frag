uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float t = mod(u_time, 10.);
    vec3 color = vec3(.93);
    for (int i=0; i<min(99., pow(t*2,1.7) ); i++){
        vec2 p = vec2(.5) - st + vec2(.0, .22 - .005*float(i));
        float a = atan(p.y, p.x)+t/3.-i/90.;
        float r = length(p)+i/1500.;
        float f = pow(float(i),.7)/400.;
        float r1 = .2 + f*sin(a*2)*cos(a*5.);
        if (abs(r-r1) <= .001) color = vec3(.35);
    }
    gl_FragColor = vec4(vec3(color),1.);
}
