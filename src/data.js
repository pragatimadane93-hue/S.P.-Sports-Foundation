export const ACADEMY = {
  name: "S.P. Sports Foundation",
  fullName: "S.P. SPORTS FOUNDATION, KOLHAPUR",
  city: "Kolhapur",
  tagline: "Train Today. Serve the Nation.",
  established: "2 October 2023",
  owner: "Siddhant Suresh Pujari",
  fee: "₹1,200",
  feeAmount: 1200,
  timing: "4:30 PM – 6:30 PM",
  address: "S.P. Sports Foundation, near Shivaji University, Kolhapur, Maharashtra, India",
  contacts: [
    { name: "Siddhant Pujari", tel: "919175570396", display: "+91 9175570396" },
    { name: "Sagar Hajare", tel: "919545250793", display: "+91 9545250793" },
  ],
  instagram: [
    { label: "Siddhant Pujari", url: "https://www.instagram.com/siddhant.pujari.22/" },
    { label: "Satyajeet Pujari (800m)", url: "https://www.instagram.com/satyajeetpujari_800m/" },
  ],
};

// TODO: replace with the academy's real YouTube channel link when ready.
// This is the ONLY place the YouTube link needs to change.
export const YOUTUBE_URL = "https://www.youtube.com/@SPSportsFoundation";

export const PROGRAMS = [
  { icon: "🪖", title: "Indian Army Physical Training", sub: "Army recruitment fitness training" },
  { icon: "⚓", title: "Indian Navy Physical Training", sub: "Navy recruitment fitness training" },
  { icon: "✈️", title: "Indian Air Force Physical Training", sub: "Air Force recruitment fitness training" },
  { icon: "🛡️", title: "Maharashtra Police Bharti Physical Training", sub: "Police recruitment fitness training" },
  { icon: "🎖️", title: "Territorial Army Physical Training", sub: "TA recruitment fitness training" },
  { icon: "🏃", title: "General Physical Fitness Training", sub: "For all staff and competitive exam candidates" },
];

export const wa = (tel, text) => `https://wa.me/${tel}?text=${encodeURIComponent(text)}`;
export const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "S.P. Sports Foundation near Shivaji University Kolhapur"
)}`;
export const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  "S.P. Sports Foundation near Shivaji University Kolhapur"
)}&output=embed`;

// Coach achievements shown in About Us. Shown exactly as listed here — to add or edit an
// achievement, change this list only (the About page builds its cards from it).
export const COACH_ACHIEVEMENTS = [
  { date: "2 September 2024", event: "63rd National Open Athletics Championship", result: "Gold Medal", icon: "🥇" },
  { date: "29 July 2023", event: "31st FISU World University Games, China", result: "Represented India", icon: "🇮🇳" },
  { date: "2 May 2022", event: "2nd Khelo India University Games", result: "Bronze Medal", icon: "🥉" },
  { date: "30 May 2023", event: "3rd Khelo India University Games", result: "Silver Medal", icon: "🥈" },
  { date: "21 February 2021", event: "55th National Cross Country Championship", result: "Gold Medal", icon: "🥇" },
  { date: "10 March 2022", event: "All India Inter University Cross Country", result: "Bronze Medal", icon: "🥉" },
  { date: "12 February 2023", event: "All India Inter University Cross Country Championship", result: "Gold Medal", icon: "🥇" },
];
