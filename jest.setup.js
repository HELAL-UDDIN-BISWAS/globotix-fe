jest.mock("next/font/google", () => ({
	Montserrat: () => ({
		className: "mocked-montserrat",
	}),
	Hind: () => ({
		className: "mocked-hind",
	}),
	Leckerli_One: () => ({
		className: "mocked-leckerli-one",
	}),
}));
