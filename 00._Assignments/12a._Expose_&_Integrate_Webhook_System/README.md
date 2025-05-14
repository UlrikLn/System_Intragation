# Integrator Setup Guide

## 📦 1. Opsætning af projektet

1. Start med at sætte projektet op som i mappen `integrator_2`. Du kan enten:
   - Klone hele mappen, **eller**
   - Kun hente filen `integrator.js`.

2. Navigér til projektmappen i terminalen og kør følgende kommandoer (Hvis du kun hentede filen):

   ```bash
   npm init -y
   npm install express body-parser node-fetch
   ```

---

## 🌐 2. Konfiguration af ngrok eller lokal netværksadgang

- Hvis du skal integrere til serveren eksternt, download **[ngrok](https://ngrok.com/)** ellers brug din LAN-IP, hvis klienten er på samme netværk.
- Opret en **ngrok-konto**, og kopiér din **auth token**.
- Aktiver nøglen i terminalen:

   ```bash
   ngrok config add-authtoken <din_auth_token>
   ```

---

## 🚀 3. Kørsel af server

1. Start serveren:

   ```bash
   node integrator.js
   ```

2. I en **anden terminal**, start ngrok (hvis nødvendigt):

   ```bash
   ngrok http 3000
   ```

3. Brug den genererede **ngrok URL** til at sende test-requests via `curl`.

> **OBS:** Sørg for at bruge den nyeste url af ngrok fra exposeren.

---

## 🔍 4. Test og curl-kommandoer

Åbn `http://localhost:4000` i din browser for at følge med i, hvad der sker.

### ✅ Registrér webhook
```bash
curl --json '{
  "url": "https://IntegratorNgrokUrl:4000/hook",
  "eventTypes": [
    "payment_received",
    "payment_processed",
    "invoice_processing",
    "invoice_completed"
  ]
}' https://ExposeeNgrokUrl/webhooks/register
```

### 📩 Udløs events
```bash
curl --data '{"payload":{"invoiceId":"INV-42"}}' https://ExposeeNgrokUrl/events/invoice_processing

curl --data '{"payload":{"amount":123.45,"currency":"EUR","status":"ok"}}' https://ExposeeNgrokUrl:3000/events/payment_processed

curl --data '{"payload":{"invoiceId":"INV-42","total":599}}' https://ExposeeNgrokUrl:3000/events/invoice_completed

curl --data '{"payload":{"invoiceId":"INV-42"}}' https://ExposeeNgrokUrl:3000/events/invoice_processing

curl -X POST https://ExposeeNgrokUrl:3000/ping
```

### ❌ Afregistrér webhook
```bash
curl --json '{ "url": "https://IntegratorNgrokUrl:4000/hook" }' https://ExposeeNgrokUrl/webhooks/unregister
```

---

## 📝 Noter

- Husk at udskifte `dinNgrok` og `minNgrok` med de faktiske ngrok-URLs.
- Sørg for at ngrok og din lokale server kører samtidigt for at teste korrekt.