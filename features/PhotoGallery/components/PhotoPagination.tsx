import * as React from "react";
import styled from "@emotion/styled";

type PhotoCardGrid = {
  disableNavigatePrev?: boolean;
  disableNavigateNext?: boolean;
  onClickPrev?: () => void;
  onClickNext?: () => void;
};

const PaginationView = styled.div({
  display: "flex",
  justifyContent: "space-between",
  maxWidth: 960,
  margin: "10px auto",
});

export function PhotoPagination(props: PhotoCardGrid) {
  const { disableNavigatePrev, disableNavigateNext, onClickNext, onClickPrev } =
    props;
  return (
    <PaginationView>
      <button onClick={onClickPrev} disabled={disableNavigatePrev}>
        Previous
      </button>
      <button onClick={onClickNext} disabled={disableNavigateNext}>
        Next
      </button>
    </PaginationView>
  );
}
