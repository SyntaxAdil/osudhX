import Image from "next/image";
interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}
const Logo = ({ width = 120, height = 60, className = "" }: LogoProps) => {
  return (
    <Image
      src="/logo.png"
      alt="OsudhX"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};
export default Logo;
