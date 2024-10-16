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
import { useNavigate } from 'react-router-dom'

function CreateTrip() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading,setLoading]=useState(false)
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({}); // Initialize as an object
  const [openDialog, setOpenDialog] = useState(false);
  const navigate=useNavigate()
  

  const searchLocation = async (query) => {
    if (query) {
      try {
        const response = await fetch(https://nominatim.openstreetmap.org/search?format=json&q=${query});
        const data = await response.json();
        setSearchResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.log(err);
      }
    }
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

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const generateHandler = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
    }

    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.travelList) {
      toast("please enter all the details");
      return; // Prevent further execution if validation fails
    }
  setLoading(true)
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
      .replace("{noOfDays}", formData.noOfDays)
      .replace("{travelList}", formData.travelList)
      .replace("{budget}", formData.budget);
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("result is", result?.response?.text());
    setLoading(false)
    SaveAiTrip(result?.response?.text())
  };
  // const SaveAiTrip=async (tripData)=>
  // {
  //   setLoading(true)
  //   const user=JSON.parse(localStorage.getItem('user'))
  //   const docId=Date.now().toString()
  //   await setDoc(doc(db, "AITrips", docId), {
  //     id:docId,
  //    userSelection:formData,
  //    tripData:JSON.parse(tripData),
  //    userEmail:user?.email

  //   })
  //   console.log("trip data",tripData)
  //   setLoading(false)
  //   navigate('/viewTrip/'+docId)
    

  // }
  const SaveAiTrip = async (tripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
  
    // If parsing fails, store tripData as a string
    await setDoc(doc(db, "AITrips", docId), {
      id: docId,
      userSelection: formData,
      tripData:JSON.parse(tripData) , // Save as string if it's not a valid JSON
      userEmail: user?.email
    });
  
    console.log("trip data", tripData);
    setLoading(false);
    navigate('/viewTrip/' + docId);
  };
  

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}, {
        headers: {
          Authorization: Bearer ${tokenInfo.access_token},
          Accept: "Application/json",
        },
      })
      .then((resp) => {
        console.log("response", resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
      })
      .catch((err) => {
        console.log("Error fetching user profile", err);
      });
    setOpenDialog(false);
    generateHandler();
  };

  return (
    <>
    <div className="px-24 py-8 rounded-xl">
      <div className="relative px-4 sm:px-6 lg:px-8 xl:px-12 bg-cover bg-center bg-[url('/images/pixaby6.jpg')]  min-h-screen shadow-lg opacity-90">

        <div className="p-4 sm:p-10 text-center mt-14">
          <h2 className="font-bold text-2xl sm:text-3xl text-gray-900">
            Plan Your Perfect Getaway 🏕️🌴
          </h2>
          <p className="text-gray-700 mt-4">
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
                  className={border p-4 sm:p-6 bg-white shadow-lg rounded-lg hover:scale-105 cursor-pointer transition-transform duration-300 h-40 w-full sm:w-80 flex flex-col items-center justify-between ${
                    formData.budget === each.title ? "shadow-lg border-black" : ""
                  }}
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
                  onClick={() => changeHandler("travelList", each.people)}
                  key={id}
                  className={border p-4 sm:p-6 bg-white shadow-lg rounded-lg hover:scale-105 cursor-pointer transition-transform duration-300 h-40 w-full sm:w-80 flex flex-col items-center justify-between ${
                    formData.travelList === each.people ? "shadow-lg border-black" : ""
                  }}
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
            disabled={loading}

              onClick={generateHandler}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              {loading? <AiOutlineLoading3Quarters className="h-7 w-10 animate-spin" />:  "Generate Trip Plan ✈️"}
            
            </button>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-bold text-lg">
                  Login to Continue
                </DialogTitle>
                <DialogDescription>
                  You need to log in to access this feature.
                </DialogDescription>
              </DialogHeader>
              <button
                onClick={() => login()}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                <FcGoogle className="mr-2" />
                Login with Google
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      </div>
    </>
  );
}