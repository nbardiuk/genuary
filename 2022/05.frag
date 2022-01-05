// based on https://thebookofshaders.com/12/
uniform vec2 u_resolution;
uniform float u_time;

float square(vec2 st, float side){
    vec2 d = abs(st - .5);
    float x = 1.-step(side,d.x);
    float y = 1.-step(side,d.y);
    return min(x, y);
};

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float t = mod(u_time, 10.);

    vec2 point[5];
    point[0] = vec2(0.77,0.85);
    point[1] = vec2(0.78,0.2);
    point[2] = vec2(0.18,0.75);
    point[3] = vec2(0.31,0.26);
    point[4] = vec2(.6,.5);

    float m_dist = 1.;
    for (int i = 0; i < 5; i++) {
        m_dist = min(m_dist, distance(st, point[i]));
    }
    float sq = square(st, 0.4);
    float bubles = max(.0, 0.2*(pow(t,.65))-m_dist)*2.;
    float color = max(bubles, (1. - sq));
    gl_FragColor = vec4(vec3(color),1.0);
}
