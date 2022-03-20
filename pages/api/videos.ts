// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import busboy from 'busboy';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const CHUNK_SIZE_IN_BYTES = 1000000;

const getVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send('Range must be provided');
  }

  const videoId = req.query.videoId;

  const videoPath = `./videos/${videoId}.mp4`;
  console.log('file path' + videoPath);
  const fileDetail = fs.statSync(videoPath);
  console.log('fileDetail: ' + fileDetail);

  const videoSizeInBytes = fs.statSync(videoPath).size;
  const chunkStart = Number(range.replace(/\D/g, ''));

  const chunkEnd = Math.min(
    chunkStart + CHUNK_SIZE_IN_BYTES,
    videoSizeInBytes - 1
  );

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, {
    start: chunkStart,
    end: chunkEnd,
  });
  videoStream.pipe(res);
};

const uploadVideo = (req: NextApiRequest, res: NextApiResponse) => {
  const bb = busboy({ headers: req.headers });

  bb.on('file', (_, file, fileInfo) => {
    const fileName = fileInfo.filename;
    const filePath = `./videos/${fileName}`;
    const stream = fs.createWriteStream(filePath);
    file.pipe(stream);
  });

  bb.on('close', () => {
    res.writeHead(200, { Connection: 'close' });
    res.end('That is the end');
  });

  req.pipe(bb);
  return;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  if (method === 'GET') {
    console.log('try to get video');
    return getVideoStream(req, res);
  }

  if (method === 'POST') {
    return uploadVideo(req, res);
  }

  res.status(405).json({ error: `Method ${method} is not allowed` });
}
