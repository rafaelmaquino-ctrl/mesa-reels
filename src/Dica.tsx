import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

const serif = loadSerif();
const sans = loadSans("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const FPS = 30;

const INK = "#111111";
const GOLD = "#C9A353";
const OFFWHITE = "#F7F5F0";

const HOOK_S = 3.5;
const STEP_S = 3;
const END_S = 3.5;

export type DicaProps = {
  /** URL pública da foto, ou nome de um arquivo em /public */
  foto: string;
  hook: string;
  steps: string[];
  closing: string;
};

export const dicaDuration = (p: Pick<DicaProps, "steps">) =>
  Math.round(FPS * (HOOK_S + p.steps.length * STEP_S + END_S));

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Dica = ({ foto, hook, steps, closing }: DicaProps) => {
  const fotoSrc = foto.startsWith("http") ? foto : staticFile(foto);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const endStart = HOOK_S + steps.length * STEP_S;

  const mainOpacity = interpolate(t, [endStart - 0.4, endStart], [1, 0], clamp);
  const endOpacity = interpolate(t, [endStart - 0.2, endStart + 0.5], [0, 1], clamp);

  const zoom = interpolate(t, [0, total], [1, 1.12], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const bgZoom = interpolate(t, [0, total], [1.25, 1.4], clamp);

  const hookSize = interpolate(t, [HOOK_S - 0.3, HOOK_S + 0.4], [100, 66], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const words = hook.split(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: sans.fontFamily }}>
      {/* fundo desfocado da própria foto */}
      <AbsoluteFill style={{ opacity: mainOpacity, overflow: "hidden" }}>
        <Img
          src={fotoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(46px) brightness(0.55)",
            transform: `scale(${bgZoom})`,
          }}
        />
        <AbsoluteFill
          style={{ background: "linear-gradient(to bottom, rgba(17,17,17,.35), rgba(17,17,17,.88))" }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: mainOpacity }}>
        {/* logo real, canto superior esquerdo, fora da zona coberta pela interface do Instagram */}
        <Img
          src={staticFile("logo-placa.png")}
          style={{ position: "absolute", left: 60, top: 200, width: 230 }}
        />

        {/* foto em moldura, com zoom lento */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 360,
            width: 1000,
            height: 720,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,.5)",
          }}
        >
          <Img
            src={fotoSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }}
          />
        </div>

        {/* gancho + passos */}
        <div style={{ position: "absolute", left: 70, right: 70, top: 1110 }}>
          <div
            style={{
              fontFamily: serif.fontFamily,
              fontSize: hookSize,
              lineHeight: 1.05,
              color: t < HOOK_S ? OFFWHITE : GOLD,
              letterSpacing: "-0.01em",
              display: "flex",
              flexWrap: "wrap",
              columnGap: 0.26 * hookSize,
            }}
          >
            {words.map((w, i) => {
              const s = spring({ frame: frame - Math.round((0.25 + i * 0.12) * fps), fps, config: { damping: 200 } });
              return (
                <span
                  key={i}
                  style={{ opacity: s, transform: `translateY(${(1 - s) * 40}px)`, display: "inline-block" }}
                >
                  {w}
                </span>
              );
            })}
          </div>

          <div style={{ marginTop: 52, display: "flex", flexDirection: "column", gap: 38 }}>
            {steps.map((text, i) => {
              const start = HOOK_S + i * STEP_S;
              const s = spring({ frame: frame - Math.round(start * fps), fps, config: { damping: 200 } });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    opacity: s,
                    transform: `translateX(${(1 - s) * 60}px)`,
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 auto",
                      width: 68,
                      height: 68,
                      borderRadius: 34,
                      backgroundColor: GOLD,
                      color: INK,
                      fontWeight: 600,
                      fontSize: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ color: OFFWHITE, fontSize: 50, fontWeight: 500, lineHeight: 1.2 }}>{text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* encerramento: fundo claro, logo horizontal oficial */}
      <AbsoluteFill
        style={{
          backgroundColor: OFFWHITE,
          opacity: endOpacity,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 64,
        }}
      >
        {(() => {
          const s = spring({ frame: frame - Math.round((endStart + 0.1) * fps), fps, config: { damping: 200 } });
          return (
            <>
              <Img
                src={staticFile("logo-horizontal.png")}
                style={{ width: 760, opacity: s, transform: `scale(${0.92 + 0.08 * s})` }}
              />
              <div
                style={{
                  fontFamily: serif.fontFamily,
                  fontSize: 64,
                  color: INK,
                  textAlign: "center",
                  maxWidth: 820,
                  lineHeight: 1.1,
                  opacity: interpolate(t, [endStart + 0.5, endStart + 1.1], [0, 1], clamp),
                }}
              >
                {closing}
              </div>
            </>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
