import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

const removeBoxShadows = (element) => {
	const elements = element.querySelectorAll("*");
	elements.forEach((el) => {
		if (el.style.boxShadow) {
			el.dataset.originalBoxShadow = el.style.boxShadow;
			el.style.boxShadow = "none";
		}
	});
};

const restoreBoxShadows = (element) => {
	const elements = element.querySelectorAll("*");
	elements.forEach((el) => {
		if (el.dataset.originalBoxShadow) {
			el.style.boxShadow = el.dataset.originalBoxShadow;
			delete el.dataset.originalBoxShadow;
		}
	});
};

const ButtonDownloadPDFReport = (props) => {
	const [hover, setHover] = useState(false);
	const divToCapture = document.querySelector("#divReportDetail");

	const download = () => {
		html2canvas(divToCapture, {
			scale: 1,
			backgroundColor: "#FFFFFF",
		}).then((canvas) => {
			document.body.appendChild(canvas); // if you want see your screenshot in body.
			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				orientation: "landscape",
				unit: "mm",
				format: "a4",
				hotfixes: true,
				compressPdf: true,
			});

			const pageWidth = pdf.internal.pageSize.getWidth(); // Width of A4 page in units (by default, it's in points)
			const pageHeight = pdf.internal.pageSize.getHeight(); // Height of A4 page in units (by default, it's in points)

			const div = document.getElementById("divReportDetail");
			// Assuming imageWidth and imageHeight are the original dimensions of the image
			const imageWidth = div?.clientWidth; // Width of the image in units (adjust as needed)
			const imageHeight = div?.clientHeight; // Height of the image in units (adjust as needed)

			// Calculate the aspect ratio of the image
			const aspectRatio = imageWidth / imageHeight;

			// Calculate the maximum dimensions that fit within the A4 page
			let maxWidth = pageWidth - 20; // Leave 10 units of margin on each side
			let maxHeight = maxWidth / aspectRatio;

			// If the height exceeds the page height, adjust the height to fit within the page
			if (maxHeight > pageHeight - 20) {
				maxHeight = pageHeight - 20; // Leave 10 units of margin at the top and bottom
				maxWidth = maxHeight * aspectRatio;
			}

			// Calculate the position to center the image horizontally
			const x = (pageWidth - maxWidth) / 2;

			// Calculate the position to center the image vertically
			const y = (pageHeight - maxHeight) / 2;

			// Add the image to the PDF document
			pdf.addImage(imgData, "PNG", x, y, maxWidth, maxHeight);

			// pdf.addImage(imgData, "PNG", 10, 10, 1454, 790);
			pdf.save(
				`report_${
					props?.dataDetail?.attributes?.robot?.data?.attributes?.displayName
				}_${Number(new Date())}.pdf`
			);
			canvas.remove();
		});
	};

	return (
		<div className="relative w-[35px] h-[35px] rounded-full border-2 border-[#BFA01D] flex justify-center items-center">
			<Image
				onMouseOver={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={() => download()}
				src="/upload/icons/icon_download.svg"
				className="cursor-pointer"
				width={18}
				height={18}
				alt=""
			/>
			<div
				className={`${
					hover ? "inline-block" : "hidden"
				} absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-8  py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}>
				Download Reports
			</div>
		</div>
	);
};

export default ButtonDownloadPDFReport;
