import React from 'react';
import { useRouter } from 'next/router';
import { VideoPlayer } from '../../components/VideoPlayer';
import { GetServerSideProps } from 'next';

function VideoPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  //console.log(id);
  return <VideoPlayer id={id} />;
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return {
    props: { query: context.query },
  };
};

export default VideoPage;
