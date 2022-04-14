import { Request, Response } from "express";
import lookup from "../src/util/lookup";

export const route = [
	"mctools/v1/lookup",
	"mctools/v1/lookup/:query"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Get the specified player
	const requestQuery = req.query.query || req.params.query || req.query.player || req.query.uuid || req.query.name;

	// Make sure the query is valid
	if (typeof requestQuery !== "string") {
		res.status(400).json({
			success: false,
			error: "Invalid query parameter."
		});
		return;
	}

	// Get response
	try {
		const response = await lookup(requestQuery);
		res.json({
			success: true,
			...response
		});
	} catch ({ message }: unknown) {
		res.status(400).json({
			success: false,
			error: message
		});
	}
}
