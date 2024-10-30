// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "application/json",
// };

// export const chatSession = model.startChat({
//   generationConfig,
//   history: [
//     {
//       role: "user",
//       parts: [
//         {
//           text: '"generate travel plan for location:las vegas for 3 days for couple with a cheap budget, give me hotel options list with hotel name, hotel address, price, hotel image url, geo coordinates, rating, description, and suggested itinerary with place name, place details, place image url, geo coordinates, ticket pricing, time to travel each of the locations for 3 days, with each day plan, and the best time to visit, in JSON format. Include hotel amenities, local transportation info, weather info, and total estimated cost The response data should be strict in Json format"',
//         },
//       ],
//     },
//     // {
//     //   role: "model",
//     //   parts: [
//     //     {
//     //       text: '```json\n{\n  "travel_plan": {\n    "location": "Las Vegas, Nevada",\n    "duration": "3 days",\n    "travelers": "Couple",\n    "budget": "Cheap",\n    "hotels": [\n      {\n        "name": "The D Las Vegas",\n        "address": "301 Fremont Street, Las Vegas, NV 89101",\n        "price": "$50 - $80 per night",\n        "image_url": "https://www.the-d.com/media/wysiwyg/The-D-Hotel-Las-Vegas-Exterior.jpg",\n        "geo_coordinates": "36.1695,-115.1428",\n        "rating": "3.5 stars",\n        "description": "A budget-friendly casino hotel in the heart of Fremont Street.",\n        "amenities": ["Casino", "Pool", "Restaurant", "Bar", "Fitness center", "Free Wi-Fi"]\n      }\n    ],\n    "itinerary": [\n      {\n        "day": "Day 1",\n        "plan": [\n          {\n            "time": "Morning",\n            "place": "Fremont Street Experience",\n            "details": "A pedestrian mall with a canopy of LED lights and street performers.",\n            "geo_coordinates": "36.1695,-115.1428",\n            "ticket_pricing": "Free"\n          }\n        ]\n      }\n    ],\n    "local_transportation": "Monorail, ride-sharing, and public buses.",\n    "weather_info": "Hot, dry summers and mild winters.",\n    "estimated_cost": {\n      "total": "$370 - $640"\n    }\n  }\n}\n```'
//     //     }
//     //   ]
//     // }
//     {
//       role: "model",
//       parts: [
//         {
//           text: '```json\n{\n  "travel_plan": {\n    "location": "Las Vegas, Nevada",\n    "duration": "3 days",\n    "travelers": "Couple",\n    "budget": "Cheap",\n    "hotels": [\n      {\n        "name": "The D Las Vegas",\n        "address": "301 Fremont Street, Las Vegas, NV 89101",\n        "price": "$50 - $80 per night",\n        "image_url": "https://www.the-d.com/media/wysiwyg/The-D-Hotel-Las-Vegas-Exterior.jpg",\n        "geo_coordinates": "36.1695,-115.1428",\n        "rating": "3.5 stars",\n        "description": "A budget-friendly casino hotel in the heart of Fremont Street.",\n        "amenities": ["Casino", "Pool", "Restaurant", "Bar", "Fitness center", "Free Wi-Fi"]\n      }\n    ],\n    "itinerary": [\n      {\n        "day": "Day 1",\n        "plan": [\n          {\n            "time": "Morning",\n            "place": "Fremont Street Experience",\n            "details": "A pedestrian mall with a canopy of LED lights and street performers.",\n            "geo_coordinates": "36.1695,-115.1428",\n            "ticket_pricing": "Free"\n          }\n        ]\n      }\n    ],\n    "local_transportation": "Monorail, ride-sharing, and public buses.",\n    "weather_info": "Hot, dry summers and mild winters.",\n    "estimated_cost": {\n      "total": "$370 - $640"\n    }\n  }\n}\n```'
//         }
//       ]
//     }
//   ]
// });
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "generate travel plan for location: las vegas for 3 days for couple with a cheap budget. Provide hotel options in JSON format with the following fields: hotel name, hotel address, price, hotel image URL, geo coordinates, rating, description, and suggested itinerary with place name, place details, place image URL, geo coordinates, ticket pricing, time to travel for each location for 3 days. Include hotel amenities, local transportation info, weather info, and total estimated cost. Ensure the response is strict in JSON format."
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `{
  "travel_plan": {
    "location": "Las Vegas, Nevada, USA",
    "duration": "3 days",
    "travelers": "Couple",
    "budget": "Cheap",
    "hotels": [
      {
        "name": "Budget Inn",
        "address": "123 Vegas Blvd, Las Vegas, NV",
        "price": "$50 per night",
        "image_url": "http://example.com/hotel.jpg",
        "geo_coordinates": "36.1699, -115.1398",
        "rating": "3 stars",
        "description": "Affordable hotel with basic amenities."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "plan": [
          {
            "time": "Morning",
            "place": "Famous Landmark",
            "details": "Tour the area.",
            "geo_coordinates": "36.1700, -115.1400",
            "ticket_pricing": "$10",
            "time_to_travel": "2-3 hours"
          }
        ]
      }
    ],
    "local_transportation": "Buses, rental scooters, ride-shares.",
    "weather_info": "Dry, warm climate.",
    "estimated_cost": {
      "attractions": "$50",
      "food": "$30 per day",
      "hotel": "$150",
      "total": "$300",
      "transportation": "$20"
    }
  }
}`
        }
      ]
    }
  ]
});

// Process the response
const response = chatSession;

// Check if the response contains the expected structure
if (response && response.response && response.response.text) {
  const tripDataString = response.response.text; // Extract the string containing the JSON
  console.log("Trip Data before parsing:", tripDataString); // Log the raw string for debugging

  let tripData;

  try {
    // Parse the JSON string into an object
    tripData = JSON.parse(tripDataString);
    console.log("Trip Data:", tripData); // Log the parsed trip data
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
} else {
  console.error("Unexpected response structure:", response);
}








