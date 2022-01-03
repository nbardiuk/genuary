uniform vec2 u_resolution;
uniform float u_time;

// forked from https://www.shadertoy.com/view/ltBfDt

float random (in vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3. - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1. - u.x) +
            (d - b) * u.x * u.y;
}

float hole (vec2 st) {
    float r = .11;
    vec2 d = st - vec2(.5);
    return smoothstep(r, r - .01, dot(d, d) * 4.);
}

float light(in vec2 pos,in float size,in float fade){
    return (1. - pow(clamp(length(pos/size) ,0., 1.), 1./fade));
}

float flare(in float angle,in float alpha,in float time){
    float t = time;
    float n = noise(vec2(t+.5+abs(angle)+pow(alpha,.6),t-abs(angle)+pow(alpha+.1,.6))*7.);
    float split = (15.+sin(t*2.+n*4.+angle*20.+alpha*1.*n)*(.3+.5+alpha*.6*n));
    float rotate = sin(angle*20. + sin(angle*15.+alpha*4.+t*30.+n*5.+alpha*4.))*(.5 + alpha*1.5);
    float g = pow((2.+sin(split+n*1.5*alpha+rotate))*n*4.,n*(1.5-.8*alpha));
    g *= pow(alpha, 7.) * .5;
    g += alpha + pow(g, 3);
    return g;
}

float corona(vec2 st){
    st = vec2(.5) - st;
    float angle = atan(st.y,st.x);
    float alpha = light(st, 0.99, 1.5);
    float time = mod(u_time, 10.) * .08;
    return flare(angle,alpha,time) * alpha;
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 c = vec3(min(corona(st), 1. - hole(st)));
    gl_FragColor = vec4(c, 1.);
}
