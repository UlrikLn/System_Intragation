import requests
from bs4 import BeautifulSoup

html = requests.get("https://en.wikipedia.org/wiki/List_of_Monty_Python_projects").text
parsed_html = BeautifulSoup(html, "lxml")

tags = parsed_html.find("div",{ "class": "mw-parser-out" } )

projects = {}

current_category = "Initial_Category"

for tag in tags: 
    if tag.name == "h2":
        current_category = tag.text.replace("[edit]", "")
        projects[current_category] = []
    elif tag.name == "ul":
        for li in tag.find_all("li"):
            projects[current_category].append(li.text)

print(projects)