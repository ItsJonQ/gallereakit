import type { NextPage } from 'next';
import * as React from 'react';
import Head from 'next/head';
import axios from 'axios';
import { PhotoCard } from '../components/PhotoCard';
import { PhotoCardGrid } from '../components/PhotoCardGrid';
import { PhotoModal } from '../components/PhotoModal';
import { PhotoPreview } from '../components/PhotoPreview';
import type { PhotosData, PhotoData } from '../types/Photos';

import { useDialogState } from 'reakit/Dialog';

/**
 * Creating an axios instance with our next.js API as the base url.
 *
 * @see https://github.com/axios/axios
 */
const axiosInstance = axios.create({
	baseURL: '/api/',
});

function usePhotosState() {
	const [photos, setPhotos] = React.useState<PhotosData>([]);
	const [loading, setLoading] = React.useState(false);
	const [currentPhoto, setCurrentPhoto] = React.useState<PhotoData>();
	const [currentIndex, setCurrentIndex] = React.useState<number>(0);

	React.useEffect(() => {
		getPhotos();
	}, []);

	const getPhotos = React.useCallback(async () => {
		setLoading(true);

		try {
			const req = await axiosInstance.get('/photos');
			if (req.status === 200) {
				// @ts-ignore
				const photos = req.data as PhotosData;
				setPhotos(photos);
			}
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	}, []);

	const selectPhoto = (nextPhoto) => {
		setCurrentPhoto(nextPhoto);
		const photoFromData = photos.find((p) => p.id === nextPhoto.id);
		const index = photoFromData ? photos.indexOf(photoFromData) : -1;

		if (index >= 0) {
			setCurrentIndex(index);
		}
	};

	const disableNavigatePrev = currentIndex === 0;
	console.log({ currentIndex, disableNavigatePrev });

	return {
		photos,
		loading,
		getPhotos,
		selectPhoto,
		setCurrentPhoto,
		currentPhoto,
		disableNavigatePrev,
	};
}

const Home: NextPage = () => {
	const { photos, loading, selectPhoto, currentPhoto, disableNavigatePrev } =
		usePhotosState();
	const dialog = useDialogState({ animated: true });
	/**
	 * For accessibility, Reakit requires a DOM node to (re)focus after
	 * the Dialog (modal) has closed. Normally, this would be automatically
	 * handled by the provided <DialogDisclosure /> component.
	 *
	 * However, since we're doing a custom implementation, this refocus
	 * interaction is something that we have to handle ourselves.
	 *
	 * We can do this by setting a ref to the DOM node of our <PhotoCard />
	 * component.
	 */
	const lastClickedPhotoRef = React.useRef<HTMLElement | null>(null);

	if (loading) return <div>Loading...</div>;

	const handleOnClickPhoto =
		(photo: PhotoData) =>
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const { target } = event;
			selectPhoto(photo);
			/**
			 * We'll update the ref with the latest clicked
			 * <PhotoCard />. That way, Reakit can correctly refocus
			 * the element.
			 */
			lastClickedPhotoRef.current = target as HTMLElement;

			/**
			 * We're doing a custom implementation of the Dialog component
			 * from Reakit. Normally, the .show() and .hide() methods from
			 * dialogState would be handled by the provided <DialogDisclosure />
			 * component.
			 *
			 * However, since we're not going to be using that, we'll have to
			 * handle this on our own.
			 *
			 * We don't need manually trigger .hide(), because the Reakit
			 * <Dialog /> component is being used in our <PhotoModal />.
			 */
			dialog.show();
		};

	return (
		<div>
			<Head>
				<title>Gallereakit</title>
			</Head>
			<PhotoCardGrid>
				{photos.map((photo) => (
					<PhotoCard
						key={photo.id}
						{...photo}
						onClick={handleOnClickPhoto(photo)}
					/>
				))}
			</PhotoCardGrid>
			<PhotoModal dialog={dialog} lastClickedPhotoRef={lastClickedPhotoRef}>
				{currentPhoto && (
					<PhotoPreview
						{...currentPhoto}
						disableNavigatePrev={disableNavigatePrev}
					/>
				)}
			</PhotoModal>
		</div>
	);
};

export default Home;
