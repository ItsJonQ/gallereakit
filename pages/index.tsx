import type { NextPage } from 'next';
import * as React from 'react';
import Head from 'next/head';
import { PhotoGallery } from '../features/PhotoGallery';

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Gallereakit</title>
			</Head>
			<PhotoGallery />
		</div>
	);
};

export default Home;
