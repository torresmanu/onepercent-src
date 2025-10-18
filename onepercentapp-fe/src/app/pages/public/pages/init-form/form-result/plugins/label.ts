import Chart from 'chart.js/auto';

const labelPlugin = {
  id: 'customEndLabels',
  afterDatasetsDraw(chart: Chart) {
    const { ctx, width } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    const firstIndex = 0;
    const lastIndex = dataset.data.length - 1;
    const firstPoint = meta.data[firstIndex];
    const lastPoint = meta.data[lastIndex];

    const drawRoundedLabel = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      text: string,
      chartWidth: number
    ) => {
      if (!text || text === 'undefined' || text === 'null') return;

      const paddingX = 6;
      const radius = 4;
      ctx.font = 'bold 12px sans-serif';
      const textWidth = ctx.measureText(text).width;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = 20;

      let boxX = x - boxWidth / 2;

      const boxY = y - boxHeight / 2;

      ctx.beginPath();
      ctx.fillStyle = '#5a9e3f';
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, radius);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text, boxX + boxWidth / 2, boxY + boxHeight / 2);
    };

    ctx.save();

    if (firstPoint && dataset.data[firstIndex] != null) {
      const value = dataset.data[firstIndex];
      drawRoundedLabel(ctx, firstPoint.x, firstPoint.y, String(value), width);
    }

    if (lastPoint && dataset.data[lastIndex] != null) {
      const value = dataset.data[lastIndex];
      drawRoundedLabel(ctx, lastPoint.x, lastPoint.y, String(value), width);
    }

    ctx.restore();
  },
};

export default labelPlugin;
