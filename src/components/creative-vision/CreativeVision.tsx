'use client'

import { useRouter } from "next/navigation";

const CreativeVision = () => {
  const router = useRouter();

  return (
    <section
      className="py-12 px-4 text-center"
      style={{
        background: "linear-gradient(90deg, #262626 0%, #404040 100%)",
      }}
    >
      <h1 className="text-4xl font-amandine mb-4 text-white">
        The Creative Vision Of Roberto
      </h1>
      <p className="text-xl mb-6 text-white">
        Shape the Sparkle of Your Design Vision
      </p>
      <button
        onClick={() => router.push("/customize")}
        style={{
          position: "relative",
          minWidth: 300,
          height: 50,
          background: "linear-gradient(90deg, #D9946C 0%, #F27405 100%)",
          borderRadius: 6,
          fontWeight: "600",
          fontSize: 18,
          color: "white",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 40, // space for the star icon
          paddingRight: 20,
          border: "none",
          cursor: "pointer",
        }}
      >
        <img
          src="/icons/star.png"
          alt="Star Icon"
          style={{
            position: "absolute",
            left: 12,
            width: 18,
            height: 18,
            pointerEvents: "none",
          }}
        />
        Design Your Signature Piece!
      </button>
    </section>
  );
};

export default CreativeVision;
