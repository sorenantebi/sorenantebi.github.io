(function (root) {
  const LAYERS = [["enc1.0",0,16,1,3,1],["enc1.3",160,16,16,3,1],["enc2.0",2480,32,16,3,2],["enc2.3",7120,32,32,3,1],["enc3.0",16368,64,32,3,2],["enc3.3",34864,64,64,3,1],["enc4.0",71792,128,64,3,2],["enc4.3",145648,128,128,3,1],["bottom",293232,128,64,2,2],["dec1.0",326064,64,128,3,1],["dec1.3",399856,64,64,3,1],["dec1_t",436784,64,32,2,2],["dec2.0",445008,32,64,3,1],["dec2.3",463472,32,32,3,1],["dec2_t",472720,32,16,2,2],["dec3.0",474784,16,32,3,1],["dec3.3",479408,16,16,3,1],["dec3.6",481728,4,16,1,1]];

  function makeLayers(W) {
    const L = {};
    for (const [name, off, a, b, k, s] of LAYERS) {
      const tconv = name === 'bottom' || name.endsWith('_t');
      const n = a * b * k * k;
      L[name] = tconv
        ? { tconv, cin: a, cout: b, k, s, w: W.subarray(off, off + n), b: W.subarray(off + n, off + n + b) }
        : { tconv, cout: a, cin: b, k, s, relu: name !== 'dec3.6', w: W.subarray(off, off + n), b: W.subarray(off + n, off + n + a) };
    }
    return L;
  }

  function conv(t, l) {
    const { c: C, h: H, w: Wd, d: inp } = t, { cout, k, s, w, b, relu } = l;
    const p = k === 3 ? 1 : 0;
    const Ho = Math.floor((H + 2 * p - k) / s) + 1, Wo = Math.floor((Wd + 2 * p - k) / s) + 1;
    const plane = Ho * Wo, out = new Float32Array(cout * plane);
    for (let co = 0; co < cout; co++) {
      const ob = co * plane;
      out.fill(b[co], ob, ob + plane);
      for (let ci = 0; ci < C; ci++) {
        const ib = ci * H * Wd;
        for (let ky = 0; ky < k; ky++) {
          for (let kx = 0; kx < k; kx++) {
            const wv = w[((co * C + ci) * k + ky) * k + kx];
            const ox0 = Math.max(0, Math.ceil((p - kx) / s));
            const ox1 = Math.min(Wo - 1, Math.floor((Wd - 1 + p - kx) / s));
            for (let oy = 0; oy < Ho; oy++) {
              const iy = oy * s + ky - p;
              if (iy < 0 || iy >= H) continue;
              const ir = ib + iy * Wd + kx - p, or = ob + oy * Wo;
              for (let ox = ox0; ox <= ox1; ox++) out[or + ox] += wv * inp[ir + ox * s];
            }
          }
        }
      }
      if (relu) for (let i = ob; i < ob + plane; i++) if (out[i] < 0) out[i] = 0;
    }
    return { c: cout, h: Ho, w: Wo, d: out };
  }

  function tconv(t, l) {
    const { c: C, h: H, w: Wd, d: inp } = t, { cout, w, b } = l;
    const Ho = H * 2, Wo = Wd * 2, plane = Ho * Wo, out = new Float32Array(cout * plane);
    for (let co = 0; co < cout; co++) out.fill(b[co], co * plane, (co + 1) * plane);
    for (let ci = 0; ci < C; ci++) {
      const ib = ci * H * Wd;
      for (let co = 0; co < cout; co++) {
        const wb = (ci * cout + co) * 4, ob = co * plane;
        const w00 = w[wb], w01 = w[wb + 1], w10 = w[wb + 2], w11 = w[wb + 3];
        for (let y = 0; y < H; y++) {
          const r0 = ob + 2 * y * Wo, r1 = r0 + Wo, ir = ib + y * Wd;
          for (let x = 0; x < Wd; x++) {
            const v = inp[ir + x];
            out[r0 + 2 * x] += v * w00; out[r0 + 2 * x + 1] += v * w01;
            out[r1 + 2 * x] += v * w10; out[r1 + 2 * x + 1] += v * w11;
          }
        }
      }
    }
    return { c: cout, h: Ho, w: Wo, d: out };
  }

  function cat(a, b) {
    const d = new Float32Array(a.d.length + b.d.length);
    d.set(a.d); d.set(b.d, a.d.length);
    return { c: a.c + b.c, h: a.h, w: a.w, d };
  }

  // Mirrors Unet::forward in unet_cpp (BatchNorm folded into convs). onStep(i, n) lets the UI breathe.
  async function forward(L, img, H, W, onStep) {
    const steps = 18;
    let i = 0;
    const tick = async () => { if (onStep) await onStep(++i, steps); };
    const run = async (t, name) => { const r = L[name].tconv ? tconv(t, L[name]) : conv(t, L[name]); await tick(); return r; };
    let x = { c: 1, h: H, w: W, d: img };
    const x1 = await run(await run(x, 'enc1.0'), 'enc1.3');
    const x2 = await run(await run(x1, 'enc2.0'), 'enc2.3');
    const x3 = await run(await run(x2, 'enc3.0'), 'enc3.3');
    const x4 = await run(await run(x3, 'enc4.0'), 'enc4.3');
    let y = await run(cat(await run(x4, 'bottom'), x3), 'dec1.0');
    y = await run(y, 'dec1.3');
    y = await run(cat(await run(y, 'dec1_t'), x2), 'dec2.0');
    y = await run(y, 'dec2.3');
    y = await run(cat(await run(y, 'dec2_t'), x1), 'dec3.0');
    y = await run(y, 'dec3.3');
    return await run(y, 'dec3.6');
  }

  function argmax(t) {
    const plane = t.h * t.w, m = new Uint8Array(plane);
    for (let i = 0; i < plane; i++) {
      let best = 0, bv = t.d[i];
      for (let c = 1; c < t.c; c++) { const v = t.d[c * plane + i]; if (v > bv) { bv = v; best = c; } }
      m[i] = best;
    }
    return m;
  }

  root.UNet = { makeLayers, forward, argmax };
})(typeof window !== 'undefined' ? window : globalThis);
