import { Request, Response } from "express";

export const route = [
	"mctools/v1/player",
	"mctools/v1/player/:query"
];

export default function api(req: Request, res: Response): void {

	// Get the specified player
	const query = req.query.query || req.params.query || req.query.player || req.query.uuid || req.query.name;

	res.json({ query });
}
