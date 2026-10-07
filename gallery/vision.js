// JavaScript ports of github.com/sorenantebi/otsu (Task_2/car.cpp, Task_2/kmeans.h, Task_1/diffuse.cpp + filtered_data.h).
// Integer arithmetic mirrors the C++ (truncating division) so results match the original binaries.
(function (root) {
  const MAX_INTENSITY = 255;

  // otsu_threshold(): maximise between-class variance over the 256-bin histogram.
  // Also returns the variance curve so the page can plot it.
  function otsu(hist) {
    let N = 0, sum = 0;
    for (let i = 0; i <= MAX_INTENSITY; i++) { N += hist[i]; sum += i * hist[i]; }
    let sumB = 0, q1 = 0, varMax = 0, threshold = 0;
    const curve = new Float64Array(256);
    for (let i = 0; i <= MAX_INTENSITY; i++) {
      q1 += hist[i];
      if (q1 === 0) continue;
      const q2 = N - q1;
      if (q2 === 0) break;
      sumB += i * hist[i];
      const m1 = Math.fround(sumB / q1), m2 = Math.fround((sum - sumB) / q2);
      const varBetween = Math.fround(q1 * q2 * (m1 - m2) * (m1 - m2));
      curve[i] = varBetween;
      if (varBetween > varMax) { varMax = varBetween; threshold = i; }
    }
    return { threshold, curve };
  }

  // kMeans() on 1-D intensities. Because assignment only depends on intensity, iterating over the
  // histogram gives exactly the same centroids as looping over every pixel.
  // Centroids start at points[0..k-1] of the descending-sorted channel, as in car.cpp.
  function kmeans(hist, k = 2, maxIterations = 100) {
    const sortedDesc = [];
    for (let v = 255; v >= 0 && sortedDesc.length < k; v--) for (let c = 0; c < hist[v] && sortedDesc.length < k; c++) sortedDesc.push(v);
    let centroids = sortedDesc.slice();
    const history = [centroids.slice()];
    const assign = v => {
      let best = 0, d = Math.abs(v - centroids[0]);
      for (let i = 1; i < centroids.length; i++) { const di = Math.abs(v - centroids[i]); if (di < d) { d = di; best = i; } }
      return best;
    };
    let convergedAt = -1;
    for (let iter = 0; iter < maxIterations; iter++) {
      const count = new Array(k).fill(0), total = new Array(k).fill(0);
      for (let v = 0; v <= 255; v++) { if (!hist[v]) continue; const c = assign(v); count[c] += hist[v]; total[c] += v * hist[v]; }
      const next = centroids.map((c, i) => count[i] > 0 ? Math.trunc(total[i] / count[i]) : c);
      if (convergedAt < 0 && next.every((c, i) => c === centroids[i])) convergedAt = iter;
      centroids = next;
      history.push(centroids.slice());
    }
    // getClusterStats(): threshold = max over clusters of each cluster's minimum intensity.
    const mins = new Array(k).fill(Infinity), counts = new Array(k).fill(0);
    for (let v = 0; v <= 255; v++) { if (!hist[v]) continue; const c = assign(v); counts[c] += hist[v]; if (v < mins[c]) mins[c] = v; }
    const threshold = Math.max(-1, ...mins.map((m, i) => counts[i] ? m : 0));
    return { centroids, history, threshold, counts, convergedAt };
  }

  // diffuse.cpp: brightest pixel per column (red channel), mean row of ties, z-score filter on intensity,
  // then least-squares line through the surviving points.
  function lineFit(rgba, width, height, zThreshold = 2.0) {
    const maxV = new Int32Array(width), maxY = new Int32Array(width);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const v = rgba[(y * width + x) * 4];
        if (maxV[x] < v) { maxV[x] = v; maxY[x] = y; }
      }
      let sum = 0, div = 0;
      for (let y = 0; y < height; y++) if (rgba[(y * width + x) * 4] === maxV[x]) { sum += y; div++; }
      maxY[x] = Math.trunc(sum / div);
    }
    const n0 = width;
    let meanI = 0;
    for (let i = 0; i < n0; i++) meanI += maxV[i];
    meanI /= n0;
    let sd = 0;
    for (let i = 0; i < n0; i++) sd += (maxV[i] - meanI) ** 2;
    sd = Math.sqrt(sd / n0);
    const fx = [], fy = [], rejected = [];
    for (let i = 0; i < n0; i++) {
      const z = (maxV[i] - meanI) / sd;
      if (Math.abs(z) <= zThreshold) { fx.push(i); fy.push(maxY[i]); } else rejected.push([i, maxY[i]]);
    }
    const n = fx.length;
    let sx = 0, sy = 0, sxy = 0, sx2 = 0;
    for (let i = 0; i < n; i++) { sx += fx[i]; sy += fy[i]; sxy += fx[i] * fy[i]; sx2 += fx[i] ** 2; }
    const slope = (n * sxy - sx * sy) / (n * sx2 - sx ** 2);
    const intercept = (sy - slope * sx) / n;
    return { slope, intercept, kept: fx.map((x, i) => [x, fy[i]]), rejected, meanI, sd };
  }

  root.Vision = { otsu, kmeans, lineFit };
})(typeof window !== 'undefined' ? window : globalThis);
