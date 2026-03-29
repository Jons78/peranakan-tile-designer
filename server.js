import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/submit-tile', (req, res) => {
  const { tileData, imageData } = req.body;

  if (!tileData || !imageData) {
    return res.status(400).json({
      success: false,
      message: 'Missing tile data or image data',
    });
  }

  const submissionId = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

  const submissionWithMeta = {
    id: submissionId,
    submittedAt: new Date().toISOString(),
    ...tileData,
  };

  const jsonFileName = `tile_${submissionId}.json`;
  const jsonFilePath = path.join('submissions', jsonFileName);

  const pngFileName = `tile_${submissionId}.png`;
  const pngFilePath = path.join('tile_pngs', pngFileName);

  console.log('Saving as:', jsonFileName, pngFileName);

  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

  fs.writeFileSync(jsonFilePath, JSON.stringify(submissionWithMeta, null, 2));
  fs.writeFileSync(pngFilePath, base64Data, 'base64');

  res.json({
    success: true,
    message: 'Tile saved successfully',
    jsonFile: jsonFileName,
    pngFile: pngFileName,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});