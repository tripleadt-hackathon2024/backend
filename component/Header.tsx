import headerStyle from "@style/header.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <>
            <Link href={"/chat"} className={headerStyle.changeModeButton}>
                <Image src={"/logo.svg"} alt={"logo"} fill={true}/>
            </Link>
            <Link href={"/"} className={headerStyle.shootButton}></Link>
            <div className={headerStyle.placeholder}></div>
        </>
    );
}