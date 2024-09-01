"use client";
import { useEffect, useState } from "react";

import LocationView from "@/components/features/location/view/location.view";
import ZoneMainView from "./zone-management/zone.main.view";
import { v4 as uuidv4 } from "uuid";
import useZonesByLocation from "@/hooks/useZonesByLocation";

export default function CleaningPlanPage() {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);

  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedLocationZone, setSelectedLocationZone] = useState();
  const [isZoneManagement, setIsZoneManagement] = useState(false);
  const [refresh, setRefresh] = useState("");

  const handleRefresh = () => {
    const uuid = uuidv4();
    setRefresh(uuid);
  };

  const { getZoneByLocation, locationZones: data } = useZonesByLocation();

  const fetchZones = async () => {
    await getZoneByLocation(parseInt(selectedLocation?.id));
  };

  useEffect(() => {
    if (selectedLocation?.id) {
      fetchZones();
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (data) {
      setSelectedLocationZone(data);
    }
  }, [data]);

  return (
    <>
      {isZoneManagement ? (
        <ZoneMainView
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setIsZoneManagement={setIsZoneManagement}
          handleRefresh={handleRefresh}
          selectedLocationZone={selectedLocationZone}
        />
      ) : (
        !isSSR && (
          <LocationView
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setIsZoneManagement={setIsZoneManagement}
            refresh={refresh}
          />
        )
      )}
    </>
  );
}
