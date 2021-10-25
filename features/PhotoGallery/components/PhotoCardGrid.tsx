import * as React from "react";
import styled from "@emotion/styled";

type PhotoCardGrid = React.ComponentProps<"div">;

const GridView = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  maxWidth: 960,
  gap: 20,
  margin: "20px auto",
});

export function PhotoCardGrid(props: PhotoCardGrid) {
  return <GridView {...props} />;
}
