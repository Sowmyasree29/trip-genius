import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserTripCard({ trip }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true); 

  
  const API_KEY = import.meta.env.VITE_APP_PIXABY_API_KEY;

  
  const location = trip?.userSelection?.location;

  useEffect(() => {
    async function fetchImage() {
      if (location) {
        try {
          const response = await axios.get(`https://pixabay.com/api/`, {
            params: {
              key: API_KEY,
              q: location,
              image_type: "photo",
              per_page: 3, 
            },
          });

          if (response.data.hits.length > 0) {
            setImageUrl(response.data.hits[0]?.largeImageURL); 
          } else {
            console.error("No images found for the given location.");
          }
        } catch (error) {
          console.error("Error fetching image from Pixabay:", error);
        } finally {
          setLoading(false); 
        }
      }
    }
    fetchImage();
  }, [location]);

  return (
    <Link to={`/viewTrip/` + trip?.id}>
      <div className="border p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        {loading ? (
          <div className="h-[280px] w-full bg-gray-200 animate-pulse rounded" />
        ) : (
          imageUrl && (
            <div className="h-[200px] sm:h-[250px] w-full relative overflow-hidden rounded">
              <img
                src={imageUrl}
                className="h-full w-full object-cover"
                alt={location}
                onLoad={() => setLoading(false)} 
              />
            </div>
          )
        )}
        <div className="mt-2 h-[70px]">
          <h2 className="font-bold text-gray-800  md:text-xs lg:text-xs">{trip?.userSelection?.location}</h2>
          <h2 className="text-sm text-gray-600 ">
            {trip?.userSelection?.noOfDays} Days with {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCard;
