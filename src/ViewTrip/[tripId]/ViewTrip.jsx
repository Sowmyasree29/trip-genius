
import { db } from "@/firebaseSDK/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfoSec from "../infoSec";
import Hotels from "../Hotels";
import Itinerary from "../Itinerary";

function ViewTrip() {
  const [tripData, setTripData] = useState([]);
  const { tripId } = useParams(); 

  const GetTripData = async () => {
    const docref = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docref);
    if (docSnap.exists()) {
      console.log("document data", docSnap.data());
      setTripData(docSnap.data());
    } else {
      console.log("no document found");
    }
  };
  useEffect(() => {
    GetTripData();
  }, [tripId]);

  return (
    <div className="p-10 py-20 md:px-16 md:py-32  lg:px-20 lg:py-32 ">
      <InfoSec trip={tripData}/>
      <Hotels trip={tripData}/>
      <Itinerary trip={tripData}/>
    </div>
  );
}

export default ViewTrip;
