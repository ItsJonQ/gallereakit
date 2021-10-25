/**
 * Simple type definitions.
 */

export type UserData = {
  id: string;
  username: string;
  name: string;
  imageUrl: string;
};

export type PhotoData = {
  id: string;
  color: string;
  description?: string;
  imageUrl: string;
  thumbUrl: string;
  user: UserData;
};

export type PhotosData = Array<PhotoData>;
