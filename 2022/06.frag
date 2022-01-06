uniform vec2 u_resolution;
uniform float u_time;

vec3 sideNormal(vec2 st, vec3 center){
    vec3 bl = vec3(0.,1.,0.);
    vec3 br = vec3(1.,1.,0.);
    vec3 tl = vec3(0.,0.,0.);
    vec3 tr = vec3(1.,0.,0.);
    vec3 dbl = bl - center;
    vec3 dbr = br - center;
    vec3 dtl = tl - center;
    vec3 dtr = tr - center;
    vec3 dst = vec3(st, 0.) - center;
    float ast = atan(dst.y, dst.x);
    float abl = atan(dbl.y, dbl.x);
    float abr = atan(dbr.y, dbr.x);
    float atl = atan(dtl.y, dtl.x);
    float atr = atan(dtr.y, dtr.x);
    if (atl <= ast && ast <= atr) {
        return cross(dtl, dtr);
    } else if (atr <= ast && ast <= abr) {
        return cross(dtr, dbr);
    } else if (abr <= ast && ast <= abl) {
        return cross(dbr, dbl);
    } else {
        return cross(dbl, dtl);
    }
}

vec3 shade(vec2 st, vec3 center) {
    vec3 fragNormal = sideNormal(st, center);
    vec3 lightPosition = vec3(-10.,1.,10.);
    float lambert = max(dot(normalize(fragNormal), normalize(lightPosition)), 0.);
    vec3 diffuse = vec3(.45,.45,.43);
    vec3 ambient = vec3(.5,.5,.48);
    return ambient + diffuse * lambert;
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float loop = 10.;
    float t = abs(loop - mod(u_time, loop*2.));

    vec2 tiles = vec2(8.,14.);
    st *= tiles;
    vec2 f_st = fract(st);
    vec2 i_st = floor(st);

    vec2 pos = vec2(.5) - i_st;
    float f = atan(pos.y, pos.x)*5. + length(pos)*0.4 + t*1.;
    vec3 center = vec3(.5+.4*cos(f), .5+.3*sin(f), 1.);
    vec3 col = shade(f_st, center);

    gl_FragColor = vec4(col, 1.);
}
