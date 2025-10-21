import Image from "next/image";
import Link from "next/link";
import { Button } from "primereact/button";

interface HeaderProps {
  title: string;
  subtitle: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export default function Header({
  title,
  subtitle,
  showAddButton = false,
  onAddClick,
}: HeaderProps) {
  return (
    <div
      className="bg-white shadow-lg border-b-4"
      style={{ borderBottomColor: "var(--brand-color)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Main Flex Container */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Left Section: Logo + Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              <div
                className="p-2 rounded-lg shadow-md flex justify-center items-center"
                style={{ backgroundColor: "var(--brand-color)" }}
              >
                <Image
                  src="/image.png"
                  alt="Article 26 Hackathon Logo"
                  width={70}
                  height={70}
                  className="rounded-md object-contain"
                  priority
                />
              </div>
            </div>

            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "var(--brand-color)" }}
              >
                {title}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Section: Buttons */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            {/* <Link href="/api-doc">
              <Button
                label="API Docs"
                icon="pi pi-book"
                outlined
                style={{
                  borderColor: "var(--brand-color)",
                  color: "var(--brand-color)",
                }}
                className="hover:bg-gray-50 transition-colors w-full sm:w-auto"
              />
            </Link> */}

            {showAddButton && onAddClick && (
              <Button
                label="Add New User"
                icon="pi pi-plus"
                onClick={onAddClick}
                style={{
                  backgroundColor: "var(--brand-color)",
                  borderColor: "var(--brand-color)",
                }}
                className="hover:opacity-90 transition-opacity w-full sm:w-auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
