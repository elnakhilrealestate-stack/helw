import { seedDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    return Response.json(await seedDemoData());
  } catch (error) {
    console.error("Demo bootstrap failed", error);
    return Response.json({ message: "Unable to initialize the demo workspace" }, { status: 500 });
  }
}
