from discord_webhook import DiscordWebhook

def convert_to_days(duration):
    days = 0

    if "years" in duration:
        years, days_part = duration.split(" years ")
        days_part = days_part.replace(" days", "")
        days += int(years) * 365

    elif "year" in duration:
        year, days_part = duration.split(" year ")
        days_part = days_part.replace(" days", "")
        days += int(year) * 365

    elif "days" in duration:
        days_part = duration.replace(" days", "")
        days += int(days_part)

    else:
        days_part = duration.replace(" day", "")
        days += int(days_part)

    return days

file_path = "Upcoming.txt"

with open(file_path, "r") as file:
    input_data = file.readlines()

sorted_data = sorted(input_data, key=lambda item: convert_to_days(item.split(",")[1].strip()))

with open("Upcoming.txt", "w") as output_file:
    for item in sorted_data:
        name, duration = item.strip().split(",")
        days = convert_to_days(duration.strip())
        if (days-1) == 0:
            webhook = DiscordWebhook(url="WEBHOOK URL", content=f"@here TIME IS OF THE ESSENCE! {name} is available! https://www.nationstates.net/page=create_nation1")
            response = webhook.execute()
            continue
        if (days-1 < 7):
            webhook = DiscordWebhook(url="WEBHOOK URL", content=f"Reminder that {name} is available in {days-1} days")
            response = webhook.execute()
        output_file.write(f"{name},{days-1}\n")