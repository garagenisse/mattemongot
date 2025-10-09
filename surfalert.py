import requests
import os
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import io
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
from dotenv import load_dotenv

load_dotenv("surf.env")

API_KEY = os.getenv("OWM_KEY")
BOT_TOKEN = os.getenv("TG_TOKEN")
CHAT_ID = os.getenv("TG_CHAT")

LOCATIONS = {
    "Lisch": (58.502152737979706, 13.190791101154266),
    "Nynäs": (57.99154161076433, 16.51924378969513),
    "Playa Mjörn": (57.931096530466135, 12.50269618215273),
    "Freddes": (57.97520646830233, 11.684607488466328)
}

def surf_score(entry):
    """Symmetrisk poäng runt 10 m/s."""
    wind = entry["wind"]["speed"]
    return max(0, 10 - abs(10 - wind))

def get_forecast(lat, lon):
    """Hämta 5-dygnsprognos från OWM."""
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    resp = requests.get(url).json()
    if "list" not in resp:
        raise ValueError(f"Fel vid hämtning av prognos: {resp}")
    return resp["list"]

def get_colormap():
    """Vitt–gult–grönt–rött–lila med mjuk övergång."""
    base_colors = ["#ffffff", "#fff75e", "#4caf50", "#ff4c4c", "#800080"]
    return LinearSegmentedColormap.from_list("surf_fade", base_colors)

def send_telegram_image(image_bytes):
    """Skicka graf till Telegram."""
    if not BOT_TOKEN or not CHAT_ID:
        print("⚠️ Telegram-data saknas, skickar inte bild.")
        return
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
    files = {"photo": ("forecast.png", image_bytes)}
    data = {"chat_id": CHAT_ID, "caption": "🌊 Vindsurfprognos kommande dagar"}
    requests.post(url, data=data, files=files)

def main():
    rows = []
    for name, (lat, lon) in LOCATIONS.items():
        for entry in get_forecast(lat, lon):
            t = datetime.fromtimestamp(entry["dt"])
            score = surf_score(entry)
            rows.append({"Ort": name, "Tid": t, "Score": score})

    df = pd.DataFrame(rows)
    pivot = df.pivot(index="Ort", columns="Tid", values="Score")

    cmap = get_colormap()
    plt.figure(figsize=(12, 4))
    plt.imshow(pivot, aspect="auto", cmap=cmap, interpolation="nearest", vmin=0, vmax=10)
    plt.xticks(range(len(pivot.columns)), [t.strftime("%a %H") for t in pivot.columns], rotation=45)
    plt.yticks(range(len(pivot.index)), pivot.index)
    plt.colorbar(label="Surf-score (0–10)")
    plt.title("Vindsurf-prognos kommande 5 dygn")
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=200)
    buf.seek(0)
    send_telegram_image(buf)
    plt.show()

if __name__ == "__main__":
    main()
