import * as React from "react";
import styled from "@emotion/styled";
import type { PhotoData } from "../types/Photos";

type PhotoPreviewProps = PhotoData & {
  disableNavigatePrev?: boolean;
  disableNavigateNext?: boolean;
  onClickPrev?: () => void;
  onClickNext?: () => void;
};

const TitleView = styled.h1({
  fontSize: 24,
  lineHeight: "1.2",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const ImageWrapperView = styled.div({
  height: 480,
});

const ImageView = styled.img({
  objectFit: "cover",
  height: "100%",
  width: "100%",
  userSelect: "none",
  pointerEvents: "none",
});

const CarouselView = styled.div({
  display: "grid",
  gridTemplateColumns: "30px 1fr 30px",
});

const NavigationButtonView = styled.button({
  cursor: "pointer",
  userSelect: "none",
  "&[disabled]": {
    pointerEvents: "none",
  },
});

export function PhotoPreview(props: PhotoPreviewProps) {
  const {
    description,
    imageUrl,
    disableNavigatePrev,
    disableNavigateNext,
    onClickNext,
    onClickPrev,
  } = props;

  return (
    <div>
      <TitleView>{description}</TitleView>
      <CarouselView>
        <NavigationButtonView
          disabled={disableNavigatePrev}
          onClick={onClickPrev}
        >
          ⏮
        </NavigationButtonView>
        <ImageWrapperView>
          <ImageView alt={description} src={imageUrl} />
        </ImageWrapperView>
        <NavigationButtonView
          disabled={disableNavigateNext}
          onClick={onClickNext}
        >
          ⏭
        </NavigationButtonView>
      </CarouselView>
    </div>
  );
}
