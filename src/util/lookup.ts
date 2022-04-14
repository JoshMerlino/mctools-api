import fetch from "node-fetch";

export default async function lookup(query: string): Promise<LookupResponse> {

	let uuid: string | null = query.replace(/-/g, "").toLowerCase();

	// Determine if the name is a valid username
	const isValidUsername = query.length >= 3 && query.length <= 16 && query.match(/^[a-zA-Z0-9_]+$/) !== null;
	const isUuid = (query.length === 32 || query.length === 36) && query.toLowerCase().match(/^[0-9a-fA-F]{8}(\b-)?[0-9a-fA-F]{4}(\b-)?[0-9a-fA-F]{4}(\b-)?[0-9a-fA-F]{4}(\b-)?[0-9a-fA-F]{12}$/) !== null;

	// Look up the players UUID by username
	if (isValidUsername) {

		// Fetch the UUID from Mojang
		const response: Mojang.Username | false = await fetch(`https://api.mojang.com/users/profiles/minecraft/${query}`)
			.then(resp => resp.json())
			.catch(() => false);

		uuid = response !== false ? response.id : null;
		console.log({ uuid, isUuid, isValidUsername, query, response });

	} else if (!isUuid) uuid = null;

	// If the uuid is null, it isnt a valid username or uuid
	if (uuid === null) throw new Error(`'${query}' is not a valid username or UUID.`);

	// Attempt to fetch past names of the player
	const pastNames: Mojang.PastNames[] | false = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`)
		.then(resp => resp.json())
		.catch(() => false);

	// If there was an error
	if (pastNames === false) throw new Error(`'${query}' is not a valid UUID.`);

	// Parse names
	const [ currentName, ...pastNamesList ] = pastNames.sort((a, b) => (b.changedToAt || 0) - (a.changedToAt || 0));

	// Get skins

	return {
		currentName: currentName.name,
		uuid,
		imageUrls: {
			avatar: `https://crafatar.com/avatars/${uuid}?overlay&default=MHF_Steve`,
			head: `https://crafatar.com/renders/head/${uuid}?overlay&default=MHF_Steve`,
			body: `https://crafatar.com/renders/body/${uuid}?overlay&default=MHF_Steve`,
			skin: `https://crafatar.com/skins/${uuid}?overlay&default=MHF_Steve`,
			cape: `https://crafatar.com/capes/${uuid}?overlay&default=MHF_Steve`
		},
		pastNames: pastNamesList.map(({ name, changedToAt }) => ({ name, changedAt: changedToAt || null }))
	};

}
