export const budgetOptions = [
  {
    id: 1,
    title: "Low",
    description: "stay conscious of cost",
    logo: "/images/lowBudget.png",
  },
  {
    id: 2,
    title: "Moderate",
    description: "Keep budget on average side",
    logo: "/images/moderate.png",
  },
  {
    id: 3,
    title: "Luxury",
    description: "Do not worry about the budget",
    logo: "/images/luxury.png",
  },
];
export const selectTravelOptions = [
  {
    id: 1,
    title: "just Me",
    description: "A solo travel in exploration",
    people: "1 person",
    logo: "/images/travel1.png",
  },
  {
    id: 2,
    title: "couple",
    description: "Two travels in tandem",
    people: "2 people",
    logo: "/images/travel2.png",
  },
  {
    id: 3,
    title: "Family",
    description: "A group of fun loving",
    people: "3 or 5 people",
    logo: "/images/travel3.jpg",
  },
  {
    id: 4,
    title: "Friends",
    description: "A bunch of thrill seeks",
    people: "more than 2 people",
    logo: "/images/travel4.jpg",
  },
];
export const AI_PROMPT =
  "Generate travel plan for Location :{location},for {noOfDays} Days for {travelList} people  with a {budget} budget give me hotels options list with hotel name hotel address,price,geo coordinates,rating,description ,the correct hotel image url u give and it should work that is the url should work it should be correct based on the hotel name soo main thing give correct hotel image url and suggest itineray with placename,place details,place image url,geo coordinates,ticket pricing time  travel each of the location for {noOfDays} days with each day plan with best time to visit,hotel amenities,total estimated cost,local transportation info and weather info give me in the jSON format";
