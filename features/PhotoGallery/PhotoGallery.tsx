import * as React from "react";
import axios from "axios";
import { PhotoCard } from "./components/PhotoCard";
import { PhotoCardGrid } from "./components/PhotoCardGrid";
import { PhotoModal } from "./components/PhotoModal";
import { PhotoPreview } from "./components/PhotoPreview";
import { PhotoPagination } from "./components/PhotoPagination";
import type { PhotosData, PhotoData } from "./types/Photos";
import {
  getPageNumberInBrowserUrl,
  updatePageNumberInBrowserUrl,
} from "./utils/pageUrl";

import { useDialogState } from "reakit/Dialog";

type PhotosApiGetProps = {
  page?: number;
};

const MAX_PAGES = 4;

/**
 * A layer between our back-end API and for our React components.
 * It doesn't do much now. But this layer could be useful for massaging data
 * and for edge-case/error handling to keep our React component logic
 * cleaner.
 */
const photosApi = {
  get: async (
    params: PhotosApiGetProps = { page: 1 }
  ): Promise<PhotosData | undefined> => {
    const { page } = params;
    try {
      const req = await axios.get("/api/photos", { params: { page } });
      if (req.status === 200) {
        // @ts-ignore
        const photos = req.data as PhotosData;
        return photos;
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};

/**
 * This is the brain! All of the business logic happens here.
 */
function usePhotoGallery() {
  const [photos, setPhotos] = React.useState<PhotosData>([]);
  const [loading, setLoading] = React.useState(false);
  const [currentPhoto, setCurrentPhoto] = React.useState<PhotoData>();
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  /**
   * Get our photos when the App first loads.
   */
  React.useEffect(() => {
    /**
     * Load and set the page number from the URL param.
     */
    const page = getPageNumberInBrowserUrl();
    setCurrentPage(page);
    getPhotos(page);
  }, []);

  /**
   * A generic function to get photos from our API.
   */
  const getPhotos = React.useCallback(
    async (page = 1): Promise<PhotosData | undefined> => {
      setLoading(true);

      try {
        const photos = await photosApi.get({ page });
        if (photos) setPhotos(photos);
        return photos;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    []
  );

  const getNextPage = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    const photos = await getPhotos(nextPage);

    /**
     * Update the current photo after we get our photos from the database.
     */
    if (photos) {
      updatePageNumberInBrowserUrl(nextPage);

      setCurrentIndex(0);
      setCurrentPhoto(photos[0]);
    }
  };

  const getPrevPage = async () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);

    const photos = await getPhotos(prevPage);

    /**
     * Update the current photo after we get our photos from the database.
     */
    if (photos) {
      updatePageNumberInBrowserUrl(prevPage);

      setCurrentIndex(photos.length - 1);
      setCurrentPhoto(photos[photos.length - 1]);
    }
  };

  /**
   * We want to load the next set of images if the user clicks on
   * "Previous" or "Next" arrows on the first or last photo in our collection.
   *
   * If that's the case, we'll update our page number in state and get
   * the previous or next set of photos from our API.
   */
  const maybeUpdatePagination = (nextIndex) => {
    // Previous
    if (nextIndex === -1) {
      getPrevPage();
    }
    // Next
    if (nextIndex >= photos.length) {
      getNextPage();
    }
  };

  const getIndexOfPhoto = (photo?: PhotoData) => {
    if (!photo) return -1;
    const photoFromData = photos.find((p) => p.id === photo.id);
    const index = photoFromData ? photos.indexOf(photoFromData) : -1;
    return index;
  };

  const selectPhoto = (nextPhoto) => {
    setCurrentPhoto(nextPhoto);
    const photoFromData = photos.find((p) => p.id === nextPhoto.id);
    const index = getIndexOfPhoto(photoFromData);

    if (index >= 0) {
      setCurrentIndex(index);
    }
  };

  const selectPrevPhoto = () => {
    const index = getIndexOfPhoto(currentPhoto);
    if (index >= 0) {
      const nextIndex = index - 1;
      const nextPhoto = photos[nextIndex];

      setCurrentPhoto(nextPhoto);
      setCurrentIndex(nextIndex);

      maybeUpdatePagination(nextIndex);
    }
  };

  const selectNextPhoto = () => {
    const index = getIndexOfPhoto(currentPhoto);
    if (index < photos.length) {
      const nextIndex = index + 1;
      const nextPhoto = photos[nextIndex];

      setCurrentPhoto(nextPhoto);
      setCurrentIndex(nextIndex);

      maybeUpdatePagination(nextIndex);
    }
  };

  const isFirstPage = currentPage === 1;
  const isFirstPhoto = currentIndex === 0;
  const isLastPage = currentPage === MAX_PAGES;
  const isLastPhoto = currentIndex === photos.length - 1;

  /**
   * Some derived state for our pagination interactions.
   */
  const disableNavigatePrev = isFirstPage && isFirstPhoto;
  const disablePrevPage = isFirstPage;

  const disableNavigateNext = isLastPage && isLastPhoto;
  const disableNextPage = isLastPage;

  return {
    photos,
    loading,
    getPhotos,
    selectPhoto,
    selectPrevPhoto,
    selectNextPhoto,
    setCurrentPhoto,
    getNextPage,
    getPrevPage,
    currentPhoto,
    disableNavigatePrev,
    disableNavigateNext,
    disablePrevPage,
    disableNextPage,
    currentPage,
    setCurrentPage,
  };
}

export function PhotoGallery() {
  const {
    currentPhoto,
    disableNavigateNext,
    disableNavigatePrev,
    photos,
    selectNextPhoto,
    selectPhoto,
    selectPrevPhoto,
    getNextPage,
    getPrevPage,
    disablePrevPage,
    disableNextPage,
  } = usePhotoGallery();
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
    <>
      <PhotoCardGrid>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            {...photo}
            onClick={handleOnClickPhoto(photo)}
          />
        ))}
      </PhotoCardGrid>
      <PhotoPagination
        disableNavigatePrev={disablePrevPage}
        disableNavigateNext={disableNextPage}
        onClickPrev={getPrevPage}
        onClickNext={getNextPage}
      />
      <PhotoModal dialog={dialog} lastClickedPhotoRef={lastClickedPhotoRef}>
        {currentPhoto && (
          <PhotoPreview
            {...currentPhoto}
            disableNavigatePrev={disableNavigatePrev}
            disableNavigateNext={disableNavigateNext}
            onClickPrev={selectPrevPhoto}
            onClickNext={selectNextPhoto}
          />
        )}
      </PhotoModal>
    </>
  );
}
