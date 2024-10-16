import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import axios from "axios";

function InfoSec({ trip }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true); // State to track loading status

  // Use your Pixabay API key here
  const API_KEY = import.meta.env.VITE_APP_PIXABY_API_KEY;

  // Extract the location from userSelection
  const location = trip?.userSelection?.location;

  useEffect(() => {
    async function fetchImage() {
      if (location) {
        try {
          const response = await axios.get(`https://pixabay.com/api/`, {
            params: {
              key: API_KEY,
              q: location, // Search image based on location
              image_type: "photo",
              per_page: 3, // Set to a value between 3 and 200
            },
          });

          if (response.data.hits.length > 0) {
            setImageUrl(response.data.hits[0]?.largeImageURL); // Get the first image URL from the response
          } else {
            console.error("No images found for the given location.");
          }
        } catch (error) {
          console.error("Error fetching image from Pixabay:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      }
    }
    fetchImage();
  }, [location]);

  return (
    <div className="p-5">
      <div className="relative h-[450px] w-full overflow-hidden mb-5">
        {loading ? (
          <div className="h-full w-full bg-gray-200 animate-pulse rounded" />
        ) : (
          imageUrl && (
            <img
              src={imageUrl}
              className="h-full w-full object-fit"
              alt={location}
            />
          )
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-gray-900 font-bold text-2xl">{location}</h2>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
        <div className="flex gap-5">
          <h2 className="p-4 bg-gray-50 rounded-full border border-teal-300 flex justify-center gap-2">
            {trip?.userSelection?.noOfDays} Days{" "}
            <img src="/images/calendar.png" className="h-4 mt-1" alt="Calendar" />
          </h2>
          <h2 className="p-4 bg-gray-50 rounded-full border border-teal-300 flex justify-center gap-2">
            {trip?.userSelection?.budget} Budget{" "}
            <img src="/images/budget.jpeg" className="h-4 mt-1" alt="Budget" />
          </h2>
          <h2 className="p-4 bg-gray-50 rounded-full border border-teal-300 flex justify-center gap-2">
            {trip?.userSelection?.travelList}{" "}
            <img src="/images/people.png" className="h-4 mt-1" alt="People" />
          </h2>
        </div>
        <Button className="mt-4 sm:mt-0">
          <FaShareAlt />
        </Button>
      </div>
    </div>
  );
}

export default InfoSec;
