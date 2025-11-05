export async function downloadSvgAsPng(svgEl: SVGSVGElement, filename: string, scale = 2) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  const width = (svgEl.viewBox.baseVal?.width || svgEl.clientWidth || 1000) * scale;
  const height = (svgEl.viewBox.baseVal?.height || svgEl.clientHeight || 1000) * scale;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, width, height);

  URL.revokeObjectURL(url);

  const png = await new Promise<string>((resolve) => resolve(canvas.toDataURL("image/png")));
  const link = document.createElement("a");
  link.href = png;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
