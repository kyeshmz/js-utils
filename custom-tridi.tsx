import styled from "@emotion/styled";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import useWindowSize from "@/hooks/useWindowSize";

const WrappedTridi = (props: {
	format: string;
	location: string;
	count: number;
	gtmTitle?: string;

	onDragStart?: () => void;
}) => {
	const windowSize = useWindowSize();
	const _viewerImageRef = useRef(null);

	const router = useRouter();

	const normalizedImages = (
		format: string,
		location: string,
		count: number
	) => {
		// eslint-disable-next-line prefer-spread
		return Array.apply(null, { length: count }).map((_a, index) => {
			return `${location}/${index + 1}.${format.toLowerCase()}`;
		});
	};
	const _images = normalizedImages(props.format, props.location, props.count);

	const [isTouchReady, setIsTouchReady] = useState(false);
	const refIsTouchReady = useRef(isTouchReady);
	useEffect(() => {
		refIsTouchReady.current = isTouchReady;
	}, [isTouchReady]);

	const [preX, setPreX] = useState(0);
	const refPreX = useRef(preX);
	useEffect(() => {
		refPreX.current = preX;
	}, [preX]);

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const refCurrentIndex = useRef(currentImageIndex);
	useEffect(() => {
		refCurrentIndex.current = currentImageIndex;
	}, [currentImageIndex]);

	const rotateViewerImage = (e) => {
		const coord = e.touches ? Math.round(e.touches[0].clientX) : e.clientX;
		const add = -Math.floor(
			(coord - refPreX.current) / ((windowSize.width * 0.75) / props.count)
		);

		if (refIsTouchReady.current) {
			const newIndex =
				(refCurrentIndex.current + props.count + add) % props.count;
			if (newIndex != refCurrentIndex.current) {
				setPreX(coord);
				setCurrentImageIndex(newIndex);
			}
		} else {
			setIsTouchReady(true);
			setPreX(coord);
		}
	};

	useEffect(() => {
		return () => {
			removeAllListener();
		};
	}, []);

	// handlers
	const imageViewerMouseDownHandler: React.MouseEventHandler<HTMLDivElement> = (
		e
	) => {
		if (e.preventDefault) e.preventDefault();
		setPreX(e.clientX);
		setIsTouchReady(true);
		props.onDragStart();

		const path = router.pathname;
		// window.dataLayer.push({
		//   event: 'blocks_event',
		//   blocks_event_category: '360view',
		//   blocks_event_action: 'swipe',
		//   blocks_event_label: path,
		// })

		document.addEventListener("mousemove", onTouchMoveHandler, {
			passive: false,
		});
		document.addEventListener("mouseup", onTouchEndHandler, { passive: false });
		document.addEventListener("mouseleave", onTouchEndHandler, {
			passive: false,
		});
	};

	const imageViewerTouchStartHandler = (e) => {
		const coord = e.touches ? Math.round(e.touches[0].clientX) : e.clientX;
		setPreX(coord);
		setIsTouchReady(true);
		props.onDragStart();
		document.addEventListener("touchmove", onTouchMoveHandler, {
			passive: false,
		});
		document.addEventListener("touchend", onTouchEndHandler, {
			passive: false,
		});
	};

	const onTouchMoveHandler = (e) => {
		rotateViewerImage(e);
	};

	const onTouchEndHandler = (e) => {
		removeAllListener();
		setIsTouchReady(false);
	};

	const removeAllListener = () => {
		document.removeEventListener("mousemove", onTouchMoveHandler);
		document.removeEventListener("mouseup", onTouchEndHandler);
		document.removeEventListener("mouseleave", onTouchEndHandler);
		document.removeEventListener("touchmove", onTouchMoveHandler);
		document.removeEventListener("touchend", onTouchEndHandler);
	};

	// effects
	useEffect(() => {
		const viewerRef = _viewerImageRef.current;
		if (viewerRef != null) {
		}
		viewerRef.addEventListener("touchstart", imageViewerTouchStartHandler, {
			passive: false,
		});
		return () => {
			viewerRef.removeEventListener("touchstart", imageViewerTouchStartHandler);
		};
	}, [imageViewerTouchStartHandler]);

	// render component helpers
	const renderImages = () =>
		_images.map((src, index) => (
			<img
				key={index}
				src={src}
				className={`${"tridi-viewer-image"} ${
					currentImageIndex === index
						? "tridi-viewer-image-shown"
						: "tridi-viewer-image-hidden"
				}`}
				alt=""
			/>
		));

	return (
		<Wrapper ref={_viewerImageRef} onMouseDown={imageViewerMouseDownHandler}>
			{_images?.length > 0 && renderImages()}
		</Wrapper>
	);
};

export default WrappedTridi;

const Wrapper = styled.div<{}>`
  overflow: hidden;
  position: absolute;
  display: flex;
  align-items: center;
  user-select: none;
  outline: none;
  cursor: grab;
  width: 100%;

  .tridi-viewer-image {
    width: 100%;
    aspect-ratio: 1/1;
    margin: auto;
    clip-path: circle(50%);
  }

  .tridi-viewer-image-shown {
    display: block;
  }

  .tridi-viewer-image-hidden {
    display: none;
  }
`;
