"use client";
import Image from 'next/image';
import { Checks } from "@phosphor-icons/react";

type User = {
  name: string;
  message: string;
  image: string;
  date: string;
  isSeen: boolean;
  lastSeen: string
};

const DM = ({ user }: { user: User }) => {
  return (
    <div className='flex gap-4 hover:cursor-pointer hover:bg-white/15 hover:rounded-lg p-2'>
      <div className='relative w-[50px] h-[50px] flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
        <Image
          width={50}
          height={50}
          src={user.image}
          alt='texter Image'
          className=' w-full h-full'
          // className='border-red-300 rounded-full border-2'

        />
      </div>
      <div className='flex flex-col'>
        <span>{user.name}</span>
        <span className='text-gray-400 h-6 truncate max-w-44 text-sm'>{user.message}</span>
      </div>
      <div className='flex flex-col ml-auto'>
        <span className='text-sm text-gray-400'>{user.date}</span>
        {!user.isSeen && (
          <Checks
            width={16}
            height={16}
            className='fill-blue-400 ml-auto'
          />
        )}
      </div>
    </div>
  );
};

export default DM;


// const DM = ({ user }: { user: User }) => {
//   return (
//     <div className='flex gap-4 hover:cursor-pointer hover:bg-white/15 hover:rounded-lg p-2'>
//       {/* Fixed image container - SOLUTION 1: Force exact size */}
//       <div className='relative w-[50px] h-[50px] flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
//         <Image
//           width={50}
//           height={50}
//           src={user.image}
//           alt='texter Image'
//           className='object-cover w-full h-full'
//         />
//       </div>
      
//       {/* Message content */}
//       <div className='flex flex-col flex-1 min-w-0'>
//         <span className='truncate'>{user.name}</span>
//         <span className='text-gray-400 h-6 truncate max-w-44 text-sm'>
//           {user.message}
//         </span>
//       </div>
      
//       {/* Date and status */}
//       <div className='flex flex-col items-end justify-between flex-shrink-0'>
//         <span className='text-sm text-gray-400'>{user.date}</span>
//         {!user.isSeen && (
//           <div className='flex items-center justify-center mt-1'>
//             <Checks 
//               width={16} 
//               height={16} 
//               className='text-blue-400' 
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default DM;
