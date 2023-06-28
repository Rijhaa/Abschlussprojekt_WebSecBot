# Abschlussprojekt_WebSecBot 🤖
## WebSecBot

WebSecBot ist ein Bot zur Umgehung von Website-Einschränkungen und zur Automatisierung von Webformularen. Der Name des Projekts ist WebSecBot und ist zusammengestellt aus den Worten Web, Security und Bot.

## Motivation 💪

Dieses Projekt wurde entwickelt, um die Sicherheit von Webapplikationen zu verstehen und zu testen. Es ermöglicht das Erlernen der Sicherheitsmechanismen im Web und wie man diese verstärken kann.

## Funktionen 🎯

- Umgehung von Website-Einschränkungen wie Warteschleifen bei Loadingpages
- Eingabe von vorinstallierten Daten in Webformulare
- Automatische Lösung von Captchas

## Installation ⚙️

1. Lade das Repository als ZIP-Datei herunter und entpacke es auf deinem lokalen Computer
2. Navigieren Sie zum Repository-Verzeichnis: `cd WebSecBot`
3. Nun kannst du die gewünschte Datei öffnen und so den Sourcecode sehen

## Verwendung 🚀

1. Um den Bot verwenden zu können, muss man sich in Visual Studio Code folgende Pakete mit `npm install <Paketname>` installieren:
   - puppeteer
   - puppeteer-extra
   - puppeteer-extra-plugin-stealth
   - request-promise-native
   - promise-poller

2. Im Script müssen folgende Konfigurationswerte angepasst werden:
   - apiKey: Der API-Schlüssel für den Captcha-Lösungsdienst (z.B., 'adbc7d647ca8f20eebd39808f859aa81')
   - config.sitekey: Der Site-Schlüssel des Captcha (z.B., '6LdTUqEmAAAAAAe1-sUMJBC7a93qQfYPmlM7v-bs')
   - config.pageurl: Die URL der Zielseite (z.B., 'https://www.offspring.co.uk/view/product/offspring_catalog/2,20/x8qVNsFtXd')


