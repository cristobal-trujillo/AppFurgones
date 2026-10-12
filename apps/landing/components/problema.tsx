import { Card, Section, SectionHeading } from "@/components/ui";

const dolores = [
  {
    titulo: "El apoderado espera a ciegas",
    texto:
      "No sabe si el furgón viene atrasado, si su hijo alcanzó a subir, ni a qué hora llegó. La única vía es llamar al conductor mientras maneja.",
  },
  {
    titulo: "El conductor arma la ruta de memoria",
    texto:
      "Cada cambio de nómina, ausencia o dirección nueva significa reordenar el recorrido sobre la marcha y perder tiempo en el camino.",
  },
  {
    titulo: "No queda registro de nada",
    texto:
      "Si un apoderado reclama por un atraso o por una entrega, no hay forma de reconstruir qué pasó ese día ni a qué hora.",
  },
];

export function Problema() {
  return (
    <Section soft>
      <SectionHeading
        eyebrow="El problema"
        title="Coordinar un furgón por WhatsApp no escala"
        lead="Doce apoderados, un grupo de mensajes y un conductor que no puede contestar mientras conduce. La información existe, pero llega tarde o no llega."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {dolores.map((d) => (
          <Card key={d.titulo}>
            <h3 className="text-lg font-bold">{d.titulo}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
              {d.texto}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
