import React from 'react';

export const VideoPlayer = ({ id }: { id: string }) => {
  return (
    <div>
      <video
        src={`/api/videos?videoId=${id}`}
        width="800px"
        height="auto"
        controls
        autoPlay
        id="video-player"
      />
    </div>
  );
};
