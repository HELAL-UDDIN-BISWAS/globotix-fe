"use client";

import React, { useEffect, useState } from "react";
import ZoneView from "./zone.view";
import CreateZoneView from "./create.zone.view";
import useZonesByLocation from "@/hooks/useZonesByLocation";

const ZoneMainView = ({
  selectedLocation,
  selectedLocationZone,
  setSelectedLocation,
  setIsZoneManagement,
  handleRefresh,
}) => {
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const [locationZones, setLocationZones] = useState(selectedLocationZone);

  return (
    <>
      {createZoneOpen ? (
        <CreateZoneView
          setLocationZones={setLocationZones}
          selectedLocation={selectedLocation}
          locationZones={locationZones}
          setCreateZoneOpen={setCreateZoneOpen}
        />
      ) : (
        <ZoneView
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setIsZoneManagement={setIsZoneManagement}
          setCreateZoneOpen={setCreateZoneOpen}
          locationZones={locationZones}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
};
export default ZoneMainView;
