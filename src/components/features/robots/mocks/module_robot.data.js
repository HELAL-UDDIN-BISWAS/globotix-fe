
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

let Data = [];
let arrCoverageCompleted = [75, 80, 85, 90, 100];
let arrCoveragePartialyCompleted = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70,
];

let arrRobotId = [
  "flexo",
  "flexo_1",
  "flexo_2",
  "flexo_3",
  "flexo_4",
  "flexo_5",
];
let arrCleaningStatus = [
  "COMPLETE",
  "INCOMPLETE",
  "PARTIALLY COMPLETED",
  "FAILED",
];

const datestring = (d) => {
  let date = ("0" + d.getDate()).slice(-2);
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let year = d.getFullYear();
  return `${date}/${month}/${year}`;
};

const dateLast7Days = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 7) {
    let d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (i + 1)
    );
    data.push(datestring(d));
    i++;
  }

  return data;
};

const dateLast30Days = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 30) {
    let d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (i + 1)
    );
    data.push(datestring(d));
    i++;
  }

  return data;
};

const dateYearToDate = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 30) {
    data.push(
      `${getRandomInt(27) + 1}/${getRandomInt(11) + 1}/${now.getFullYear()}`
    );
    i++;
  }

  return data;
};

const dateLastYear = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 30) {
    data.push(
      `${getRandomInt(27) + 1}/${getRandomInt(11) + 1}/${now.getFullYear() - 1}`
    );
    i++;
  }

  return data;
};

let i = 0;
while (i < 50) {
  Data.push({
    id: i + 1,
    name: "Base A",
    serial: "FLO1234",
    status: "Cleaning",
    location: "Singpost",
    cleaning_plan: "Singpost L5 - OPS",
    base: "Base_ID",
    battery: 30,
    dust_tank: true,
    filter: true,
    main_brush: false,
  });

  i++;
}

const strLoc = (filter) => {
  if (filter?.location?.length > 0) {
    let evalLoc = [];
    let i = 0;
    while (i < filter?.location?.length) {
      evalLoc.push(`arr[i].building_name === '${filter?.location[i]}'`);
      i++;
    }
    return evalLoc.join(" || ");
  } else {
    return false;
  }
};

const strRob = (filter) => {
  if (filter?.robot_id?.length > 0) {
    let evalLoc = [];
    let i = 0;
    while (i < filter?.robot_id?.length) {
      evalLoc.push(`arr[i].robot_id === '${filter?.robot_id[i]}'`);
      i++;
    }
    return evalLoc.join(" || ");
  } else {
    return false;
  }
};

const strStatus = (filter) => {
  if (filter?.cleaning_status?.length > 0) {
    let evalLoc = [];
    let i = 0;
    while (i < filter?.cleaning_status?.length) {
      evalLoc.push(
        `arr[i].cleaning_status === '${filter?.cleaning_status[i]}'`
      );
      i++;
    }
    return evalLoc.join(" || ");
  } else {
    return false;
  }
};

const strDuration = (filter) => {
  const now = new Date();
  const nowStr = datestring(now);
  let minDate;
  let maxDate;
  switch (filter.duration) {
    case "all_time":
      return false;

    case "last_7_days":
      minDate = datestring(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      );
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;
    case "last_30_days":
      minDate = datestring(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
      );
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

    case "year_to_date":
      minDate = datestring(new Date(now.getFullYear(), 0, 1));
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

    case "last_year":
      minDate = datestring(new Date(now.getFullYear() - 1, 0, 1));
      maxDate = datestring(new Date(now.getFullYear() - 1, 11, 31));
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

    case "custom":
      minDate = datestring(new Date(filter.min_date));
      maxDate = datestring(new Date(filter.max_date));
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

      return false;

    default:
      return false;
  }
};

const getAllModuleRobot = (filter) => {
  let arr = [...Data];
  let arrFilter = [];
  let ifArr = [
    `(${strDuration(filter)})`,
    `(${strLoc(filter)})`,
    `(${strRob(filter)})`,
    `(${strStatus(filter)})`,
  ];

  let ifReport = ifArr.filter((item) => item !== "(false)").join(" && ");
  if (ifReport !== "") {
    let i = 0;
    while (i < arr.length) {
      eval(ifReport) ? arrFilter.push(arr[i]) : "";
      i++;
    }

    return arrFilter;
  } else {
    return arr;
  }
};

export { getAllModuleRobot };
