import type { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { PhotoGallery } from "../features/PhotoGallery";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Gallereakit</title>
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="robots" content="noindex" />
      </Head>
      <PhotoGallery />
    </div>
  );
};

export default Home;
