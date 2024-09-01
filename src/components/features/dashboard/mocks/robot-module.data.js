const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

let Data = [];

let i = 0;
while (i < 8) {
  Data.push({
    base_id: "BASE_ID_" + getRandomInt(2000),
    module_id: "MODULE_ID_" + getRandomInt(2000),
    building_name: "SingPost L5 - OPS",
    location_name: "SingPost Centre",
    coverage: 80,
    battery: getRandomInt(100),
    cleaning_time: "15/03/2022, 12:02:03",
    cleaning_duration: `12' 10"`,
  });

  i++;
}

const getAllRobotModule = () => {
  return Data;
};

export { getAllRobotModule };
