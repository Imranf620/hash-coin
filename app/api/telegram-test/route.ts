import { TelegramBot } from '@/lib/telegramBot';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
    console.log("Received Telegram message:", JSON.stringify(req, null, 2));

  const chatId = url.searchParams.get('chatId');
  const message = url.searchParams.get('message') || '🚀 Hello from HashCoin App via App Router!';

  if (!chatId) {
    return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
  }

  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);
  const result = await bot.sendMessage(Number(chatId), message);

  return NextResponse.json(result);
}
