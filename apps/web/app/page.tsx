import { ENGINE_VERSION } from "@dormmate/matching";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main>
      <h1>{t("greeting")}</h1>
      <p>{ENGINE_VERSION}</p>
    </main>
  );
}
