import { Scheduler } from "@aldabil/react-scheduler";
// import { EVENTS } from "./events";

// export default function App() {
//   const fetchRemote = async (query) => {
//     console.log("Query: ", query);
//     /**Simulate fetchin remote data */
//     return new Promise((res) => {
//       setTimeout(() => {
//         res(EVENTS);
//       }, 3000);
//     });
//   };

//   const handleConfirm = async (event, action) => {
//     console.log(event, action);
//     if (action === "edit") {
//       /** PUT event to remote DB */
//     } else if (action === "create") {
//       /**POST event to remote DB */
//     }
//     /**
//      * Make sure to return 4 mandatory fields:
//      * event_id: string|number
//      * title: string
//      * start: Date|string
//      * end: Date|string
//      * ....extra other fields depend on your custom fields/editor properties
//      */
//     // Simulate http request: return added/edited event
//     return new Promise((res, rej) => {
//       setTimeout(() => {
//         res({
//           ...event,
//           event_id: event.event_id || Math.random()
//         });
//       }, 3000);
//     });
//   };

//   const handleDelete = async (deletedId) => {
//     // Simulate http request: return the deleted id
//     return new Promise((res, rej) => {
//       setTimeout(() => {
//         res(deletedId);
//       }, 3000);
//     });
//   };

//   return (
//     <Scheduler
//       remoteEvents={fetchRemote}
//       onConfirm={handleConfirm}
//       onDelete={handleDelete}
//       selectedDate={new Date(2021, 4, 5)}
//     />
//   );
// }


const Calendar = () =>{

    return (
        <>
        <div className="p-10">
        <Scheduler
  view="month"
  events={[
    {
      event_id: 1,
      title: "Event 1",
      start: new Date("2022 3 16 09:30"),
      end: new Date("2022 3 16 10:30"),
    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date("2021 5 4 10:00"),
      end: new Date("2021 5 4 11:00"),
    },
  ]}
/>
      <div className="mx-auto w-max">
        <button className="bg-primary px-6 py-2 text-2xl text-white dark:bg-white dark:text-primary font-bold shadow-lg rounded-lg m-10" type="button">Create Classroom</button>
      </div>
      </div>
      </>
    );
  }
  export default Calendar;