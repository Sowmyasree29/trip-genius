import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Hotels({ trip }) {
  const [hotelImages, setHotelImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_APP_PIXABY_API_KEY;
  const fetchHotelImages = async () => {
    const hotels = trip?.hotels || []; // Safely access hotels
  
    if (hotels.length === 0) {
      console.warn("No hotels found in trip data.");
      setLoading(false);
      return;
    }
  
    const promises = hotels.map(async (hotel) => {
      let query = `${hotel.name} ${hotel.address}`.trim();
  
      if (query.length > 100) {
        query = query.substring(0, 100);
      }
  
      const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=5`;
  
      console.log("Fetching images for:", url); // Log the URL for debugging
  
      try {
        const response = await axios.get(url);
        if (response.data.hits.length > 0) {
          const imageUrls = Array.from(new Set(response.data.hits.map(hit => hit.largeImageURL)));
          return {
            name: hotel.name,
            imageUrls,
            price: hotel.price,
            rating: hotel.rating,
            address: hotel.address,
          };
        } else {
          console.warn(`No images found for hotel: ${hotel.name}`);
          return { name: hotel.name, imageUrls: [] };
        }
      } catch (error) {
        console.error("Error fetching hotel images:", error);
        return { name: hotel.name, imageUrls: [] };
      }
    });
  
    try {
      const images = await Promise.all(promises);
      const imageMap = images.reduce((acc, { name, imageUrls, price, rating, address }) => {
        if (imageUrls.length > 0) {
          acc.push({ name, imageUrls, price, rating, address });
        }
        return acc;
      }, []);
  
      setHotelImages(imageMap);
    } catch (error) {
      console.error("Error processing hotel images:", error);
    } finally {
      setLoading(false);
    }
  };

  
  

  useEffect(() => {
    fetchHotelImages();
  }, [trip]);

  return (
    <div className="p-5">
      <h2 className="mt-10 font-bold text-lg text-gray-900">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {hotelImages.length > 0 ? (
          hotelImages.slice(0, 3).map((hotel, index) => {
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address}`)}`;

            return (
              <Link key={index} to={mapUrl} target="_blank" rel="noopener noreferrer">
                <div className="border p-4 rounded-lg h-[450px] shadow-lg transform hover:scale-105 transition-transform duration-300">
                  {loading ? (
                    <div className="h-52 w-full bg-gray-200 animate-pulse rounded mb-4" />
                  ) : (
                    <>
                      {hotel.imageUrls.length > 0 ? (
                        <img
                          src={hotel.imageUrls[0]}
                          alt={hotel.name}
                          className="w-full h-52 object-cover rounded mb-4"
                        />
                      ) : (
                        <img
                          src={'placeholder-image-url.jpg'}
                          alt={hotel.name}
                          className="w-full h-52 object-cover rounded mb-4"
                        />
                      )}
                    </>
                  )}
                  <h2 className="font-bold text-xl mb-2">{hotel.name}</h2>
                  <h3 className="font-semibold text-lg text-gray-700">{hotel.price}</h3>
                  <p className="text-yellow-500 mb-2">
                    {hotel.rating ? `${hotel.rating} ⭐` : 'No Rating'}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">{hotel.address}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-700">No hotels available for this trip.</p>
        )}
      </div>
    </div>
  );
}

export default Hotels;
