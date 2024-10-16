// import React from 'react'
// import { AI_PROMPT } from '@/constants/budget';
// import { chatSession } from '@/service/AiModel';
// import { toast } from 'sonner';
// import { createContext } from 'react';

// export const GlobalContext=createContext()

// function GenerateHandler({formData,openDialog,setOpenDialog}) {
//     const generateHandler = async () => {
       
      
//         const user = localStorage.getItem("user");
//         if (!user) {
//           setOpenDialog(true);
//         }
    
//         if (
//           !formData.location ||
//           !formData.noOfDays ||
//           !formData.budget ||
//           !formData.travelList
//         ) {
//           toast("please enter all the details");
//         }
//         const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location)
//           .replace("{noOfDays}", formData?.noOfDays)
//           .replace("{travelList}", formData?.travelList)
//           .replace("{budget}", formData?.budget);
//         // console.log(FINAL_PROMPT);
//         const result = await chatSession.sendMessage(FINAL_PROMPT);
//         // console.log("result is", result?.response?.text());
//       };
//   return (
//     <GlobalContext.Provider value={
//         {generateHandler:generateHandler}
//     }>

//     </GlobalContext.Provider>
//   )
// }

// export default GenerateHandler
