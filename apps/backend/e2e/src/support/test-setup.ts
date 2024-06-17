import axios from "axios";

/** Setup for backend e2e testing */
export default function () {
	// Configure axios for tests to use.
	const host = "127.0.0.1";
	const port = 33000;
	const prefix = "/e2e/api";
	axios.defaults.baseURL = `http://${host}:${port}${prefix}`;
}
