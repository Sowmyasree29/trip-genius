import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { budgetOptions, selectTravelOptions, AI_PROMPT } from "@/constants/budget";
import { toast } from "sonner";
import { chatSession } from "@/service/AiModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseSDK/firebase-config";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  let debounceTimeout;

const searchLocation = async (query) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(async () => {
    if (query) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await response.json();
        setSearchResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.log(err);
      }
    }
  }, 2000);  // 3000 ms = 3 seconds
};


  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchLocation(query);
  };

  const handleSelectPlace = (place) => {
    setSearchQuery(place.display_name);
    changeHandler("location", place.display_name);
    setShowDropdown(false);
  };

  const changeHandler = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (formData) console.log("formdata", formData);
  }, [formData]);


const generateHandler = async (e) => {
  e.preventDefault();
  const user = localStorage.getItem("user");
  if (!user) {
    setOpenDialog(true);
    return;
  }

  if (!formData.location || !formData.noOfDays || !formData.budget || !formData.travelList) {
    toast("Please enter all the details");
    return;
  }

  setLoading(true);

  const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
    .replace("{noOfDays}", formData.noOfDays)
    .replace("{travelList}", formData.travelList)
    .replace("{budget}", formData.budget);

  try {
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("Raw result:", result);

    let tripData;
    if (typeof result === 'string') {
      tripData = JSON.parse(result); // Assuming the result is a JSON string
    } else if (typeof result === 'object') {
      tripData = result; // If it's already an object
    } else {
      throw new Error("Unexpected response format");
    }

    // Ensure tripData contains hotels
    if (!tripData.response?.candidates?.length) {
      throw new Error("No hotels found in trip data");
    }

    await SaveAiTrip(tripData);
  } catch (error) {
    console.error("Error generating trip data:", error.message);
    toast(error.message);  // Show the error to the user
  } finally {
    setLoading(false);
  }

};

const SaveAiTrip = async (tripData) => {
  setLoading(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const docId = Date.now().toString();

  try {
    console.log("Trip Data before parsing:", tripData);

    // Safely extract the data you want to save
    const { response } = tripData;
    const sanitizedResponse = {
      candidates: response.candidates,
      usageMetadata: response.usageMetadata,
      text: typeof response.text === 'function' ? response.text() : response.text, // Call the function if it's a function
    };

    await setDoc(doc(db, "AITrips", docId), {
      id: docId,
      userSelection: formData,
      tripData: {
        response: sanitizedResponse // Only save sanitized response
      },
      userEmail: user?.email,
    });
    console.log("trip data", sanitizedResponse);
  } catch (error) {
    console.error("Error saving trip data:", error);
    console.error("Raw trip data:", tripData);
  }
  setLoading(false);
  navigate('/viewTrip/' + docId);
};

    
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Google User Info:", response.data);
    
    
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data); 
  
    
      setOpenDialog(false);
      window.location.reload(); 
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  

  return (
    <>
      <div className="p-10 py-20 md:px-20 md:py-24  lg:px-20 lg:py-24 rounded-2xl">
        <div className="relative px-4 sm:px-6 lg:px-16 xl:px-16 bg-cover bg-center bg-[url('/images/beach1.jpg')]  min-h-screen shadow-lg ">
        <div className=" inset-0 bg-black bg-opacity-30"> </div>
          <div className="p-4 sm:p-10 text-center mt-14">
            <h2 className="font-bold text-2xl sm:text-3xl text-gray-950">
              Plan Your Perfect Getaway 
            </h2>
            <p className="text-gray-950 font-bold mt-4">
              "Share your details, and our intelligent trip planner will create a
              personalized itinerary that aligns with your preferences! 📝📅✨"
            </p>
          </div>

          <div className="mt-10 sm:mt-16 lg:mt-20 xl:mt-24 max-w-7xl mx-auto">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                What is Your Destination Choice?
              </h2>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search for a place"
                className="p-2 w-full sm:w-3/4 border border-gray-300 rounded-md"
              />
            </div>

            {showDropdown && searchResults.length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                {searchResults.map((place) => (
                  <li
                    key={place.place_id}
                    className="cursor-pointer hover:bg-gray-300 p-2"
                    onClick={() => handleSelectPlace(place)}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 sm:mt-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                No of Days you are planning for the Trip?
              </h2>
              <input
                type="number"
                placeholder="ex-3"
                onChange={(event) => changeHandler("noOfDays", event.target.value)}
                className="p-2 w-full sm:w-3/4 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-6 sm:mt-10">
              <p className="text-gray-900 font-bold text-lg sm:text-xl">
                Set Your Budget?
              </p>
              <p className="text-gray-700 text-md sm:text-lg">
                Your budget will determine the activities, transportation, and
                dining options available to you.
              </p>
            </div>

            <div className="mt-6 sm:mt-10">
              <div className="flex flex-wrap gap-4 justify-start md:justify-space-evenly">
                {budgetOptions.map((each, id) => (
                  <div
                    key={id}
                    onClick={() => changeHandler("budget", each.title)}
                    className={`border p-4 sm:p-6 bg-white shadow-lg rounded-lg hover:scale-105 cursor-pointer transition-transform duration-300 h-40 w-full sm:w-80 flex flex-col items-center justify-between ${
                      formData.budget === each.title ? "shadow-lg border-black" : ""
                    }`}
                  >
                    <img src={each.logo} className="h-10 mb-2" alt={each.title} />
                    <h1 className="text-gray-800 font-bold text-md sm:text-xl text-center">
                      {each.title}
                    </h1>
                    <p className="text-gray-700 text-sm sm:text-lg text-center">
                      {each.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Who do you plan on traveling with on your next adventure?
              </h2>
            </div>

            <div className="mt-6 sm:mt-10">
              <div className="flex flex-wrap gap-4">
                {selectTravelOptions.map((each, id) => (
                  <div
                    onClick={() => changeHandler("travelList", each.title)}
                    key={id}
                    className={`border p-4 sm:p-6 bg-white shadow-lg rounded-lg hover:scale-105 cursor-pointer transition-transform duration-300 h-40 w-full sm:w-80 flex flex-col items-center justify-between ${
                      formData.travelList === each.title ? "shadow-lg border-black" : ""
                    }`}
                  >
                          <img src={each.logo} className="h-10 mb-2" alt={each.title} />
                    <h1 className="text-gray-800 font-bold text-md sm:text-xl text-center">
                      {each.title}
                    </h1>
                    <p className="text-gray-700 text-sm sm:text-lg text-center">
                      {each.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 sm:mt-14 flex justify-end p-6 sm:p-10">
            <button
              onClick={generateHandler}
              className="mt-8 p-4 bg-blue-600  from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin mx-auto" />
              ) : (
                 "Generate Trip Plan ✈️"
              )}
            </button>
            </div>
          </div>
        </div>

        {/* Dialog for Google Sign-In */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button className="hidden" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign In to Continue</DialogTitle>
              <DialogDescription>
                You need to sign in with your Google account to save your trip.
              </DialogDescription>
            </DialogHeader>
            <button
              className="flex items-center border p-2 rounded-md hover:bg-gray-100"
              onClick={() => login()}
            >
              <FcGoogle className="mr-2" /> Sign in with Google
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default CreateTrip;
