import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import api from "../services/api";

export default function ListingList({ currentUserId }) {
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const { data } = await api.get(`/user/listings/${currentUserId}`);

      if (data.success === false) {
        return setShowListingsError(true);
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const { data } = await api.delete(`/listing/delete/${listingId}`);

      if (data.success === false) {
        console.log(data);
        return;
      }
      setUserListings((listings) =>
        listings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShowListings}
        className="text-green-700 w-full"
      >
        Show Listings
      </button>
      <p className="text-red-700">
        {showListingsError ? "Error Showing Listings" : ""}
      </p>
      <div className="flex flex-col gap-4">
        {userListings.length > 0 && (
          <h2 className="text-center mt-7 text-2xl font-semibold">
            Your lisitings
          </h2>
        )}
        {userListings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="Listing image"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col item-center">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

ListingList.propTypes = {
  currentUserId: PropTypes.string.isRequired,
};
