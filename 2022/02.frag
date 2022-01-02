uniform sampler2D u_texture;
uniform vec2 u_textureResolution;

uniform vec2 u_resolution;
uniform float u_time;

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

// https://stackoverflow.com/questions/6442118/python-measuring-pixel-brightness
float luminance(vec3 c){
    return sqrt(0.299*pow(c.r,2.) + 0.587*pow(c.g,2.) + 0.114*pow(c.b,2.));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    vec3 c = texture2D(u_texture, st).rgb;

    float l = luminance(c) + noise((st + (3. + mod(u_time, 2.)) * (st - vec2(.95, .5))) * 300.);

    gl_FragColor = vec4(vec3(step(1., l)), 1.);
}
