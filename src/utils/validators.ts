import { CustomError } from "@/lib/CustomError";

export function validateEmail(email: string) {
	let error = null;

	if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
		error = "Invalid Email.";
	}

	return error;
}

export function validatePassword(password: string) {
	let error = null;

	if (password.length < 8) {
		error = "Password must be at least 8 characters long.";
	}

	if (!/[a-z]/.test(password)) {
		error = "Password must contain at least one lowercase letter.";
	}

	if (!/[A-Z]/.test(password)) {
		error = "Password must contain at least one uppercase letter.";
	}

	if (!/\d/.test(password)) {
		error = "Password must contain at least one digit.";
	}

	if (!/[@$!%*?&]/.test(password)) {
		error = "Password must contain at least one special character (@$!%*?&).";
	}

	return error;
}

/**
 *
 * @param id
 * @param message
 * @returns {true}
 *
 * @throws {CustomError} if id is not a valid ObjectId
 */

export function ObjectIdValidation(id: string | undefined, message: string = "Invalid Id"): true {
	try {
		if (!id || !/^[0-9a-f]{24}$/.test(id)) {
			throw new CustomError(message);
		}
	} catch {
		throw new CustomError(message);
	}
	return true;
}
