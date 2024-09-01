"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { menuList } from "@/data/menuList";
import { cn } from "@/utils/cn";
import { Box, Flex } from "@radix-ui/themes";

import { Image } from "../ui/images";
import NavLogout from "../common/navLogout";
import IconLogout from "../icons/iconLogout";
import LogoutModal from "./LogoutModal";
import useAuth from "@/hooks/useAuth";

const Sidebar = () => {
	const pathname = usePathname();
	const { user } = useAuth();
	const [openModal, setOpenModal] = useState(false);
	const [hover, setHover] = useState(null);

	return (
		<>
			<LogoutModal open={openModal} onClose={() => setOpenModal(!openModal)} />
			<Box className="fixed left-0 bg-white h-full w-[80px] rounded-r-[30px] shadow py-4 px-4 z-10">
				<Flex direction="column" align="center" justify="center" gap="4">
					<Link href={"/dashboard"}>
						<Image
							src={"/upload/images/globotix_logo.png"}
							width={45}
							height={45}
							alt="Logo"
							className="cursor-pointer"
						/>
					</Link>
					<Box className="h-[1px] w-full bg-gray" />

					{menuList?.map((item, key) => {
						const isActive =
							item.path === "/dashboard"
								? pathname === "/dashboard" || pathname === "/"
								: pathname === item.path;
						if (
							item?.access?.find(
								(v) =>
									v?.toLocaleLowerCase() === user?.role?.toLocaleLowerCase()
							)
						) {
							return (
								<div className="relative" key={key}>
									<Flex
										className={cn(
											isActive ? "bg-primary" : "",
											"w-[55px] h-[55px] rounded-lg"
										)}
										align="center"
										justify={"center"}
										key={key}
										onMouseOver={() => setHover(key)}
										onMouseLeave={() => setHover(null)}>
										<Link href={item.path}>
											<Image
												src={isActive ? item.activeIcon : item.icon}
												width={32.5}
												height={32.5}
												alt="Logo"
											/>
										</Link>
									</Flex>
									<div
										className={`${
											hover === key ? "block" : "hidden"
										} absolute overflow-auto w-max top-1/2 -translate-y-1/2 z-50 left-[calc(100%)] whitespace-nowrap py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}>
										{item?.name}
									</div>
								</div>
							);
						}
					})}

					<NavLogout
						data={{
							title: "Logout",
							icon: <IconLogout />,
							url: "/logout",
						}}
						openModal={openModal}
						setOpenModal={setOpenModal}
					/>
				</Flex>
			</Box>
		</>
	);
};

export default Sidebar;
