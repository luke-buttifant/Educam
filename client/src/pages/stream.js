import {React, useState} from "react"
import "../App.css"
import VideoFeed from "../components/getVideoFeed";
import {BsFillPlusCircleFill, BsThreeDots} from 'react-icons/bs'
import {BiSend} from 'react-icons/bi'
import {FiPhone} from 'react-icons/fi'
import {AiOutlineAudioMuted, AiOutlineUserAdd} from 'react-icons/ai'
import dp from '../images/dp.png'
import ChatMessage from "../components/chat.js";

const Stream = () =>{
  return (
      <>
      <div className="grid grid-cols-3">
      <div className="col-span-2 mt-32 mx-5">
        <div><VideoFeed className="rounded-lg" />
        <div className="max-w-[80%] mx-auto">
        <div className="grid grid-cols-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full mt-5"><AiOutlineAudioMuted size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-red-400 rounded-full mt-5"><FiPhone size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mt-5 text-green-400"><AiOutlineUserAdd size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mt-5"><BsThreeDots size={40} className="mx-auto text-center mt-5 p-2"/></div>
        </div>
        </div>
        </div>
        </div>
        <div className="rounded-lg min-w-max max-h-[70%] shadow-lg">
        <div className="chat h-[100%] bg-white dark:bg-dark-mode-secondary relative overflow-auto noScrollBar">
            <div className="grid grid-cols-3 items-center">
            <div className=" col-span-2 mt-10"><h1 className="font-bold text-xl text-gray-400 ml-10 text-center">Dissertation - COM616</h1></div>
            <div className="text-secondary mx-auto mt-10"><BsFillPlusCircleFill size={50}/></div>

            </div>
            <div className="items-center mt-2">
                <h2 className="mx-auto text-center font-bold text-secondary mb-2">CHAT</h2>
                <div className="w-full border-t border-4 border-secondary"></div>
            </div>
            
            <div class="flex flex-col divide-y">
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            </div>


        </div>
        <div className="justify-center flex bottom-2 right-10  w-[100%] mx-auto bg-white dark:bg-dark-mode-secondary">
                <input type="text" className="mx-auto min-w-[90%] bg-secondary text-white p-4 rounded-lg m-2" placeholder="Message..."></input>
                <button className="p-2 dark:text-white"><BiSend size={38}/></button>
                </div>

        </div>
        </div>


    </>
  );
}
export default Stream;