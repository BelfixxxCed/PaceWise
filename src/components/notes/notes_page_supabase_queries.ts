import supabase from "@/supabase/supabase_client";

export const GET_subjects = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select("subject_id, subject_name, date_created, notes_pages (updated_at)");

  if (error) {
    console.log("Error in getting subjects: ", error.message);
    return;
  }

  const fixed_datetime = data.map((each) => {
    const latestUpdatedAt =
      Array.isArray(each.notes_pages) && each.notes_pages.length > 0
        ? each.notes_pages
            .map((np) => new Date(np.updated_at).getTime())
            .sort((a, b) => b - a)[0]
        : undefined;

    const updatedAtDate = latestUpdatedAt
      ? new Date(latestUpdatedAt)
      : each.date_created;
    return {
      ...each,
      date_updated_difference: timeAgo(updatedAtDate),
      date_created: formatDate(each.date_created),
    };
  });

  return fixed_datetime;
};

const toUTC = (timestamp: string | Date): number => {
  if (timestamp instanceof Date) return timestamp.getTime();
  // Supabase returns timestamps without timezone suffix — force UTC parsing
  const ts = /[Zz]|[+-]\d{2}:?\d{2}$/.test(timestamp) ? timestamp : timestamp + "Z";
  return new Date(ts).getTime();
};

const timeAgo = (timestamp: string | Date): string => {
  const now = new Date().getTime();
  const past = toUTC(timestamp);

  const diff = Math.floor((now - past) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

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
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
