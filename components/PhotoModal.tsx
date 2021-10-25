import * as React from 'react';
import styled from '@emotion/styled';

import { Dialog, DialogBackdrop } from 'reakit/Dialog';
import type { DialogState } from 'reakit/Dialog/DialogState';

type PhotoModalProps = {
	dialog: DialogState;
	lastClickedPhotoRef: React.RefObject<HTMLElement>;
} & React.ComponentProps<'div'>;

const ModalBackdropView = styled.div({
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
	display: 'flex',
	height: '100%',
	justifyContent: 'center',
	left: 0,
	opacity: 0,
	perspective: 800,
	position: 'fixed',
	top: 0,
	transition: 'opacity 120ms ease-in-out',
	width: '100%',
	zIndex: 999,
	'&[data-enter]': {
		opacity: 1,
	},
});

const ModalCardView = styled.div({
	background: 'white',
	borderRadius: 8,
	boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2)',
	marginTop: '10vh',
	maxHeight: '80vh',
	height: 600,
	maxWidth: 720,
	opacity: 0,
	padding: 20,
	transition: 'opacity 250ms ease-in-out',
	width: '100%',
	overflowY: 'auto',
	'&[data-enter]': {
		opacity: 1,
	},
});

export function PhotoModal({
	dialog,
	lastClickedPhotoRef,
	...rest
}: PhotoModalProps) {
	/**
	 * We're rendering the provided <DialogBackdrop /> and <Dialog />
	 * components with our custom (emotion) styled View component.
	 *
	 * Because we're doing a custom setup, we'll need to provide the <Dialog />
	 * with an unstabled_finalFocusRef so that it can correctly jump
	 * the focus back to our <PhotoCard />.
	 *
	 * @see https://reakit.io/docs/dialog/#dialog
	 */
	return (
		<>
			<DialogBackdrop {...dialog} as={ModalBackdropView}>
				<Dialog
					{...dialog}
					{...rest}
					aria-label="Photo preview modal"
					tabIndex={0}
					as={ModalCardView}
					unstable_finalFocusRef={lastClickedPhotoRef}
				/>
			</DialogBackdrop>
		</>
	);
}
