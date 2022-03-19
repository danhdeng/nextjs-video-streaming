// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import busboy from 'busboy';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadVideo = (req: NextApiRequest, res: NextApiResponse) => {
  const bb = busboy({ headers: req.headers });

  bb.on('file', (_, file, fileInfo) => {
    const fileName = fileInfo.filename;
    const filepPath = `./videos/${fileName}`;
    const stream = fs.createWriteStream(filepPath);
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
    return res.status(200).json({ name: 'hi video play' });
  }

  if (method === 'POST') {
    return uploadVideo(req, res);
  }

  res.status(405).json({ error: `Method ${method} is not allowed` });
}
