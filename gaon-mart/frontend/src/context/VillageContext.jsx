import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const VillageContext = createContext(null);

export function VillageProvider({ children }) {
  const [villages, setVillages] = useState([]);
  const [village, setVillageState] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/villages")
      .then((data) => {
        setVillages(data.villages);
        const savedId = localStorage.getItem("gaonmart_village");
        const found = data.villages.find((v) => v.id === savedId);
        if (found) {
          setVillageState(found);
        } else {
          setPickerOpen(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function setVillage(v) {
    setVillageState(v);
    localStorage.setItem("gaonmart_village", v.id);
    setPickerOpen(false);
  }

  return (
    <VillageContext.Provider
      value={{ villages, village, setVillage, pickerOpen, setPickerOpen, loading }}
    >
      {children}
    </VillageContext.Provider>
  );
}

export function useVillage() {
  return useContext(VillageContext);
}
