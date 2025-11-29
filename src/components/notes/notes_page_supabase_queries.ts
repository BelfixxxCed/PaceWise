import supabase from "@/supabase/supabase_client"



export const GET_subjects = async () => {
    const {data, error} = await supabase
        .from("subjects")
        .select("subject_id, subject_name, date_created");

    if(error){
        console.log("Error in getting subjects: ", error.message);
        return;
    }

    const fixed_datetime = data.map(each => {
        return {
            ...each,
            date_created_difference : timeAgo(each.date_created),
            date_created : formatDate(each.date_created)
        }
    })

    console.log("Datetime: ", fixed_datetime);
    return fixed_datetime
}


const timeAgo = (timestamp: string | Date): string => {
  const now = new Date().getTime(); // convert to milliseconds
  const past = new Date(timestamp).getTime(); // convert to milliseconds

  // Difference in seconds
  const diff = Math.floor((now - past) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;  // approximation
  const year = 365 * day;  // approximation

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  if (diff < month) {
    const days = Math.floor(diff / day);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  if (diff < year) {
    const months = Math.floor(diff / month);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  const years = Math.floor(diff / year);
  return years === 1 ? "1 year ago" : `${years} years ago`;
};

const formatDate = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  return date.toLocaleDateString("en-US", {
    weekday: "short",   // "Fri"
    year: "numeric",    // "2025"
    month: "short",     // "Oct"
    day: "numeric"      // "11"
  });
};
