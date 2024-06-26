"use client";
import homeStyle from "@style/home.module.css";
import layoutStyle from "@style/layout.module.css";
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import headerStyle from "@style/header.module.css";
import Image from "next/image";

export default function Home() {
    const videoConstraint: MediaStreamConstraints["video"] = {
        width: screen.width,
        height: screen.height,
        facingMode: "environment"
    };
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [ capturing, setCapturing ] = useState(false);
    const [ recordedChunks, setRecordedChunks ] = useState<Blob[]>([]);
    const [ message, setMessage ] = useState("");

    useEffect(() => {
        console.log(!capturing && recordedChunks.length != 0);
        if (!capturing && recordedChunks.length != 0) {
            console.log("download");
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });

            const formData = new FormData();
            formData.append("file", blob, "react-webcam-stream-capture.webm");

            fetch("http://localhost:8000/detectObject", {
                method: "POST",
                body: formData
            }).then((r) => {
                r.json().then(r => {
                    setMessage(r["response"]);
                    console.log(r["response"]);
                });
            });
        }
    }, [ capturing, recordedChunks ]);

    useEffect(() => {
        if (message != "") {
            let utterance = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(utterance);
        }
    }, [ message ]);


    const handleDataAvailable = useCallback(
        ({ data }: BlobEvent) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [ setRecordedChunks ]
    );

    const handleStopCaptureClick = useCallback(() => {
        console.log("stop");
        mediaRecorderRef.current?.stop();
        setCapturing(false);
    }, []);

    const handleStartCaptureClick = useCallback(() => {
        console.log("start");
        if (webcamRef.current?.stream == null) return;
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current?.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current?.start();
        setTimeout(handleStopCaptureClick, 5000);
    }, [ handleDataAvailable, handleStopCaptureClick ]);

    return (
        <>
            <div className={layoutStyle.mainContainer}>
                <div className={layoutStyle.headerContainer}>
                    <Link href={"/chat"} className={headerStyle.changeModeButton}>
                        <Image src={"/logo.svg"} alt={"logo"} fill={true}/>
                    </Link>
                    <button onClick={handleStartCaptureClick} className={headerStyle.shootButton}></button>
                    <div className={headerStyle.placeholder}></div>
                </div>
                <div className={layoutStyle.mainContent}>
                    <div className={homeStyle.cameraContainer}>
                        <Webcam className={homeStyle.webcam} videoConstraints={videoConstraint} ref={webcamRef}/>
                    </div>
                </div>
            </div>
        </>
    );
}
