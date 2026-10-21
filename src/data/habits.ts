import { habitColors } from "@/theme";
import type { Habit } from "@/types";

export const initialHabits: Habit[] = [
  {
    id: "water",
    name: "Drink a glass of water",
    time: "8:00 AM",
    icon: "water",
    color: habitColors.water,
    completed: true,
  },
  {
    id: "reading",
    name: "Read for 20 minutes",
    time: "9:00 AM",
    icon: "book",
    color: habitColors.reading,
    completed: false,
  },
  {
    id: "movement",
    name: "Morning movement",
    time: "10:30 AM",
    icon: "fitness",
    color: habitColors.movement,
    completed: false,
  },
  {
    id: "journal",
    name: "Write in your journal",
    time: "8:00 PM",
    icon: "journal",
    color: habitColors.journal,
    completed: false,
  },
];

export const weeklyActivity = [true, true, true, false, true, true, true];
