import asyncio
from openai import AsyncOpenAI
from openai.helpers import LocalAudioPlayer
from dotenv import load_dotenv

load_dotenv()

openai = AsyncOpenAI()

#De texto a audio

async def text_to_audio(text, tone_and_style_instructions):
  async with openai.audio.speech.with_streaming_response.create(
    model="gpt-4o-mini-tts",
    voice="coral",
    input=text,
    instructions=tone_and_style_instructions,
    response_format="pcm",
  ) as response:
    await LocalAudioPlayer().play(response)


  

