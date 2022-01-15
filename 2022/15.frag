uniform sampler2D u_texture;
uniform vec2 u_textureResolution;

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
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

    vec2 u = f*f*f*(f*(f*6.-15.)+10.);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float sdCircle( in vec2 p, in float r ) {
    return length(p)-r;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float loop = PI*8.;
    float t = mod(u_time*4., loop);

    vec3 sand = vec3(.96, .93, .85)*(1.-noise(st*700.)/8.);
    vec3 stone = vec3(.93)*(1.-noise(st*500.)/10.);

    vec3 col = sand * (.9 + .1*cos(290.*st.y));
    bool top1 = false;
    bool top2 = false;

    vec2 c = st - vec2(.5, .745);
    float a = atan(c.y, c.x);
    float d = sdCircle(c*5., .3);
    if (d<.0) {
        col = stone * (.95 + .1*smoothstep(.0, .1, abs(d)));
    } else if (d<.02) {
       col = sand * (.9 + .1*cos(60.0*d) );
    } else if (d<.63) {
        float g = mod(PI*.5-a, 2.*PI);
        if (g<t && g<PI) col = sand * (.9 + .1*cos(60.0*d) );
        if (g<t-PI*4. && g>PI) {
            col = sand * (.9 + .1*cos(60.0*d) ); 
            top1 = true;
        }
    }

    c = st - .5;
    a = atan(c.y, c.x);
    d = sdCircle(c*5., .3);
    if (d<.0) {
        col = stone * (.95 + .1*smoothstep(.0, .1, abs(d)));
    } else if (d<.02) {
       col = sand * (.9 + .1*cos(60.0*d) );
    } else if (d<.63 && !top1) {
        float g = mod(a-PI/2., 2.*PI);
        if (g<t-PI*1 && g>=0. && g<=PI) col = sand * (.9 + .1*cos(60.0*d) );
        if (g<t-PI*3. && g>=PI && g<=2.*PI) {
            col = sand * (.9 + .1*cos(60.0*d) ); 
            top2 = true;
        }
    }

    c = st - vec2(.5, .255);
    a = atan(c.y, c.x);
    d = sdCircle(c*5., .3);
    if (d<.0) {
        col = stone * (.95 + .1*smoothstep(.0, .1, abs(d)));
    } else if (d<.02) {
       col = sand * (.9 + .1*cos(60.0*d) );
    } else if (d<.63 && !top2) {
        float g = mod(PI*.5-a, 2.*PI);
        if (g<t-PI*2. && g>=0. && g<=PI*2) col = sand * (.9 + .1*cos(60.0*d) );
    }

    gl_FragColor = vec4(col, 1.);
}
