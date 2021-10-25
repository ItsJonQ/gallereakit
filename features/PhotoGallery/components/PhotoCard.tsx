import * as React from 'react';
import type { PhotoData } from '../types/Photos';
import styled from '@emotion/styled';

type PhotoCardProps = React.ComponentProps<'div'> & PhotoData;

const ImageWrapperView = styled.div({
	width: 300,
	height: 200,
	background: '#eee',
});

const ImageView = styled.img({
	height: '100%',
	width: '100%',
	objectFit: 'cover',
	pointerEvents: 'none',
	userSelect: 'none',
});

export function PhotoCard(props: PhotoCardProps) {
	const { thumbUrl, description, ...rest } = props;

	return (
		<ImageWrapperView {...rest} tabIndex={0}>
			<ImageView src={thumbUrl} alt={description} />
		</ImageWrapperView>
	);
}
