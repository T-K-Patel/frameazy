"use client";
import React from "react";
import { Img as ReactImage, type ImgProps } from "react-image";

export function Img(props: ImgProps) {
	const [show, setShow] = React.useState<boolean>(false);

	React.useEffect(() => {
		setShow(true);
	}, []);

	if (!show) return <></>;

	return <ReactImage {...props} />;
}
