import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import api from "../services/api";

const initialState = {
  imageUrls: [],
  name: "",
  description: "",
  address: "",
  type: "rent",
  bedrooms: 1,
  bathrooms: 1,
  regularPrice: 50,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
};

export default function ListingForm({ handleSubmit, listingId }) {
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(false);

  const storeImage = (file) => {
    return new Promise((res, rej) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uplaodTask = uploadBytesResumable(storageRef, file);

      uplaodTask.on("state_changed", null, rej, () => {
        getDownloadURL(uplaodTask.snapshot.ref).then((downloadURL) => {
          res(downloadURL);
        });
      });
    });
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setLoading(true);
      setImageUploadError(false);
      const promises = [...files].map((file) => storeImage(file));

      Promise.all(promises)
        .then((imageUrls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(imageUrls),
          });
        })
        .catch(() => setImageUploadError("Image upload failed."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setImageUploadError("You can upload 6 images per listing");
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      return setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (["parking", "furnished", "offer"].includes(e.target.id)) {
      return setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRemoveImage = (idx) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== idx),
    });
  };

  useEffect(() => {
    const fetchListing = async () => {
      const { data } = await api.get(`/listing/${listingId}`);
      // TODO: HANDLE ERROR PROPERLY
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      const { ...rest } = data;
      setFormData(rest);
    };
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  return (
    <form
      onSubmit={(e) => handleSubmit(e, setError, setLoading, formData)}
      className="flex flex-col sm:flex-row gap-4"
    >
      <div className="flex flex-col gap-4 flex-1">
        <input
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg"
          id="name"
          maxLength={62}
          minLength={10}
          required
          onChange={handleChange}
          value={formData.name}
        />
        <textarea
          type="text"
          placeholder="Description"
          className="border p-3 rounded-lg"
          id="description"
          required
          onChange={handleChange}
          value={formData.description}
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-3 rounded-lg"
          id="address"
          required
          onChange={handleChange}
          value={formData.address}
        />
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="sale"
              className="w-5"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <span>Sell</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="rent"
              className="w-5"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="parking"
              className="w-5"
              onChange={handleChange}
              checked={formData.parking}
            />
            <span>Parking Spot</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="furnished"
              className="w-5"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <span>Furnished</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="offer"
              className="w-5"
              onChange={handleChange}
              checked={formData.offer}
            />
            <span>Offer</span>
          </div>
        </div>
        <div className="flex  flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="bedrooms"
              min={1}
              max={10}
              className="p-3 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <p>Beds</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="bathrooms"
              min={1}
              max={10}
              className="p-3 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <p>Baths</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="regularPrice"
              min={50}
              className="p-3 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <div className=" flex flex-col items-center">
              <p>Regular Price</p>
              {formData.type === "rent" && (
                <span className="text-xs">($ / Month)</span>
              )}
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min={0}
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className=" flex flex-col items-center">
                <p>Discount Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / Month)</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <p className="font-semibold">
          Images:
          <span className="font-normal text-gray-600">
            The first image will be the cover (max 6)
          </span>
        </p>
        <div className="flex gap-4">
          <input
            onChange={(e) => setFiles(e.target.files)}
            className="p-3 border border-gray-300 rounded w-full"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          <button
            disabled={loading}
            type="button"
            onClick={handleImageSubmit}
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <p className="text-red-700 text-sm">
          {imageUploadError ? imageUploadError : null}
        </p>
        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, idx) => (
            <div
              key={url}
              className="flex justify-between p-3 border item-center"
            >
              <img
                src={url}
                alt="listing image"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                type="button"
                className="p-3 text-red-700 rounde-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
        <button
          disabled={loading}
          className="p-3 bg-slate-700 border text-white border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update Listing"}
        </button>
        {error && <p className="text-red-700 test-sm">{error}</p>}
      </div>
    </form>
  );
}

ListingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  listingId: PropTypes.string,
};
