import { useState, useEffect } from "react";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "des",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const parking = urlParams.get("parking") === "true" ? true : false;
    const furnished = urlParams.get("furnished") === "true" ? true : false;
    const offer = urlParams.get("offer") === "true" ? true : false;
    const sort = urlParams.get("sort") || "created_at";
    const order = urlParams.get("order") || "desc";

    setSidebarData({
      searchTerm,
      type,
      parking,
      furnished,
      offer,
      sort,
      order,
    });
    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleChange = (e) => {
    if (["all", "rent", "sale"].includes(e.target.id)) {
      return setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (["parking", "furnished", "offer"].includes(e.target.id)) {
      return setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked, // || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const [sort = "created_at", order = "desc"] = e.target.value.split("_");
      return setSidebarData({ ...sidebarData, sort, order });
    }

    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  console.log(listings);
  return (
    <div className="flex flex-col md:flex-row">
      <div className=" p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-7">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              onChange={handleChange}
              type="text"
              id="searchTerm"
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                checked={sidebarData.type === "all"}
                onChange={handleChange}
                className="w-5"
                type="checkbox"
                id="all"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
                className="w-5"
                type="checkbox"
                id="rent"
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
                className="w-5"
                type="checkbox"
                id="sale"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.offer}
                className="w-5"
                type="checkbox"
                id="offer"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.parking}
                className="w-5"
                type="checkbox"
                id="parking"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.furnished}
                className="w-5"
                type="checkbox"
                id="furnished"
              />
              <span>Furnished </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort</label>
            <select
              onChange={handleChange}
              defaultValue="created_at_desc"
              className="border rounded-lg p-3"
              id="sort_order"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
      </div>
    </div>
  );
}
