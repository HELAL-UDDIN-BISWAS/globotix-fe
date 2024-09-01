const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

let Data = [];
let Info = [
  "Lost Localization",
  "Disconnected from Fleet Management",
  "Battery Low",
  "Dust Bin Full",
  "Sensors Blocked",
];

let i = 0;
while (i < 12) {
  Data.push({
    base_id: "BASE_ID_" + getRandomInt(2000),
    module_id: "MODULE_ID_" + getRandomInt(2000),
    building_name: "SingPost L5 - OPS",
    location_name: "SingPost Centre",
    coverage: 80,
    cleaning_time: "15/03/2022, 12:02:03",
    cleaning_duration: `12' 10"`,
    info: Info[getRandomInt(Info.length)],
  });

  i++;
}

const getAllWarning = () => {
  return Data;
};

export { getAllWarning };
