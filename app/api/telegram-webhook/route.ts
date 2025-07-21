import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const chatId = body?.message?.chat?.id;
  const text = body?.message?.text;

  if (text === '/start' && chatId) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🎉 Welcome! Tap the button below to start earning:",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Tap to Earn",
                url: "https://hash-coin-alpha.vercel.app"
              }
            ]
          ]
        }
      })
    });

    return NextResponse.json(await response.json());
  }

  return NextResponse.json({ ok: true });
}
