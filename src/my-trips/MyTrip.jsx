import { db } from '@/firebaseSDK/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCard from './UserTripCard';

function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetUserTrip();
  }, []);

  const GetUserTrip = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate("/");
      return;
    }

    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
    setUserTrips([]);
    const querySnapshot = await getDocs(q);
    const trips = querySnapshot.docs.map(doc => doc.data());
    setUserTrips(trips);
  }

  return (
    <div className="p-6 md:px-10 md:py-20 lg:px-20 lg:py-24">
      <h2 className="text-gray-800 text-3xl font-bold text-start mb-6">My Trips</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
        {
          userTrips.length > 0 ? (
            userTrips.map((trip, id) => (
              <UserTripCard key={id} trip={trip} />
            ))
          ) : (
            <p className="text-gray-600 text-center text-2xl col-span-1 md:col-span-2 lg:col-span-3">
              No trips found. Please create a trip.
            </p>
          )
        }
      </div>
    </div>
  );
}

export default MyTrip;
