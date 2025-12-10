const vertexShader = `
  attribute vec3 velocity;
  attribute float life;
  attribute float age;
  attribute float psize;
  attribute vec3 pcolor;

  varying float vAge;
  varying float vLife;
  varying vec3 vColor;

  uniform float sizeAttenuation;
  uniform float pixelRatio;

  void main() {
    vAge = age;
    vLife = life;
    vColor = pcolor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    float finalSize = psize * sizeAttenuation * pixelRatio;
    float ageFactor = 1.0 - (age / life);
    finalSize *= ageFactor;
    gl_PointSize = max(finalSize, 0.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vAge;
  varying float vLife;
  varying vec3 vColor;

  // simple circular point (soft)
  float circle(vec2 uv, float r) {
    float d = length(uv - vec2(0.5));
    return smoothstep(r, r - 0.15, d);
  }

  void main() {
    // gl_PointCoord ranges 0..1 inside the point
    vec2 uv = gl_PointCoord;
    float mask = circle(uv, 0.5);

    // flicker based on age and a cheap pseudo-random (vAge)
    float flicker = 0.8 + 0.4 * sin(vAge * 50.0 + uv.x * 30.0);

    // alpha fades as particle dies
    float alpha = (1.0 - (vAge / vLife)) * flicker;
    alpha *= mask;

    // color: pass through attribute
    vec3 color = vColor;

    // additive blending is used on material side
    gl_FragColor = vec4(color * (0.8 + 0.4 * (1.0 - vAge / vLife)), alpha);

    // discard if fully transparent for performance
    if (gl_FragColor.a < 0.01) discard;
  }
`;

export { fragmentShader, vertexShader };
