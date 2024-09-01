import { RxCross1 } from "react-icons/rx";
import InfoDisplay from "../../dashboard/view/InfoDisplay";
import moment from "moment";
import Button from "@/components/common/button";
import { Text } from "@/components/ui/typo";
import { useRouter } from "next/navigation";
import useZonesByLocation from "@/hooks/useZonesByLocation";
import LocationImageView from "./location-image.view";
import { FaInfoCircle } from "react-icons/fa";
import { Box, Flex } from "@radix-ui/themes";
import useAuth from "@/hooks/useAuth";
import ROLE from "@/const/role";
import { useEffect } from "react";

const ViewLocationModal = (props) => {
  const router = useRouter();
  const { user } = useAuth();

  const { setLocation, getZoneByLocation, locationZones } =
    useZonesByLocation();

  const fetchZones = async () => {
    await getZoneByLocation(parseInt(props?.viewItem.id));
  };

  useEffect(() => {
    if (props.viewItem.id) {
      fetchZones();
    }
  }, [props.viewItem]);

  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
  };

  return (
    <>
      {props.open && (
        <div
          onClick={() => handleClose()}
          className="bg-black/75 fixed w-full h-screen top-0 left-0 z-[997] opacity-40 transition-all"
        ></div>
      )}
      <div
        className={`transition-all duration-500 fixed z-[999] ${
          props.open ? "bottom-1/2 translate-y-1/2" : "-bottom-[1000px]"
        } left-1/2 -translate-x-1/2 px-[30px] rounded-[20px] min-w-[500px] w-[90%] h-[90%]  bg-white text-black-1 overflow-auto`}
      >
        <div className="overflow-visible">
          <div className="font-bold text-xl">
            <div
              onClick={() => handleClose()}
              className="flex items-end justify-end cursor-pointer pt-3"
            >
              <RxCross1 />
            </div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-bodyTextColor">
                  General Information
                </p>
                <div className="text-left">
                  <InfoDisplay
                    caption="Building Name"
                    value={props?.viewItem?.building?.name}
                  />
                  <InfoDisplay
                    caption="Location Name"
                    value={props?.viewItem?.name}
                  />

                  <InfoDisplay caption="Map" value={props?.viewItem?.mapName} />
                  <InfoDisplay
                    caption="Last Modified Date"
                    value={moment(
                      new Date(props?.viewItem?.lastUpdated?.slice(0, -1))
                    ).format("DD/MM/YYYY HH:mm:ss")}
                  />
                </div>
              </div>
              {user?.role?.toLocaleLowerCase() !=
                ROLE.USER.toLocaleLowerCase() && (
                <Button
                  onClick={() => {
                    props.setIsZoneManagement(true);
                    props.setSelectedLocation(props.viewItem);
                    setLocation(props.viewItem);
                  }}
                >
                  <Text className="text-white">Edit Zone</Text>
                </Button>
              )}
            </div>
          </div>

          <LocationImageView zone={locationZones} location={props.viewItem} />
        </div>
      </div>
    </>
  );
};

export default ViewLocationModal;
