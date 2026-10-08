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

// Built-in program content. Used when the database (table training_programs) is not
// connected or is empty. Once programs exist in Supabase, the website shows those instead.
export const PROGRAMS = [
  {
    id: "army",
    icon: "🪖",
    title: "Indian Army Recruitment Training",
    short: "Fitness, running and stamina preparation for Indian Army recruitment.",
    details: "This program is for candidates who want to prepare physically for Indian Army recruitment.\n\nThe training objective is to build general fitness, endurance, strength and the habit of regular, disciplined practice through guided training at S.P. Sports Foundation.",
    objectives: ["Physical Fitness Training", "Running and Endurance Training", "Strength and Stamina Training", "Discipline and Regular Practice", "Basic recruitment-oriented physical preparation"],
    active: true,
  },
  {
    id: "navy",
    icon: "⚓",
    title: "Indian Navy Recruitment Training",
    short: "Endurance, running and strength preparation for Indian Navy recruitment.",
    details: "This program is for candidates who want to prepare physically for Indian Navy recruitment.\n\nThe training focuses on building endurance, running ability, strength, stamina and general physical fitness through regular, disciplined practice.",
    objectives: ["Endurance", "Running", "Strength", "Stamina", "General physical fitness", "Discipline and regular practice"],
    active: true,
  },
  {
    id: "airforce",
    icon: "✈️",
    title: "Indian Air Force Recruitment Training",
    short: "Running, endurance and fitness preparation for Indian Air Force recruitment.",
    details: "This program is for candidates who want to prepare physically for Indian Air Force recruitment.\n\nThe training focuses on running and endurance, strength and stamina, and general physical fitness, supported by regular practice and discipline.",
    objectives: ["Running and endurance", "Strength and stamina", "General physical fitness", "Regular practice", "Discipline"],
    active: true,
  },
  {
    id: "police",
    icon: "🛡️",
    title: "Maharashtra Police Bharti Training",
    short: "Running, strength, agility and fitness preparation for Maharashtra Police Bharti.",
    details: "This program is for candidates who want to prepare physically for Maharashtra Police Bharti.\n\nThe training focuses on running and endurance, strength, stamina, agility and fitness, with regular physical practice and discipline as recruitment-oriented preparation.",
    objectives: ["Running and endurance training", "Strength and stamina", "Agility and fitness", "Regular physical practice", "Discipline", "Recruitment-oriented physical preparation"],
    active: true,
  },
  {
    id: "ta",
    icon: "🎖️",
    title: "Territorial Army (TA) Training",
    short: "Fitness, running and stamina preparation for Territorial Army (TA) recruitment.",
    details: "This program is for candidates who want to prepare physically for Territorial Army (TA) recruitment.\n\nThe training focuses on physical fitness, running and endurance, strength and stamina, and the habit of regular, disciplined practice.",
    objectives: ["Physical fitness preparation", "Running and endurance", "Strength and stamina", "General fitness", "Discipline and regular practice"],
    active: true,
  },
  {
    id: "general",
    icon: "🏃",
    title: "Physical Training for All Staff and Competitive Examination Candidates",
    short: "General fitness, running, endurance and strength training for staff and competitive examination candidates.",
    details: "This program is for staff members and competitive examination candidates who want to improve their general physical fitness.\n\nThe training covers running, endurance, strength and stamina through regular exercise, with an emphasis on fitness and discipline.",
    objectives: ["General physical fitness", "Running", "Endurance", "Strength", "Stamina", "Regular exercise", "Fitness and discipline"],
    active: true,
  },
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
