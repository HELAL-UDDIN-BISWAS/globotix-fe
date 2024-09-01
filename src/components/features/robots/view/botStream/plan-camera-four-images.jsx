"use client";
import React, { useEffect, useState } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";
import styles from "./cameraView.module.css";

const PlanCameraView = ({ cameras }) => {
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [rotatedLeftImage, setRotatedLeftImage] = useState();
  const [rotatedRightImage, setRotatedRightImage] = useState();

  const rotateBase64Image = (base64Data, degrees) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Data;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to match image dimensions
        const radians = degrees * (Math.PI / 180);
        canvas.width = img.height;
        canvas.height = img.width;

        // Rotate canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // Convert back to base64
        const rotatedBase64 = canvas.toDataURL();
        resolve(rotatedBase64);
      };
    });
  };
  useEffect(() => {
    const rotateImages = async () => {
      try {
        // Rotate the images asynchronously
        const leftImage = await rotateBase64Image(cameras.cam_left, 90);
        const rightImage = await rotateBase64Image(cameras.cam_right, 90);

        // Update the state with the rotated images
        setRotatedLeftImage(leftImage);
        setRotatedRightImage(rightImage);
      } catch (error) {
        console.error("Error rotating images: ", error);
      }
    };

    rotateImages();
  }, [cameras]);

  return (
    <div className="p-1  flex justify-center">
      <div class={styles.imageGridLive}>
        <div class={styles.imageContainerLiveFront}>
          <div class={styles.expandIconBoxLive}>Front Camera</div>
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
        <div class={styles.imageContainerLiveFront}>
          <div class={styles.expandIconBoxLive}>Back Camera</div>
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
        <div class={styles.imageContainerLive}>
          <div class={styles.expandIconBoxLive}>Side Left Camera</div>
          {/* <img src="/upload/images/imageBL.png" alt="Image 3" /> */}
          <img src={rotatedLeftImage} alt="Image 3" />
          {/* <div class={styles.expandIconBox}>
            {isFullScreen ? (
              <FaCompress size={25} color="#ffffff" className="expandIcon" />
            ) : (
              <FaExpand size={25} color="#ffffff" className="expandIcon" />
            )}
          </div> */}
        </div>
        <div class={styles.imageContainerLive}>
          <div class={styles.expandIconBoxLive}>Side Right Camera</div>
          {/* <img src="/upload/images/imageBR.png" alt="Image 4" /> */}
          <img src={rotatedRightImage} alt="Image 4" />
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

export default PlanCameraView;
