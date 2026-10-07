import { Composition } from "remotion";
import { Dica, FPS, dicaDuration, type DicaProps } from "./Dica";

const defaultProps: DicaProps = {
  foto: "foto-demo.jpg",
  hook: "A foto do prato em 3 passos",
  steps: [
    "Leve o prato até a janela.",
    "Deixe a luz entrar de lado.",
    "Fotografe de cima, de perto, sem flash.",
  ],
  closing: "Salva pro próximo prato novo.",
};

export const Root = () => (
  <Composition
    id="Dica"
    component={Dica}
    width={1080}
    height={1920}
    fps={FPS}
    defaultProps={defaultProps}
    durationInFrames={dicaDuration(defaultProps)}
    calculateMetadata={({ props }) => ({
      durationInFrames: dicaDuration(props),
    })}
  />
);
