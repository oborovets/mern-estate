import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

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
              key={idx}
              className="h-[550px]"
              style={{ background: `url(${imageUrl}) center no-repeat` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        />
      </div>
      {copied && (
        <p className="fixed top-[20%] right-[3%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        <p className="text-2xl font-semibold">
          {`${listing.name} - ${
            listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")
          }$`}
          {listing.type === "rent" && " / month"}
        </p>
        <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
          <FaMapMarkerAlt className="text-green-700" />
          <span>{listing.address}</span>
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                ${Number(listing.regularPrice) - Number(listing.discountPrice)}{" "}
                OFF
              </p>
            )}
          </div>
        </div>
        <p className="text-slate-800">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </p>
        <ul className="text-green-900 font-semibold text-sm flex gap-4 items-center sm:gap-6 flex-wrap">
          <li className="flex items-center gap-2 whitespace-nowrap">
            <FaBed className="text-lg" />
            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : "1 bed"}
          </li>
          <li className="flex items-center gap-2 whitespace-nowrap">
            <FaBath />
            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : "1 bath"}
          </li>
          <li className="flex items-center gap-2 whitespace-nowrap">
            <FaParking />
            {listing.parking ? `Parking` : "No Parking"}
          </li>
          <li className="flex items-center gap-2 whitespace-nowrap">
            <FaChair />
            {listing.furnished ? `Furnished` : "Unfurnished"}
          </li>
        </ul>
        {currentUser && currentUser._id !== listing.userRef && !contact && (
          <button
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
            onClick={() => setContact(true)}
          >
            Contatct Landlord
          </button>
        )}
        {contact && <Contact listing={listing} />}
      </div>
    </main>
  );
}
