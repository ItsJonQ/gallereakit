// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createApi } from 'unsplash-js';
import fixtures from '../../data/photos.fixtures.json';

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
});

function remapUnsplashPhotos(data) {
	return data.map((item) => {
		const { id, color, description, alt_description, urls, user } = item;

		return {
			id,
			color,
			description:
				description || alt_description || `Photo by ${user.username}`,
			imageUrl: urls.regular,
			thumbUrl: urls.thumb,
			user: {
				id: user.id,
				username: user.username,
				name: user.name,
				imageUrl: user.profile_image.medium,
			},
		};
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		/**
		 * Get photos from Unsplash.
		 *
		 * @see https://github.com/unsplash/unsplash-js#photoslistarguments-additionalfetchoptions
		 */
		// const results = await unsplash.photos.list({ page: 1, perPage: 9 });
		// const photos = results.response.results

		const photos = fixtures;
		res.status(200).json(remapUnsplashPhotos(photos));
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'error' });
	}
}
