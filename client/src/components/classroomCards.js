
const ClassroomCard = ({data}) => {       

    return(
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img class="w-full" src="https://myviewboard.com/blog/wp-content/uploads/2020/08/MP0027-01-770x515.jpg" alt="Sunset in the mountains" />
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{data.title}</div>
          <p class="text-gray-700 text-base">
           Time
          </p>
        </div>
        <div class="mx-auto text-center">
          <button type="button" class="inline-block bg-secondary rounded-lg px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Join Classroom</button>
        </div>
        </div>
    )

}


export default ClassroomCard;