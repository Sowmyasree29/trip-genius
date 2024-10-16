import React, { useEffect, useState } from 'react';
import { IoIosTime } from "react-icons/io";
import { FcMoneyTransfer } from "react-icons/fc";
import { Link } from 'react-router-dom';
import axios from 'axios';

function Itinerary({ trip }) {
  const [hotelImages, setHotelImages] = useState({});
  const [loading, setLoading] = useState(true); // State to track loading status
  const API_KEY = import.meta.env.VITE_APP_PIXABY_API_KEY; // Accessing the API key

  const fetchHotelImages = async () => {
    if (!trip?.tripData?.travel_plan?.itinerary) return; // Ensure itinerary exists

    const promises = trip.tripData.travel_plan.itinerary
      .filter(day => Array.isArray(day.plan)) // Ensure day.plan exists and is an array
      .flatMap(day => 
        day.plan.map(async (plan) => {
          const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(plan.place)}&image_type=photo&per_page=3`;

          try {
            const response = await axios.get(url);
            return {
              name: plan.place,
              imageUrl: response.data.hits[0]?.largeImageURL || null,
            };
          } catch (error) {
            console.error("Error fetching hotel images from Pixabay:", error);
            return { name: plan.place, imageUrl: null };
          }
        })
      );

    const images = await Promise.all(promises);
    const imageMap = images.reduce((acc, { name, imageUrl }) => {
      acc[name] = imageUrl;
      return acc;
    }, {});

    setHotelImages(imageMap);
    setLoading(false); // Set loading to false after fetching
  };

  useEffect(() => {
    fetchHotelImages();
  }, [trip]);

  return (
    <div className="p-5 bg-white mt-16">
      <h2 className="text-lg font-bold mb-4">Places to Visit</h2>
      <div className="grid grid-cols-1 gap-6">
        {trip?.tripData?.travel_plan?.itinerary?.map((day, index) => (
          <div key={index} className="bg-white border rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">{day.day}</h3>
            
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {day.plan && day.plan.map((plan, idx) => { 
                const imageUrl = hotelImages[plan.place]; 

                return (
                  imageUrl && ( 
                    <Link 
                      key={idx} 
                      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.place)}`} 
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      <div className="bg-gray-100 border p-2 rounded-md hover:bg-gray-50">
                        {}
                        {loading ? (
                          <div className="h-[100px]  bg-gray-200 animate-pulse rounded-md mb-2" />
                        ) : (
                          <img 
                            src={imageUrl} 
                            alt={plan.place} 
                            className="w-full h-56 object-fit rounded-md mb-2" 
                          />
                        )}
                        <h4 className="text-lg font-semibold">{plan.place}</h4>
                        <p className="text-sm text-gray-600 flex items-center"><IoIosTime className="mt-1 mr-1" /><b>{plan.time}</b></p>
                        <p className="text-sm text-gray-600 flex items-center"><FcMoneyTransfer className="mt-1 mr-1"/><b>Ticket Pricing: </b>{plan.ticket_pricing}</p>
                        <p className="text-sm text-gray-600 flex items-center"><b>Travel Time:</b> {plan.time_to_travel}</p>
                      </div>
                    </Link>
                  )
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Itinerary;
