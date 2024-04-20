import {
  GiSpellBook, // Beginner
  GiChessPawn, // Novice
  GiBreakingChain, // Developer
  GiCircuitry, // Engineer
  GiArchBridge, // Architect
  GiSpiderWeb, // Hacker
  GiMasterOfArms, // Master
  GiBrain, // Expert
  GiWizardStaff, // Guru
  GiChampions, // Champion
  GiLaurelsTrophy, // Legend
  GiElectric, // Plug
  GiCheckedShield, // Pro
} from "react-icons/gi";

const titleMapping = [
  { title: "Beginner", icon: <GiSpellBook />, color: "#78909c" }, 
  { title: "Novice", icon: <GiChessPawn />, color: "#66bb6a" }, 
  { title: "Developer", icon: <GiBreakingChain />, color: "#42a5f5" }, 
  { title: "Engineer", icon: <GiCircuitry />, color: "#7e57c2" }, 
  { title: "Architect", icon: <GiArchBridge />, color: "#ef5350" },
  { title: "Hacker", icon: <GiSpiderWeb />, color: "#26a69a" }, 
  { title: "Master", icon: <GiMasterOfArms />, color: "#ffa726" }, 
  { title: "Expert", icon: <GiBrain />, color: "#ab47bc" }, 
  { title: "Guru", icon: <GiWizardStaff />, color: "#ec407a" }, 
  { title: "Champion", icon: <GiChampions />, color: "#d4e157" }, 
  { title: "Legend", icon: <GiLaurelsTrophy />, color: "#ffd600" }, 
  { title: "Plug", icon: <GiElectric />, color: "#8d6e63" }, 
  { title: "Pro", icon: <GiCheckedShield />, color: "#29b6f6" }, 
];

export function getTitleAttribute(title, flag) {
  const normalizedTitle = title?.toLowerCase();
  const titleObj = titleMapping.find(
    (obj) => obj.title?.toLowerCase() === normalizedTitle
  );

  if (!titleObj) {
    return "Title not found";
  }

  return flag === 1 ? titleObj.icon : titleObj.color;
}
