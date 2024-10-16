
import React from 'react'
import { Link } from 'react-router-dom'
import CreateTrip from '@/create-trip'

function Hero() {
  return (
<div className='p-10 py-28 md:px-20 md:py-24 lg:px-28 lg:py-28 ' >
<div className="p-32 flex flex-col justify-center items-center text-center bg-cover bg-center bg-[url('/images/pixabyh2.jpg')] shadow-lg bg-opacity-90">
<div className=" inset-0 bg-black bg-opacity-50"> </div>
<h1 className="sm-text-3xl md-text-5xl text-white text-6xl font-bold ">
   Plan Your Dream Adventure Effortlessly with AI 
</h1>
<p className="text-white  mt-8 text-lg">
  Discover personalized travel itineraries tailored just for you.  Explore new destinations, manage your plans, and embark on unforgettable journeys! 
</p>

  <Link to={"/createTrip"}>
  <button className="bg-blue-500 text-white px-6 py-3 rounded mt-6  hover:scale-105 transition-transform duration-300">
  Get Started, It's Free 🚀🎉
</button>

  </Link>
 
</div>
</div>

  
  )
}

export default Hero
