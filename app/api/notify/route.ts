export async function POST(request: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json({ error: "No webhook configured" }, { status: 500 });
  }

  const { date, time } = await request.json();

  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = `${time.hour}:${String(time.minute).padStart(2, "0")} ${time.ampm}`;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "💌 **She said YES!**",
      embeds: [
        {
          title: "🗓️ Date confirmed!",
          description: `She picked **${formattedDate}** at **${formattedTime}**\n\nDon't be late. 😤`,
          color: 0xff69b4,
          footer: { text: "dateproposal.app 💝" },
        },
      ],
    }),
  });

  return Response.json({ ok: true });
}