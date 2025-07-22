import fetch from 'node-fetch';

export class TelegramBot {
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  async sendMessage(chatId: number, text: string) {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    console.log(`Sending message to chat ${chatId}: ${text}`);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    return res.json();
  }
}
