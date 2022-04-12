import React, {useEffect} from 'react'

const ChatMessage = ({dp, name, message, time}) => {


  return (
    <div className="grid grid-cols-4 p-2 overflow-x-hidden max-w-[100%]">
    <div className="col-span-1"><img className="rounded-full w-20 mx-auto mt-4" src={dp}></img></div>
    <div className="col-span-2">
        <div className="flex flex-col mt-5 mb-2">
          <div className="name text-2xl font-bold dark:text-white">{name}</div>
          <div className="message dark:text-white max-w-[100px]"><div className='max-w-max'>{message}</div></div>
        </div>
   </div>
   <div className="col-span-1 mt-10 text-gray-400 float-right ml-10">
       {time}
   </div>
</div>
  );
}

export default ChatMessage;