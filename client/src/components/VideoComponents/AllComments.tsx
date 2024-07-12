import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'

interface ReviewProps {
    videoId: number;
    userId: number;
    creatorId: number;
    reviewText: string;
    createdAt: Date;
  }

const AllComments = () => {
    const [reviews, setReviews] = useState<ReviewProps[]>([]);
    const [totalReviews, setTotalReviews] = useState<number>(reviews.length);

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = Number(urlParams.get('videoId'));

    const handleGetReviews = useCallback(async () => {
        try {
          const reviewsByVideoId = await axios.get(`http://localhost:7070/getAllReviews?videoId=${videoId}`, {
            withCredentials: true
          });
          setReviews(reviewsByVideoId.data.reviewsByVideoId);
          setTotalReviews(reviews.length);
        } catch (error) {
          console.error(error);
        }
      }, [reviews.length, videoId]);

      useEffect(() => {
        handleGetReviews();
      }, [handleGetReviews]);
  return (
    <div className='text-white'>
        {totalReviews}
    </div>
  )
}

export default AllComments