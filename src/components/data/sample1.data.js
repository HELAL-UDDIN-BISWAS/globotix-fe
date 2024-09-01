const SampleData1 = {
  _id:1,
  user: "Robert Mitchell",
  robot_id: "flexo",
  building_name: "Terminal 4",
  location_name: "tunnel_test_2",
  cleaning_status: "INCOMPLETE",
  cleaning_zone_percentage: 68.38463592529297,
  coverage_percentage: 74.6029281616211,
  cleaning_productivity: 0.1471952646970749,
  percentage_of_max_cleaning_productivity: 0.18172255158424377,
  battery_usage: 0,
  date: "24/5/2023",
  start_time: "10:52:48",
  end_time: "11:04:04",
  cleaning_duration: "00:11:16",
  total_area: 179.72250366210938,
  cleanable_area: 119.2300033569336,
  cleaning_zones_area: 81.53500366210938,
  cleaned_area: 60.8275032043457,
  missed_cleaning_area: 20.707500457763672,
  cleaning_zones_img_url: "",
  cleaned_area_img_url: "",
  cleaning_zones_w_cleaned_img_url: "",
  missed_area_img_url: "",
  complete_img_url: "",
  version: "1.0",
  cleaning_zones: [
    {
      name: "cleaning_zone_0",
      order: 0,
      cleaning_presets: {
        gutter: 1,
        roller: 1,
        vacuum: 2,
      },
      repetition: 1,
      true_cleaning_percentage: 78.92644917555388,
      svg_url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 384'%3E%3Cpath d='M45 167L232 165L233 337L46 335z'/%3E%3C/svg%3E",
    },
    {
      name: "cleaning_zone_1",
      order: 1,
      cleaning_presets: {
        gutter: 1,
        roller: 1,
        vacuum: 2,
      },
      repetition: 2,
      true_cleaning_percentage: 63.720764149259054,
      svg_url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 384'%3E%3Cpath d='M62 117L91 138L206 24L159 14z'/%3E%3C/svg%3E",
    },
    {
      name: "cleaning_zone_3",
      order: 3,
      cleaning_presets: {
        gutter: 1,
        roller: 1,
        vacuum: 2,
      },
      repetition: 1,
      true_cleaning_percentage: 44.06991260923845,
      svg_url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 384'%3E%3Cpath d='M225 62L297 155L356 63L284 7z'/%3E%3C/svg%3E",
    },
  ],
  skipped_zones: [
    {
      name: "cleaning_zone_2",
      order: 2,
      svg_url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 384'%3E%3Cpath d='M47 224L215 168L232 199L65 257z'/%3E%3C/svg%3E",
    },
  ],
  prohibited_zones: [
    {
      name: "prohibited_zone_4",
      order: 4,
      svg_url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 384'%3E%3Cpath d='M236 163L238 208L377 208L376 163z'/%3E%3C/svg%3E",
    },
  ],
  no_clean_zones: [],
  cleaning_path_svg_url: "",
  static_map: "",
  inflated_map: "",
};

export default SampleData1;