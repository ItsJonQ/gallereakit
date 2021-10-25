// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import page1 from "../../data/photos-1.fixtures.json";
import page2 from "../../data/photos-2.fixtures.json";
import page3 from "../../data/photos-3.fixtures.json";
import page4 from "../../data/photos-4.fixtures.json";

const photosDB = [page1, page2, page3, page4];

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
    const {
      query: { page },
    } = req;
    const pageNumber = page ? Number(page) - 1 : 0;

    /**
     * Get photos from photos DB (Source is Unsplash).
     *
     * @see https://github.com/unsplash/unsplash-js#photoslistarguments-additionalfetchoptions
     */
    const photos = photosDB[pageNumber];
    res.status(200).json(remapUnsplashPhotos(photos));
  } catch (err) {
    console.log(err);
    res.status(400).json([]);
  }
}
