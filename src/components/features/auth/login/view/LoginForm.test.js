import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./login.form";
import useAuth from "../../../../../hooks/useAuth";
import { useRouter } from "next/navigation";

jest.mock("../../../../../hooks/useAuth");
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));
// jest.mock("next/font/google", () => ({
// 	Montserrat: () => ({
// 		className: "mocked-montserrat",
// 	}),
// }));

describe("LoginForm", () => {
	const mockLogin = jest.fn();
	const mockPush = jest.fn();

	beforeEach(() => {
		useAuth.mockReturnValue({ login: mockLogin });
		useRouter.mockReturnValue({ push: mockPush });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders the form correctly", () => {
		render(<LoginForm />);
		expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Sign In/i })
		).toBeInTheDocument();
	});

	it("disables submit button when fields are empty", () => {
		render(<LoginForm />);
		expect(screen.getByRole("button", { name: /Sign In/i })).toBeDisabled();
	});

	it("enables submit button when fields are filled", async () => {
		render(<LoginForm />);
		const emailInput = screen.getByLabelText(/Email Address/i);
		const passwordInput = screen.getByLabelText(/Password/i);

		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "password123");

		expect(screen.getByRole("button", { name: /Sign In/i })).toBeEnabled();
	});

	it("calls login function and redirects on successful login", async () => {
		mockLogin.mockResolvedValue({ status: 200 });
		render(<LoginForm />);

		const emailInput = screen.getByLabelText(/Email Address/i);
		const passwordInput = screen.getByLabelText(/Password/i);
		const submitButton = screen.getByRole("button", { name: /Sign In/i });

		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "password123");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
			expect(mockPush).toHaveBeenCalledWith("/verification");
		});
	});

	it("displays error message on login failure", async () => {
		const errorMessage = "Invalid credentials";
		mockLogin.mockResolvedValue({ status: 400, msg: errorMessage });
		render(<LoginForm />);

		const emailInput = screen.getByLabelText(/Email Address/i);
		const passwordInput = screen.getByLabelText(/Password/i);
		const submitButton = screen.getByRole("button", { name: /Sign In/i });

		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "wrongpassword");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});
	});

	it("displays account locked message when applicable", async () => {
		const lockedMessage = "Your account has been locked";
		mockLogin.mockResolvedValue({
			status: 400,
			msg: lockedMessage,
			time: new Date().getTime() + 300000, // 5 minutes from now
		});
		render(<LoginForm />);

		const emailInput = screen.getByLabelText(/Email Address/i);
		const passwordInput = screen.getByLabelText(/Password/i);
		const submitButton = screen.getByRole("button", { name: /Sign In/i });

		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "wrongpassword");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/Your account has been locked/i)
			).toBeInTheDocument();
			expect(screen.getByText(/please try again in/i)).toBeInTheDocument();
		});
	});
});
