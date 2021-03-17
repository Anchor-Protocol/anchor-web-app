const float PI2 = 6.28318530718;

vec4 radialRainbow(vec2 st, float tick) {
  vec2 toCenter = vec2(0.5) - st;
  float angle = mod((atan(toCenter.y, toCenter.x) / PI2) + 0.5 + sin(tick * 0.002), 1.0);

  // colors
  vec4 a = vec4(0.424,0.612,0.412,1.0);
  vec4 b = vec4(0.612,0.769,0.561,1.0);
  vec4 c = vec4(0.424,0.612,0.412,1.0);
  vec4 d = vec4(0.612,0.769,0.561,1.0);
  vec4 e = vec4(0.424,0.612,0.412,1.0);

  float step = 1.0 / 10.0;

  vec4 color = a;

  color = mix(color, b, smoothstep(step * 1.0, step * 2.0, angle));
  color = mix(color, a, smoothstep(step * 2.0, step * 3.0, angle));
  color = mix(color, b, smoothstep(step * 3.0, step * 4.0, angle));
  color = mix(color, c, smoothstep(step * 4.0, step * 5.0, angle));
  color = mix(color, d, smoothstep(step * 5.0, step * 6.0, angle));
  color = mix(color, c, smoothstep(step * 6.0, step * 7.0, angle));
  color = mix(color, d, smoothstep(step * 7.0, step * 8.0, angle));
  color = mix(color, e, smoothstep(step * 8.0, step * 9.0, angle));
  color = mix(color, a, smoothstep(step * 9.0, step * 10.0, angle));

  return color;
}

#pragma glslify: export(radialRainbow);