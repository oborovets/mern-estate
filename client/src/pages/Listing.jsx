import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/${listingId}`, {
          method: "GET",
        });
        const data = await res.json();

        if (data.success === false) {
          return setError(true);
        }
        setListing(data);
        setError(false);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  if (loading) {
    return <p className="text-center text-2xl my-7">Loading...</p>;
  }

  if (error || !listing) {
    return <p className="text-center text-2xl my-7">Something went wrong...</p>;
  }

  return (
    <main>
      <Swiper navigation>
        {listing.imageUrls.map((imageUrl, idx) => (
          <SwiperSlide key={imageUrl}>
            <div
              className="h-[550px]"
              style={{ background: `url(${imageUrl}) center no-repeat` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
