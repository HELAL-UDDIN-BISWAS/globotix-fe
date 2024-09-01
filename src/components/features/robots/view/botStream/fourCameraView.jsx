import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Button from "@/components/common/button";
import CameraView from "./camera-four-images";

import { FaExpand, FaCompress } from "react-icons/fa";
import styles from "./cameraVideoView.module.css";
const FourCameraView = (props) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
  };

  const handleDelete = () => {
    if (props.loading) return;
    props.onDelete();
  };

  return (
    <>
      {props.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 disabled">
          <div className="flex flex-col  bg-white rounded-[10px] shadow-lg w-[90%] sm:w-[70%] h-[80vh] z-50">
            {/* <div className="flex items-center mb-0 px-6">
              <h2 className="text-base w-11/12  font-bold text-center text-gray-900">
                Internal Notes
              </h2>
              <div className="ml-auto">
                <button onClick={onClose}>
                  <Crossicon />
                </button>
              </div>
            </div> */}
            <div className="flex items-center mb-0 px-6 justify-between px-[15px] pt-[10px]">
              <h2 className="text-base font-bold text-gray-900">
                Record Videos
              </h2>
              <div className="ml-auto">
                <button onClick={() => handleClose()}>
                  <RxCross1 />
                </button>
              </div>
            </div>
            {/* <div className="flex cursor-pointer ml-auto px-[15px] pt-[5px]">
              <div className="flex items-start justify-start cursor-pointer">
                <label>Record Videos</label>
              </div>
              <div
                className="flex items-end justify-end cursor-pointer"
                onClick={() => handleClose()}
              >
                <RxCross1 />
              </div>
            </div> */}
            <div className="p-4  ">
              <div class={styles.imageGrid}>
                <div class={styles.imageContainer}>
                  <div class={styles.expandIconNameBox}>FrontCam 01</div>
                  <img src="/upload/images/imageTL.png" alt="Image 1" />
                  <div class={styles.expandIconBox}>
                    {isFullScreen ? (
                      <FaCompress
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    ) : (
                      <FaExpand
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    )}
                  </div>
                </div>
                <div class={styles.imageContainer}>
                  <div class={styles.expandIconNameBox}>FrontCam 02</div>
                  <img src="/upload/images/imageTR.png" alt="Image 2" />
                  <div class={styles.expandIconBox}>
                    {isFullScreen ? (
                      <FaCompress
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    ) : (
                      <FaExpand
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    )}
                  </div>
                </div>
                <div class={styles.imageContainer}>
                  <div class={styles.expandIconNameBox}>HindCam 01</div>
                  <img src="/upload/images/imageBL.png" alt="Image 3" />
                  <div class={styles.expandIconBox}>
                    {isFullScreen ? (
                      <FaCompress
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    ) : (
                      <FaExpand
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    )}
                  </div>
                </div>
                <div class={styles.imageContainer}>
                  <div class={styles.expandIconNameBox}>HindCam 02</div>
                  <img src="/upload/images/imageBR.png" alt="Image 4" />
                  <div class={styles.expandIconBox}>
                    {isFullScreen ? (
                      <FaCompress
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    ) : (
                      <FaExpand
                        size={25}
                        color="#ffffff"
                        className="expandIcon"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FourCameraView;
