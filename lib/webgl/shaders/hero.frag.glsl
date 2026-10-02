precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMotion;
uniform float uIntensity;
uniform float uDitherScale;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(0.82, 0.57, -0.57, 0.82);
  for (int i = 0; i < 5; i++) {
    total += amplitude * valueNoise(p);
    p = turn * p * 2.03 + 19.1;
    amplitude *= 0.5;
  }
  return total;
}

float bayer4(vec2 pixel) {
  vec2 p = mod(pixel, 4.0);
  float x = p.x;
  float y = p.y;
  if (y < 1.0) return (x < 1.0 ? 0.0 : x < 2.0 ? 8.0 : x < 3.0 ? 2.0 : 10.0) / 16.0;
  if (y < 2.0) return (x < 1.0 ? 12.0 : x < 2.0 ? 4.0 : x < 3.0 ? 14.0 : 6.0) / 16.0;
  if (y < 3.0) return (x < 1.0 ? 3.0 : x < 2.0 ? 11.0 : x < 3.0 ? 1.0 : 9.0) / 16.0;
  return (x < 1.0 ? 15.0 : x < 2.0 ? 7.0 : x < 3.0 ? 13.0 : 5.0) / 16.0;
}

float atmosphere(vec2 uv, vec2 center, vec2 scale, float drift, float threshold) {
  vec2 p = (uv - center) / scale;
  p.x += drift;
  vec2 warp = vec2(
    fbm(p * 1.25 + vec2(drift * 0.42, 2.1)),
    fbm(p * 1.25 + vec2(5.4, drift * -0.34))
  ) - 0.5;
  p += warp * 0.42;
  float body = 1.0 - length(p);
  float broad = fbm(p * 1.7 + vec2(drift * 0.22, -drift * 0.12));
  float grain = fbm(p * 5.6 - drift * 0.16);
  return smoothstep(threshold, threshold + 0.42, body + broad * 0.48 + grain * 0.11);
}

void main() {
  vec2 uv = vUv;
  float ratio = uResolution.x / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(0.055, 0.038);
  float time = uTime * uMotion;

  // The pale field has a slight vertical bloom so uncovered areas never look flat.
  vec3 base = mix(vec3(0.94, 0.98, 1.0), vec3(0.86, 0.94, 1.0), uv.y * 0.7);
  vec2 p = uv;
  p.x = (p.x - 0.5) * ratio + 0.5;

  float upperLeft = atmosphere(p + mouse * 0.72, vec2(0.08, 1.06), vec2(0.60, 0.48), time * 0.030, 0.02);
  float upperRight = atmosphere(p - mouse, vec2(0.98, 0.94), vec2(0.52, 0.43), -time * 0.024, 0.03);
  float center = atmosphere(p + mouse * 0.45, vec2(0.53, 0.55), vec2(0.31, 0.23), time * 0.044 + 4.0, 0.28) * 0.67;
  float lowerHaze = atmosphere(p - mouse * 0.30, vec2(0.58, -0.08), vec2(0.72, 0.21), -time * 0.017 + 8.0, 0.42) * 0.22;

  float cloud = max(max(upperLeft, upperRight), max(center, lowerHaze));
  float overlap = clamp(upperLeft * upperRight + center * 0.55, 0.0, 1.0);
  float internal = fbm(p * vec2(3.0, 4.6) + vec2(time * 0.035, -time * 0.022));
  float luminosity = smoothstep(0.12, 0.93, cloud) * (0.84 + internal * 0.18 + overlap * 0.12);

  // Ordered dithering fades the atmospheric edges into discrete pink specks.
  float edge = 1.0 - smoothstep(0.18, 0.70, cloud);
  float pixelScale = mix(70.0, 125.0, uDitherScale);
  float ordered = bayer4(floor(gl_FragCoord.xy / max(1.0, 1.5 - uDitherScale)));
  float stochastic = hash21(floor(gl_FragCoord.xy / pixelScale) + floor(time * 0.25));
  float ditherGate = smoothstep(ordered * 0.62 + stochastic * 0.15, 0.97, cloud + 0.19);
  float softCloud = mix(cloud, cloud * ditherGate, edge * 0.86);

  // Sparse micro-dots live just beyond the main mask, not across the whole field.
  vec2 cells = floor(gl_FragCoord.xy / 2.5);
  float speck = hash21(cells + floor(time * 0.10));
  float particles = step(0.972, speck) * smoothstep(0.03, 0.36, cloud) * edge;
  particles *= 0.44 + 0.56 * sin(time * 0.65 + speck * 21.0);

  vec3 pinkDeep = vec3(1.0, 0.0, 0.72);
  vec3 pinkLight = vec3(1.0, 0.38, 0.82);
  vec3 pink = mix(pinkLight, pinkDeep, smoothstep(0.28, 0.90, internal + cloud * 0.20));
  pink = mix(pink, vec3(1.0, 0.75, 0.92), (1.0 - luminosity) * 0.42);

  vec3 color = mix(base, pink, clamp(softCloud * uIntensity, 0.0, 1.0));
  color = mix(color, pinkDeep, overlap * 0.22 * uIntensity);
  color = mix(color, pinkLight, particles * uIntensity);

  float filmGrain = (hash21(gl_FragCoord.xy + fract(time) * 179.0) - 0.5) * 0.026;
  color += filmGrain;
  gl_FragColor = vec4(color, 1.0);
}
