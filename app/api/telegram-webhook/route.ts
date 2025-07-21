import { NextResponse } from 'next/server';
import { TelegramBot } from '@/lib/telegramBot';

export async function POST(req: Request) {
  const body = await req.json();

  const chatId = body?.message?.chat?.id;
  const text = body?.message?.text;

  if (text === '/start') {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);
    await bot.sendMessage(chatId, '🎉 Welcome to HashCoin Bot!');
  }

  return NextResponse.json({ ok: true });
}
