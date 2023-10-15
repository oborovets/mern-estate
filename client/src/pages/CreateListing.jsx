import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ListingForm from "../components/ListingForm";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e, setError, setLoading, formData) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      return setError("You mus upload at least one image");
    }

    if (Number(formData.regularPrice) < Number(formData.discountPrice)) {
      return setError("Discount price should be lower thatn regular price");
    }

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      if (data.success === false) {
        return setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <ListingForm handleSubmit={handleSubmit} />
    </main>
  );
}
