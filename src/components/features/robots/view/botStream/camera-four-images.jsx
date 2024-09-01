"use client";
import React, { useEffect, useState } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";
import styles from "./cameraView.module.css";

const CameraView = ({ cameras }) => {
  const [isFullScreen, setIsFullScreen] = useState(true);
  useEffect(() => {}, [cameras]);

  return (
    <div className="p-4  ">
      <div class={styles.imageGrid}>
        <div class={styles.imageContainer}>
          <div class={styles.expandIconBox}>FrontCam 01</div>
          {/* <img src="/upload/images/imageTL.png" alt="Image 1" /> */}
          <img src={cameras.cam_front} alt="Image 1" />
          {/* <div class={styles.expandIconBox}>
            {isFullScreen ? (
              <FaCompress size={25} color="#ffffff" className="expandIcon" />
            ) : (
              <FaExpand size={25} color="#ffffff" className="expandIcon" />
            )}
          </div> */}
        </div>
        <div class={styles.imageContainer}>
          <div class={styles.expandIconBox}>FrontCam 02</div>
          {/* <img src="/upload/images/imageTR.png" alt="Image 2" /> */}
          <img src={cameras.cam_back} alt="Image 2" />
          {/* <div class={styles.expandIconBox}>
            {isFullScreen ? (
              <FaCompress size={25} color="#ffffff" className="expandIcon" />
            ) : (
              <FaExpand size={25} color="#ffffff" className="expandIcon" />
            )}
          </div> */}
        </div>
        <div class={styles.imageContainer}>
          <div class={styles.expandIconBox}>HindCam 01</div>
          {/* <img src="/upload/images/imageBL.png" alt="Image 3" /> */}
          <img src={cameras.cam_left} alt="Image 3" />
          {/* <div class={styles.expandIconBox}>
            {isFullScreen ? (
              <FaCompress size={25} color="#ffffff" className="expandIcon" />
            ) : (
              <FaExpand size={25} color="#ffffff" className="expandIcon" />
            )}
          </div> */}
        </div>
        <div class={styles.imageContainer}>
          <div class={styles.expandIconBox}>HindCam 02</div>
          {/* <img src="/upload/images/imageBR.png" alt="Image 4" /> */}
          <img src={cameras.cam_right} alt="Image 4" />
          {/* <div class={styles.expandIconBox}>
            {isFullScreen ? (
              <FaCompress size={25} color="#ffffff" className="expandIcon" />
            ) : (
              <FaExpand size={25} color="#ffffff" className="expandIcon" />
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CameraView;
