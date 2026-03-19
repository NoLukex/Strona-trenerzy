from __future__ import annotations

import csv
import hashlib
import json
import re
import unicodedata
from pathlib import Path
from urllib.parse import parse_qs, parse_qsl, unquote, urlencode, urlparse, urlunparse


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CSV = ROOT / "data" / "gdansk_trenerzy_personalni_2026.csv"
OUT_PROFILES_TS = ROOT / "data" / "gdanskTrainerProfiles.ts"
OUT_QW_TS = ROOT / "data" / "gdanskTrainerQuickWinOverrides.ts"
OUT_LINKS_MD = ROOT.parent / "Gdansk" / "localhost_links_gdansk_email_trainers.md"
OUT_AUDIT_MD = ROOT / "reports" / "gdansk_personalization_audit.md"

GENERIC_TITLE_KEYS = {"instagram", "facebook", "aleo", "sites google"}
DISPLAY_NAME_OVERRIDES = {
    "adamdzieciatko": "Adam Dzieciątko",
    "adrianbialecki": "Adrian Białecki",
    "agnieszkatrenerka": "Agnieszka Trenerka",
    "alicjawiczling": "Alicja Wiczling",
    "amberfitness": "Amber Fitness",
    "ameryk marcin trening personalny gdansk trener personalny trener osobisty gdansk powrot do formy trener": "Marcin Ameryk",
    "astudio club": "A Studio Club",
    "bluefit": "Blue Fit",
    "bycpro": "Być Pro",
    "ciaoaktywnie": "Ciao Aktywnie",
    "czasnaforme": "Czas Na Formę",
    "daniel przybysz trener personalny i medyczny": "Daniel Przybysz",
    "dawidsadowski": "Dawid Sadowski",
    "dominik ciolek przygotowanie motoryczne trener personalny gdansk": "Dominik Ciołek",
    "dominika krawczyk trenerka personalna kobiet": "Dominika Krawczyk",
    "fabrykadobrejformy": "Fabryka Dobrej Formy",
    "fitnessfitback": "Fitness Fitback",
    "gracjanfularczyk": "Gracjan Fularczyk",
    "how to move trener personalny i dietetyk gdansk wrzeszcz": "How To Move",
    "impuls zdrowia studio treningu ems i treningu personalnego gdansk osowa": "Impuls Zdrowia",
    "irekzak": "Irek Zak",
    "jakub trenerpersonalny": "Jakub Trener Personalny",
    "k2 trening medyczny gdansk": "K2 Trening Medyczny",
    "kamil17banaczek": "Kamil Banaczek",
    "karolinapawlak": "Karolina Pawlak",
    "ksmovement": "KS Movement",
    "liftstudio": "Lift Studio",
    "lukaszjank": "Łukasz Jank",
    "maciej iwaniuk trener personalny": "Maciej Iwaniuk",
    "maciejwosik": "Maciej Wosik",
    "mindandmotion": "Mind & Motion",
    "movegym 2 0 studio treningowe": "MOVEGYM 2.0",
    "nkteam": "NK Team",
    "patrykkazyszka": "Patryk Kazyszka",
    "przemyslaw kozak trener personalny i dietetyk online": "Przemysław Kozak",
    "pw studio treningu personalnego gdansk": "PW Studio Treningu Personalnego",
    "rafalkolodziejczak": "Rafał Kołodziejczak",
    "rebellgirlm": "Rebell Girl M",
    "respectyourself": "Respect Yourself",
    "sewerynbazychowski": "Seweryn Bazychowski",
    "smart body trainer trener personalny gdansk": "Smart Body Trainer",
    "speed4fit treningi ems gdansk studio treningu personalnego": "Speed4Fit",
    "sport life balance studio treningu personalnego gdansk": "Sport Life Balance",
    "strongbyoktaoktawiabrozyna": "Strong by Okta",
    "suchcickifunkcjonalnie": "Suchcicki Funkcjonalnie",
    "tatarworkout webflow io": "Tatar Workout",
    "tb trainer": "TB Trainer",
    "trainbetter": "Train Better",
    "trainpro": "Train Pro",
    "trener personalny jakub wodyk": "Jakub Wodyk",
    "trener personalny i studio treningow ems fit point ems": "Fit Point EMS",
    "trener personalny igor janik olimpijczyk": "Igor Janik",
    "trenergrosz": "Trener Grosz",
    "trenerpremium": "Trener Premium",
    "w ciaglym ruchu": "W Ciągłym Ruchu",
    "wojtek urbanski trener personalny": "Wojtek Urbański",
}
EMAIL_NAME_OVERRIDES = {
    "adrian13.acl@gmail.com": "Calistrength",
    "bartek.weber.2001@gmail.com": "Bartek Weber",
    "szymon@brazulewicz.pl": "Szymon Brazulewicz",
    "fijasweronika@gmail.com": "Weronika Fijas",
    "olayswag990@gmail.com": "Olay SW",
    "urndnz@gmail.com": "Deniz Urun",
    "joanna.detmer11@gmail.com": "Asia Detmer-Falacińska",
    "michaljeznach@wp.pl": "Michał Jeznach",
    "piotrkacpergorajski@gmail.com": "Piotr Gorajski",
    "fizjo.mbr@wp.pl": "Fizjo MBR",
    "renato-gym@wp.pl": "Renato Gym",
    "maciejiwaniuk97@gmail.com": "Maciej Iwaniuk",
}
PERSONAL_NAME_HINTS = {
    "adam", "adrian", "agnieszka", "alicja", "asia", "bartosz", "daniel", "dawid", "deniz",
    "dominik", "dominika", "gracjan", "igor", "irek", "jakub", "joanna", "kamil", "karol",
    "karolina", "kasia", "lukasz", "łukasz", "maciej", "marcin", "michał", "michal", "oktawia",
    "patryk", "piotr", "przemysław", "przemyslaw", "rafał", "rafal", "renato", "seweryn",
    "szymon", "weronika", "wojtek",
}
FEMALE_NAME_HINTS = {
    "agnieszka", "alicja", "asia", "dominika", "joanna", "karolina", "kasia", "oktawia", "ola", "olay",
    "weronika", "wiktoria",
}
PL_TRANSLIT = str.maketrans(
    {
        "ą": "a",
        "ć": "c",
        "ę": "e",
        "ł": "l",
        "ń": "n",
        "ó": "o",
        "ś": "s",
        "ź": "z",
        "ż": "z",
        "Ą": "A",
        "Ć": "C",
        "Ę": "E",
        "Ł": "L",
        "Ń": "N",
        "Ó": "O",
        "Ś": "S",
        "Ź": "Z",
        "Ż": "Z",
    }
)

PALETTES = [
    {"accent": "#94c918", "accentDark": "#73a10f", "accentSoft": "#d6ef8a", "bg": "#090b05", "bgSoft": "#12170a", "surface": "#171f0e", "surfaceAlt": "#222d14", "border": "#33411c", "textMuted": "#b6c5a1"},
    {"accent": "#f97316", "accentDark": "#c2410c", "accentSoft": "#fdba74", "bg": "#100905", "bgSoft": "#1a1009", "surface": "#25160d", "surfaceAlt": "#321d10", "border": "#4a2a14", "textMuted": "#d4b89f"},
    {"accent": "#06b6d4", "accentDark": "#0e7490", "accentSoft": "#67e8f9", "bg": "#060b0d", "bgSoft": "#0d1519", "surface": "#112027", "surfaceAlt": "#16303b", "border": "#24414f", "textMuted": "#a8c8cf"},
    {"accent": "#eab308", "accentDark": "#a16207", "accentSoft": "#fde68a", "bg": "#0f0d05", "bgSoft": "#191409", "surface": "#241c0d", "surfaceAlt": "#35280f", "border": "#4f3b14", "textMuted": "#d5c39a"},
    {"accent": "#ef4444", "accentDark": "#b91c1c", "accentSoft": "#fca5a5", "bg": "#120707", "bgSoft": "#1d0d0d", "surface": "#291313", "surfaceAlt": "#391818", "border": "#512222", "textMuted": "#d0acac"},
    {"accent": "#22c55e", "accentDark": "#15803d", "accentSoft": "#86efac", "bg": "#061008", "bgSoft": "#0d1a11", "surface": "#142617", "surfaceAlt": "#1c381f", "border": "#2a4e2c", "textMuted": "#a8c9af"},
]

NICHE_PRESETS = {
    "trening medyczny / fizjo": {
        "hero_top": "TRENING MEDYCZNY",
        "hero_accent": "BEZ BÓLU I CHAOSU.",
        "hero_text": "Współpraca oparta na analizie ruchu, bezpiecznej progresji i planie dopasowanym do codziennego rytmu.",
        "about_text": "Praca z osobami po kontuzjach, przeciążeniach i z celem bezpiecznego powrotu do formy.",
        "value_props": [
            {"title": "Start od konsultacji", "desc": "Najpierw diagnoza ruchowa i jasny plan pierwszych 4 tygodni."},
            {"title": "Od bólu do sprawności", "desc": "Plan prowadzi od bezpiecznych wzorców ruchu do regularnego treningu."},
            {"title": "Cotygodniowa korekta", "desc": "Regulujemy obciążenie i technikę na podstawie realnych reakcji ciała."},
            {"title": "Wyniki mierzalne", "desc": "Mniej bólu, lepszy zakres ruchu i stabilna poprawa sprawności."},
        ],
        "plans": [
            {"name": "Start Bez Bólu", "subtitle": "Pierwsze 4 tygodnie pod kontrolą.", "price": "299 zł", "period": "/ mies.", "features": ["Konsultacja i analiza ruchu", "Plan medyczny pod objawy", "Korekta techniki raz w tygodniu"], "ctaLabel": "Wybieram Start Bez Bólu"},
            {"name": "Ruch + Siła", "subtitle": "Kompleksowe prowadzenie 1:1.", "price": "599 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Plan siłowy i mobilność", "Cotygodniowy raport i korekty", "Kontakt bieżący"], "ctaLabel": "Wybieram Ruch + Siła"},
            {"name": "Performance Care", "subtitle": "Dla ambitnych celów i regularnego monitoringu.", "price": "999 zł", "period": "/ mies.", "features": ["Prowadzenie 1:1 premium", "Priorytetowe konsultacje", "Plan na 90 dni"], "ctaLabel": "Wybieram Performance Care"},
        ],
        "faq": [
            {"q": "Czy mogę trenować przy bólu pleców lub kolan?", "a": "Tak, plan startuje od bezpiecznych zakresów i stopniowej progresji."},
            {"q": "Jak szybko poczuję ulgę?", "a": "Pierwsze zmiany zwykle pojawiają się po 2 do 4 tygodniach regularnej pracy."},
            {"q": "Czy potrzebuję siłowni?", "a": "Nie zawsze. Start jest możliwy także w domu z podstawowym sprzętem."},
            {"q": "Czy jest kontakt między treningami?", "a": "Tak, szybkie korekty między sesjami pomagają utrzymać bezpieczny progres."},
        ],
        "lead_magnet_title": "Pobierz checklistę: 7 kroków treningu bez bólu",
        "lead_magnet_text": "Krótki przewodnik, jak trenować bezpiecznie i wracać do formy bez improwizacji.",
        "quickwin": "Rozdzielić komunikację na ból i powrót do formy z osobnymi CTA.",
    },
    "metamorfoza sylwetki": {
        "hero_top": "METAMORFOZA",
        "hero_accent": "KROK PO KROKU.",
        "hero_text": "Program pod redukcję lub budowę sylwetki z jasnym procesem, kontrolą postępu i wsparciem 1:1.",
        "about_text": "Współpraca skupiona na realnych efektach, prostym planie i utrzymaniu regularności na co dzień.",
        "value_props": [
            {"title": "Plan pierwszych 30 dni", "desc": "Jasny start: diagnoza, plan i pierwsze nawyki bez przeciążenia."},
            {"title": "Dowody efektów", "desc": "Case studies z wynikiem, czasem współpracy i kontekstem klienta."},
            {"title": "Jedno główne CTA", "desc": "Krótka droga od wejścia na stronę do umówienia konsultacji."},
            {"title": "Cotygodniowe korekty", "desc": "Regularna analiza i dopasowanie planu pod realny progres."},
        ],
        "plans": [
            {"name": "Start Sylwetka", "subtitle": "Plan i wdrożenie na 4 tygodnie.", "price": "299 zł", "period": "/ mies.", "features": ["Plan treningowy pod cel", "Podstawy odżywiania i nawyków", "Kontrola postępu raz w tygodniu"], "ctaLabel": "Wybieram Start Sylwetka"},
            {"name": "Transformacja 1:1", "subtitle": "Pełne prowadzenie pod efekt.", "price": "599 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Plan żywieniowy i monitoring", "Cotygodniowy raport", "Kontakt bieżący"], "ctaLabel": "Wybieram Transformację 1:1"},
            {"name": "VIP Metamorfoza", "subtitle": "Dla osób z ambitnym celem.", "price": "999 zł", "period": "/ mies.", "features": ["Priorytetowe konsultacje", "Strategia 90 dni", "Pełna personalizacja"], "ctaLabel": "Wybieram VIP Metamorfozę"},
        ],
        "faq": [
            {"q": "Czy dam radę, jeśli zaczynam od zera?", "a": "Tak, plan jest skalowany do poziomu startowego i możliwości tygodnia."},
            {"q": "Kiedy widać pierwsze efekty?", "a": "Najczęściej po 3 do 4 tygodniach widać pierwsze różnice w obwodach i samopoczuciu."},
            {"q": "Czy dieta jest restrykcyjna?", "a": "Nie. Priorytetem są nawyki i plan, który da się utrzymać długoterminowo."},
            {"q": "Jak wygląda kontakt?", "a": "Kontakt bieżący i cotygodniowy raport pomagają utrzymać tempo progresu."},
        ],
        "lead_magnet_title": "Pobierz plan: pierwsze 30 dni metamorfozy",
        "lead_magnet_text": "Gotowy start pod redukcję lub budowę sylwetki z checklistami i prostymi zasadami.",
        "quickwin": "Pokazać konkretne efekty i uprościć przejście do konsultacji.",
    },
    "trening + odzywianie": {
        "hero_top": "TRENING + ODŻYWIANIE",
        "hero_accent": "SPÓJNY PLAN DZIAŁANIA.",
        "hero_text": "Łączymy trening, odżywianie i monitoring postępu, żeby wynik był stabilny i realny do utrzymania.",
        "about_text": "Model współpracy dla osób, które chcą poprawić sylwetkę i zdrowie metaboliczne bez losowych metod.",
        "value_props": [
            {"title": "Plan 2w1", "desc": "Trening i odżywianie ustawione pod jeden cel i jeden harmonogram."},
            {"title": "Regularny monitoring", "desc": "Cotygodniowe check-iny i szybkie korekty planu."},
            {"title": "Dieta do utrzymania", "desc": "Praktyczne zalecenia i nawyki bez skrajności."},
            {"title": "Jasna ścieżka startu", "desc": "Od pierwszej konsultacji wiesz, co robić i jak mierzyć efekt."},
        ],
        "plans": [
            {"name": "Start Fit", "subtitle": "Pierwsze 4 tygodnie planu.", "price": "299 zł", "period": "/ mies.", "features": ["Plan treningowy", "Zalecenia żywieniowe", "Kontrola postępu raz w tygodniu"], "ctaLabel": "Wybieram Start Fit"},
            {"name": "Prowadzenie Kompleksowe", "subtitle": "Najczęściej wybierany pakiet.", "price": "599 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Szczegółowy monitoring", "Raport i korekty co tydzień", "Kontakt bieżący"], "ctaLabel": "Wybieram Prowadzenie Kompleksowe"},
            {"name": "VIP Nutrition + Training", "subtitle": "Premium opieka i strategia 90 dni.", "price": "999 zł", "period": "/ mies.", "features": ["Prowadzenie premium 1:1", "Priorytetowy kontakt", "Strategia 90 dni i plan utrzymania"], "ctaLabel": "Wybieram VIP"},
        ],
        "faq": [
            {"q": "Czy muszę liczyć każdą kalorię?", "a": "Nie. Na start stawiamy na najważniejsze nawyki i prosty system monitoringu."},
            {"q": "Jak łączycie trening i odżywianie?", "a": "Plan treningowy i żywieniowy są ustawione pod ten sam cel i ten sam horyzont czasu."},
            {"q": "Czy mogę zacząć przy nieregularnym trybie pracy?", "a": "Tak, plan jest dopasowywany do realnego tygodnia i możliwości."},
            {"q": "Jak mierzymy efekt?", "a": "Co tydzień analizujemy postęp i aktualizujemy plan działania."},
        ],
        "lead_magnet_title": "Pobierz plan startowy: trening + odżywianie",
        "lead_magnet_text": "Praktyczny przewodnik, jak połączyć trening i nawyki żywieniowe bez chaosu.",
        "quickwin": "Wyraźnie połączyć ofertę treningową i żywieniową na jednej ścieżce.",
    },
    "trening personalny 1:1": {
        "hero_top": "TRENING 1:1",
        "hero_accent": "POD TWÓJ CEL.",
        "hero_text": "Indywidualna współpraca oparta na jasnym planie, regularnych korektach i prostej ścieżce startu.",
        "about_text": "Oferta skupia się na klarownym procesie: konsultacja, plan, wdrożenie i cotygodniowe korekty.",
        "value_props": [
            {"title": "Start od konsultacji", "desc": "Ustalamy cel, poziom startowy i realny harmonogram."},
            {"title": "Jasna oferta 3 pakietów", "desc": "Klient od razu widzi różnice między pakietami i wybiera poziom wsparcia."},
            {"title": "Cotygodniowy monitoring", "desc": "Raport i korekty utrzymują tempo progresu."},
            {"title": "Kontakt bieżący", "desc": "Szybkie odpowiedzi i konkretne wskazówki do wdrożenia."},
        ],
        "plans": [
            {"name": "Start 1:1", "subtitle": "Plan i wdrożenie podstaw.", "price": "299 zł", "period": "/ mies.", "features": ["Plan treningowy dopasowany do celu", "Korekta techniki", "Kontakt raz w tygodniu"], "ctaLabel": "Wybieram Start 1:1"},
            {"name": "Prowadzenie 1:1", "subtitle": "Najczęściej wybierany pakiet.", "price": "599 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Cotygodniowy raport i korekty", "Wsparcie żywieniowe", "Kontakt bieżący"], "ctaLabel": "Wybieram Prowadzenie 1:1"},
            {"name": "VIP Hybrid", "subtitle": "Opieka premium i strategia 90 dni.", "price": "999 zł", "period": "/ mies.", "features": ["Priorytetowe wsparcie", "Strategia 90 dni", "Pełna personalizacja"], "ctaLabel": "Wybieram VIP Hybrid"},
        ],
        "faq": [
            {"q": "Czy mogę zacząć od zera?", "a": "Tak, plan jest skalowany do poziomu i aktualnej sprawności."},
            {"q": "Jak szybko odpisujesz po zgłoszeniu?", "a": "Najczęściej w ciągu 24 godzin z propozycją pierwszego kroku."},
            {"q": "Czy współpraca jest tylko stacjonarna?", "a": "Możliwy jest model stacjonarny, online lub hybrydowy."},
            {"q": "Jak wygląda pierwszy miesiąc?", "a": "Start od konsultacji, wdrożenie planu i cotygodniowe korekty."},
        ],
        "lead_magnet_title": "Pobierz plan startowy: pierwsze 7 dni współpracy",
        "lead_magnet_text": "Krótki przewodnik, jak ruszyć z treningiem 1:1 i utrzymać regularność.",
        "quickwin": "Uprościć ścieżkę kontaktu i dodać jedno główne CTA.",
    },
}

PROFILE_OVERRIDES = {
    "gdansk-agnieszka-trenerka": {
        "heroTitleTop": "TRENING DLA KOBIET",
        "heroTitleAccent": "Z PLANEM BEZ SPINY.",
        "heroText": "Spokojny, konkretny model współpracy dla kobiet, które chcą wrócić do regularności, poprawić sylwetkę i czuć się pewnie na treningu.",
        "aboutHeading": "Agnieszka Trenerka - trening personalny dla kobiet w Gdańsku.",
        "aboutText": "Strona powinna prowadzić od pierwszego kontaktu do prostego startu: konsultacja, plan i regularne wsparcie bez presji i bez chaosu. Priorytet na stronie: pokazać bezpieczny start i wyraźnie opisać, jak wygląda pierwszy miesiąc współpracy.",
        "nicheLabel": "trening personalny dla kobiet",
        "quickWin": "Pokazać ścieżkę startu dla kobiet wracających do regularności i dodać mocniejsze CTA do konsultacji.",
        "valueProps": [
            {"title": "Bezpieczny start", "desc": "Pierwsze tygodnie są ustawione pod wejście w regularność bez przeciążenia."},
            {"title": "Plan pod realny tydzień", "desc": "Treningi i zalecenia są dopasowane do rytmu dnia, nie pod idealny kalendarz."},
            {"title": "Jasna komunikacja", "desc": "Od razu wiadomo, jak wygląda start, kontakt i kolejne etapy współpracy."},
            {"title": "Wsparcie 1:1", "desc": "Stały kontakt i korekty pomagają utrzymać tempo bez zrywania planu."},
        ],
        "pricingPlans": [
            {"name": "Start Kobiecy", "subtitle": "Wejście w regularność i prosty plan działania.", "price": "299 zł", "period": "/ mies.", "features": ["Konsultacja startowa", "Plan treningowy pod poziom i cel", "Jedna korekta tygodniowo"], "ctaLabel": "Wybieram Start Kobiecy"},
            {"name": "Prowadzenie 1:1", "subtitle": "Najczęściej wybierana współpraca.", "price": "599 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Cotygodniowy check-in", "Wsparcie nawyków i regularności", "Bieżący kontakt"], "ctaLabel": "Wybieram Prowadzenie 1:1"},
            {"name": "Transformacja Premium", "subtitle": "Dla kobiet z konkretnym celem na 90 dni.", "price": "899 zł", "period": "/ mies.", "features": ["Priorytetowy kontakt", "Strategia 90 dni", "Pełne prowadzenie krok po kroku"], "ctaLabel": "Wybieram Transformację Premium"},
        ],
        "faqItems": [
            {"q": "Czy mogę zacząć, jeśli dawno nie trenowałam?", "a": "Tak. Plan zakłada spokojny start i budowanie regularności bez presji."},
            {"q": "Czy to współpraca tylko dla kobiet początkujących?", "a": "Nie. Model działa zarówno dla kobiet wracających do treningu, jak i dla tych, które chcą wejść poziom wyżej."},
            {"q": "Jak wygląda pierwszy miesiąc?", "a": "Najpierw konsultacja i plan startowy, potem cotygodniowe korekty oraz wsparcie w utrzymaniu regularności."},
            {"q": "Czy mogę połączyć trening z pracą i napiętym grafikiem?", "a": "Tak. Plan jest układany pod realny tydzień, nie pod idealne warunki."},
        ],
        "leadMagnetTitle": "Pobierz plan startu: 4 tygodnie spokojnego wejścia w trening.",
        "leadMagnetText": "Krótki materiał dla kobiet, które chcą wrócić do regularności i zacząć bez chaosu.",
    },
    "gdansk-trener-dargacz": {
        "heroTitleTop": "TRENING PERSONALNY",
        "heroTitleAccent": "NA KONKRETNY EFEKT.",
        "heroText": "Prosty, bezpośredni model współpracy dla osób, które chcą szybko wejść w plan, trenować regularnie i widzieć jasny progres tydzień po tygodniu.",
        "aboutHeading": "Trener Dargacz - konkretny trening personalny w Gdańsku.",
        "aboutText": "Komunikacja powinna być krótka, bez nadmiaru obietnic i skupiona na procesie: konsultacja, plan, korekta, progres. Priorytet na stronie: pokazać szybki start i wyraźnie zaznaczyć, dla kogo jest ta współpraca.",
        "quickWin": "Skrócić drogę do kontaktu i mocniej podkreślić prosty, konkretny proces współpracy.",
        "valueProps": [
            {"title": "Prosty model startu", "desc": "Krótka konsultacja, plan i wejście w trening bez przeciągania decyzji."},
            {"title": "Regularny progres", "desc": "Każdy tydzień ma jasny cel i punkt kontrolny."},
            {"title": "Bez lania wody", "desc": "Komunikacja i oferta są ustawione pod szybkie zrozumienie współpracy."},
            {"title": "Kontakt roboczy", "desc": "Bieżące korekty pomagają utrzymać tempo i technikę."},
        ],
        "faqItems": [
            {"q": "Czy współpraca jest dla osób początkujących?", "a": "Tak. Start jest ustawiany pod aktualny poziom i realne możliwości."},
            {"q": "Jak szybko mogę zacząć?", "a": "Zwykle pierwszy krok da się ustalić od razu po kontakcie."},
            {"q": "Na czym polega prowadzenie?", "a": "To plan treningowy, regularne korekty i szybki kontakt, gdy trzeba doprecyzować działanie."},
            {"q": "Czy trzeba trenować codziennie?", "a": "Nie. Plan jest ustawiany pod realny tydzień i sensowną częstotliwość."},
        ],
    },
    "gdansk-trener-grosz": {
        "heroTitleTop": "TRENING 1:1",
        "heroTitleAccent": "Z NASTAWIENIEM NA PROGRES.",
        "heroText": "Współpraca dla osób, które chcą trenować mądrze, poprawić sylwetkę i siłę oraz wiedzieć dokładnie, co robić na każdym etapie planu.",
        "aboutHeading": "Trener Grosz - trening personalny i progres siłowy w Gdańsku.",
        "aboutText": "Strona powinna czytelnie łączyć trening personalny z budowaniem formy i lepszą strukturą pracy na sali. Priorytet na stronie: mocniej pokazać progres, technikę i prowadzenie krok po kroku.",
        "quickWin": "Dodać więcej komunikatów o progresie siłowym i wyraźnie odróżnić start od pełnego prowadzenia.",
        "valueProps": [
            {"title": "Plan pod progres", "desc": "Każdy etap pracy ma własny cel i logikę obciążenia."},
            {"title": "Technika pod kontrolą", "desc": "Korekta ruchu jest częścią procesu, nie dodatkiem."},
            {"title": "Budowa siły i sylwetki", "desc": "Program łączy efekt wizualny z realną poprawą sprawności."},
            {"title": "Stałe prowadzenie", "desc": "Regularny kontakt i korekty utrzymują progres bez zgadywania."},
        ],
        "pricingPlans": [
            {"name": "Start Progres", "subtitle": "Plan wejścia i ustawienie techniki.", "price": "299 zł", "period": "/ mies.", "features": ["Plan treningowy pod cel", "Korekta techniki", "Jedna aktualizacja tygodniowo"], "ctaLabel": "Wybieram Start Progres"},
            {"name": "Prowadzenie Siła + Sylwetka", "subtitle": "Najmocniejszy wariant na regularny progres.", "price": "599 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Cotygodniowe korekty", "Monitoring progresu", "Stały kontakt"], "ctaLabel": "Wybieram Prowadzenie Siła + Sylwetka"},
            {"name": "Progres Premium", "subtitle": "Dla osób z ambitnym celem i większym tempem.", "price": "949 zł", "period": "/ mies.", "features": ["Priorytetowy kontakt", "Plan 90 dni", "Pełna personalizacja procesu"], "ctaLabel": "Wybieram Progres Premium"},
        ],
    },
    "gdansk-trener-premium": {
        "heroTitleTop": "TRENING PREMIUM",
        "heroTitleAccent": "Z OPIEKĄ 1:1.",
        "heroText": "Prowadzenie dla osób, które chcą mieć pełny plan, szybką komunikację i jasno rozpisany proces dochodzenia do efektu bez improwizacji.",
        "aboutHeading": "Trener Premium - prowadzenie treningowe premium w Gdańsku.",
        "aboutText": "Marka powinna brzmieć jak usługa premium: szybki kontakt, uporządkowany proces i wysoka responsywność, a nie ogólny landing o treningu. Priorytet na stronie: pokazać, co realnie oznacza premium w tej współpracy.",
        "nicheLabel": "prowadzenie premium 1:1",
        "quickWin": "Wyjaśnić różnicę między standardowym prowadzeniem a wersją premium i podbić wartość priorytetowego wsparcia.",
        "valueProps": [
            {"title": "Priorytetowy kontakt", "desc": "Klient szybko dostaje odpowiedź i kolejne kroki bez czekania."},
            {"title": "Plan szyty pod tryb życia", "desc": "Cały proces jest dopasowany do celu, kalendarza i poziomu wejścia."},
            {"title": "Prowadzenie bez chaosu", "desc": "Jedna ścieżka współpracy, jasne etapy i konkretne decyzje."},
            {"title": "Premium w praktyce", "desc": "Więcej uwagi, częstsze korekty i szybsza reakcja na zmiany."},
        ],
        "pricingPlans": [
            {"name": "Start Premium", "subtitle": "Wejście w plan i pierwsze ustawienie procesu.", "price": "399 zł", "period": "/ mies.", "features": ["Konsultacja premium", "Plan dopasowany do celu", "Jedna korekta tygodniowo"], "ctaLabel": "Wybieram Start Premium"},
            {"name": "Prowadzenie Premium", "subtitle": "Najczęściej wybierany wariant opieki 1:1.", "price": "799 zł", "period": "/ mies.", "featured": True, "features": ["Cotygodniowy monitoring", "Bieżące korekty", "Wsparcie nawyków i treningu", "Szybki kontakt 1:1"], "ctaLabel": "Wybieram Prowadzenie Premium"},
            {"name": "VIP Performance", "subtitle": "Najwyższy poziom opieki i strategia 90 dni.", "price": "1199 zł", "period": "/ mies.", "features": ["Priorytet absolutny", "Strategia 90 dni", "Pełna personalizacja i szybkie decyzje"], "ctaLabel": "Wybieram VIP Performance"},
        ],
        "faqItems": [
            {"q": "Co realnie oznacza premium w tej współpracy?", "a": "Szybszy kontakt, częstsze korekty i bardziej indywidualne prowadzenie na każdym etapie."},
            {"q": "Czy premium jest tylko dla zaawansowanych?", "a": "Nie. To model dla osób, które chcą po prostu większej opieki i lepszej responsywności."},
            {"q": "Jak wygląda start?", "a": "Od konsultacji, ustawienia celu i wdrożenia planu, który od początku ma jasne priorytety."},
            {"q": "Czy da się połączyć to z pracą i napiętym grafikiem?", "a": "Tak. Właśnie dlatego proces premium jest dopasowywany do realnego tygodnia."},
        ],
    },
    "gdansk-fit-point-ems": {
        "heroTitleTop": "EMS + TRENING",
        "heroTitleAccent": "W KRÓTSZYM CZASIE.",
        "heroText": "Model dla osób, które chcą trenować skutecznie przy ograniczonym czasie i szukają połączenia EMS z regularnym prowadzeniem pod konkretny efekt.",
        "aboutHeading": "Fit Point EMS - EMS i trening personalny w Gdańsku.",
        "aboutText": "Strona powinna wyraźnie tłumaczyć, dla kogo jest EMS, jak wygląda połączenie z treningiem personalnym i kiedy taki model ma sens. Priorytet na stronie: zbudować zaufanie do procesu EMS i skrócić drogę do konsultacji.",
        "nicheLabel": "EMS + trening personalny",
        "quickWin": "Wyjaśnić, kiedy warto wybrać EMS, a kiedy klasyczne prowadzenie, i podpiąć to pod osobne CTA.",
        "valueProps": [
            {"title": "Krótka, intensywna sesja", "desc": "Model pod osoby, które mają mało czasu, ale chcą utrzymać regularność."},
            {"title": "Połączenie EMS i planu", "desc": "Nie tylko pojedyncza sesja, ale cały proces ustawiony pod cel."},
            {"title": "Start od kwalifikacji", "desc": "Najpierw sprawdzamy, czy ten model naprawdę pasuje do Twojej sytuacji."},
            {"title": "Jasne kolejne kroki", "desc": "Po konsultacji wiesz, czy iść w EMS, trening klasyczny czy model mieszany."},
        ],
        "faqItems": [
            {"q": "Czy EMS jest dla każdego?", "a": "Nie zawsze. Najpierw warto sprawdzić cel, stan zdrowia i oczekiwany model pracy."},
            {"q": "Czy EMS zastępuje klasyczny trening?", "a": "Dla części osób może być świetnym uzupełnieniem, a dla części głównym modelem startu."},
            {"q": "Jak długo trwa pojedyncza sesja?", "a": "To zwykle krótsza forma pracy, ale nadal wymaga planu i systematyczności."},
            {"q": "Czy mogę połączyć EMS z redukcją lub poprawą sylwetki?", "a": "Tak, jeśli proces jest dobrze ustawiony i dopasowany do celu."},
        ],
        "leadMagnetTitle": "Pobierz przewodnik: kiedy EMS ma sens, a kiedy lepiej wybrać klasyczny trening.",
        "leadMagnetText": "Krótki materiał, który pomaga ocenić, czy model EMS będzie dobrym startem pod Twój cel.",
    },
    "gdansk-pw-studio-treningu-personalnego": {
        "heroTitleTop": "STUDIO 1:1",
        "heroTitleAccent": "BEZ CHAOSU NA SALI.",
        "heroText": "Kameralne studio treningu personalnego dla osób, które chcą trenować w spokojnym środowisku, z planem i jasnym prowadzeniem krok po kroku.",
        "aboutHeading": "PW Studio Treningu Personalnego - kameralne prowadzenie w Gdańsku.",
        "aboutText": "Tu najmocniejszy atut to nie tylko sam trening, ale warunki pracy: kameralność, skupienie i bezpośredni kontakt. Priorytet na stronie: lepiej sprzedać atmosferę studia oraz prosty proces wejścia do współpracy.",
        "nicheLabel": "kameralne studio treningu personalnego",
        "quickWin": "Mocniej wyeksponować kameralne studio i opisać, dla kogo taki model jest lepszy niż duża siłownia.",
        "valueProps": [
            {"title": "Kameralne warunki", "desc": "Pracujesz w spokojnym miejscu, bez tłoku i bez rozproszeń."},
            {"title": "Prowadzenie 1:1", "desc": "Cała uwaga jest ustawiona pod Twoją technikę, cel i tempo pracy."},
            {"title": "Czytelny start", "desc": "Od pierwszego kontaktu wiadomo, jak wejść we współpracę i czego się spodziewać."},
            {"title": "Kontakt poza sesją", "desc": "Między treningami można doprecyzować plan i utrzymać regularność."},
        ],
        "pricingPlans": [
            {"name": "Start w Studio", "subtitle": "Pierwszy miesiąc i ustawienie procesu.", "price": "349 zł", "period": "/ mies.", "features": ["Konsultacja startowa", "Plan treningowy", "Jedna korekta tygodniowo"], "ctaLabel": "Wybieram Start w Studio"},
            {"name": "Prowadzenie w Studio", "subtitle": "Najmocniejszy wariant regularnej pracy 1:1.", "price": "649 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Cotygodniowe korekty", "Stały kontakt", "Praca w kameralnym studio"], "ctaLabel": "Wybieram Prowadzenie w Studio"},
            {"name": "Studio Premium", "subtitle": "Dla osób, które chcą mocniejszej opieki i szybszych korekt.", "price": "949 zł", "period": "/ mies.", "features": ["Priorytetowy kontakt", "Plan 90 dni", "Pełne prowadzenie w modelu premium"], "ctaLabel": "Wybieram Studio Premium"},
        ],
    },
    "gdansk-renato-gym": {
        "heroTitleTop": "TRENING ONLINE + 1:1",
        "heroTitleAccent": "Z PROSTYM STARTEM.",
        "heroText": "Model dla osób, które chcą szybko wejść we współpracę, mieć jasny plan i korzystać z prostego kontaktu bez rozbudowanej otoczki.",
        "aboutHeading": "Renato Gym - prosty i konkretny trening personalny w Gdańsku.",
        "aboutText": "Ta strona powinna działać jak bezpośredni landing: jasno powiedzieć, co dostajesz, jak wygląda start i dlaczego warto odezwać się od razu. Priorytet na stronie: skrócić dystans i pokazać prosty model kontaktu.",
        "quickWin": "Podkręcić bezpośredni styl komunikacji i mocniej wyeksponować szybki start współpracy.",
        "valueProps": [
            {"title": "Szybki kontakt", "desc": "Krótka ścieżka od wejścia na stronę do pierwszej rozmowy."},
            {"title": "Plan bez komplikacji", "desc": "Jasne kroki działania zamiast rozbudowanego procesu sprzedażowego."},
            {"title": "Model elastyczny", "desc": "Współpraca może wejść zarówno jako klasyczne 1:1, jak i bardziej zdalne prowadzenie."},
            {"title": "Konkretny cel", "desc": "Od początku wiadomo, po co trenujesz i jak mierzymy progres."},
        ],
        "faqItems": [
            {"q": "Czy da się zacząć szybko?", "a": "Tak. Priorytetem jest krótka ścieżka startu i szybkie ustawienie pierwszych kroków."},
            {"q": "Czy to model tylko stacjonarny?", "a": "Nie. Strona jest ustawiona pod prosty kontakt i elastyczny model dalszej współpracy."},
            {"q": "Co dostaję na początku?", "a": "Najpierw ustalamy cel, potem wchodzi prosty plan i pierwszy etap działania."},
            {"q": "Czy ta współpraca jest dla początkujących?", "a": "Tak. Start można dopasować do zera, jak i do osób już aktywnych."},
        ],
    },
    "gdansk-strong-by-okta": {
        "heroTitleTop": "TRENING KOBIECY",
        "heroTitleAccent": "MOC, FORMA, PEWNOŚĆ.",
        "heroText": "Prowadzenie dla kobiet, które chcą czuć się silniej, trenować pewniej i budować formę w estetycznym, uporządkowanym procesie 1:1.",
        "aboutHeading": "Strong by Okta - trening kobiecy 1:1 w Gdańsku.",
        "aboutText": "Marka ma wyraźny potencjał lifestyle'owy i kobiecy, więc strona powinna bardziej grać energią, siłą i pewnością siebie niż generycznym językiem o treningu. Priorytet na stronie: podkreślić kobiecy charakter marki i mocniej wyjaśnić, dla kogo jest ta współpraca.",
        "nicheLabel": "trening kobiecy 1:1",
        "quickWin": "Zbudować mocniejszą komunikację pod kobiecą siłę, sylwetkę i pewność siebie oraz domknąć ją konsultacją Booksy.",
        "valueProps": [
            {"title": "Kobiecy model współpracy", "desc": "Proces jest ustawiony pod potrzeby kobiet, które chcą formy i większej pewności na treningu."},
            {"title": "Siła bez chaosu", "desc": "Plan prowadzi krok po kroku od startu do realnego progresu."},
            {"title": "Estetyka i energia marki", "desc": "Komunikacja buduje klimat premium, ale nadal zostaje konkretna."},
            {"title": "Szybki booking", "desc": "Konsultacja może być umówiona od razu przez prosty flow Booksy."},
        ],
        "pricingPlans": [
            {"name": "Start Strong", "subtitle": "Wejście w trening i plan pierwszych tygodni.", "price": "329 zł", "period": "/ mies.", "features": ["Konsultacja startowa", "Plan pod cel i poziom", "Jedna korekta tygodniowo"], "ctaLabel": "Wybieram Start Strong"},
            {"name": "Strong 1:1", "subtitle": "Najczęściej wybierany wariant prowadzenia.", "price": "629 zł", "period": "/ mies.", "featured": True, "features": ["Wszystko z pakietu Start", "Cotygodniowy monitoring", "Bieżący kontakt", "Prowadzenie pod siłę i sylwetkę"], "ctaLabel": "Wybieram Strong 1:1"},
            {"name": "Strong Premium", "subtitle": "Dla kobiet z mocnym celem i większą dynamiką pracy.", "price": "949 zł", "period": "/ mies.", "features": ["Priorytetowy kontakt", "Strategia 90 dni", "Pełna personalizacja procesu"], "ctaLabel": "Wybieram Strong Premium"},
        ],
        "faqItems": [
            {"q": "Czy to współpraca tylko dla kobiet zaawansowanych?", "a": "Nie. Model jest dobry także dla kobiet, które chcą dopiero wejść w trening z większą pewnością."},
            {"q": "Czy skupiamy się bardziej na sylwetce czy na sile?", "a": "Proces może łączyć oba cele, ale zawsze startuje od tego, co dla Ciebie najważniejsze."},
            {"q": "Jak wygląda start?", "a": "Od konsultacji, ustalenia celu i prostego planu pierwszych tygodni współpracy."},
            {"q": "Czy mogę umówić się szybko?", "a": "Tak. Flow strony i Booksy są ustawione pod szybkie domknięcie konsultacji."},
        ],
        "leadMagnetTitle": "Pobierz plan startu: jak wejść w trening kobiecy z większą pewnością.",
        "leadMagnetText": "Krótki materiał dla kobiet, które chcą połączyć formę, siłę i regularność bez chaosu.",
    },
}


def repair_text(value: str) -> str:
    text = value or ""
    if not text:
        return ""

    for codec in ("latin1", "cp1252"):
        try:
            repaired = text.encode(codec).decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            continue
        if repaired.count("�") <= text.count("�") and sum(ch in repaired for ch in "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ") >= sum(ch in text for ch in "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ"):
            text = repaired
            break

    return text


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", repair_text((value or "").replace("\xa0", " "))).strip()


def normalize_key(value: str) -> str:
    value = normalize(value).translate(PL_TRANSLIT)
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str) -> str:
    value = normalize(value).translate(PL_TRANSLIT)
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def to_url(value: str) -> str:
    value = normalize(value)
    if not value:
        return ""
    value = normalize(value.split(";", 1)[0])
    if re.match(r"^https?://", value, flags=re.I):
        try:
            parsed = urlparse(value)
        except ValueError:
            return value
        if parsed.netloc.lower().endswith("google.com") and parsed.path == "/url":
            target = parse_qs(parsed.query).get("q", [""])[0]
            return unquote(target) or value
        filtered_query = [
            (key, item)
            for key, item in parse_qsl(parsed.query, keep_blank_values=True)
            if not (
                key.lower().startswith("utm_")
                or key.lower() in {"fbclid", "igshid", "igsh", "si", "sntz", "usg", "sa", "authuser", "hl", "rclk"}
            )
        ]
        return urlunparse(parsed._replace(query=urlencode(filtered_query, doseq=True)))
    return f"https://{value}"


def extract_links(row: dict) -> tuple[str, str, str]:
    website = to_url(row.get("website", ""))
    facebook = to_url(row.get("facebook", ""))
    instagram = to_url(row.get("instagram", ""))

    def host(url: str) -> str:
        if not url:
            return ""
        try:
            return urlparse(url).netloc.lower().replace("www.", "")
        except ValueError:
            return ""

    website_host = host(website)
    if website_host.endswith("instagram.com"):
        instagram = instagram or website
        website = ""
    elif website_host.endswith("facebook.com"):
        facebook = facebook or website
        website = ""

    if instagram:
        try:
            parts = [part for part in urlparse(instagram).path.split("/") if part]
        except ValueError:
            parts = []
        handle = parts[0] if parts else ""
        if handle.isdigit():
            instagram = ""

    return website, facebook, instagram


def first_email(value: str) -> str:
    value = normalize(value)
    if not value:
        return ""
    return normalize(value.split(";", 1)[0]).lower()


def prettify_handle(value: str) -> str:
    value = unquote(normalize(value))
    value = re.sub(r"^@", "", value)
    value = re.sub(r"[-_.]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    if not value:
        return ""
    return " ".join(part.capitalize() for part in value.split())


def social_handle_from_url(value: str) -> str:
    if not value:
        return ""
    try:
        parsed = urlparse(to_url(value))
    except ValueError:
        return ""

    parts = [part for part in parsed.path.split("/") if part]
    if not parts:
        return ""

    host = parsed.netloc.lower()
    if host.endswith("instagram.com"):
        if len(parts) >= 2 and parts[-1].lower() in {"channel", "reel", "p"}:
            return prettify_handle(parts[-2])
        return prettify_handle(parts[0])
    if host.endswith("facebook.com"):
        if parts[0].lower() == "profile.php":
            return ""
        return prettify_handle(parts[0])
    return ""


def domain_stem_name(value: str) -> str:
    if not value:
        return ""
    try:
        parsed = urlparse(to_url(value))
    except ValueError:
        return ""
    host = parsed.netloc.lower().replace("www.", "")
    if host.endswith("sites.google.com"):
        return ""
    stem = host.split(".", 1)[0]
    if stem in {"instagram", "facebook", "aleo"}:
        return ""
    return prettify_handle(stem)


def email_local_name(value: str) -> str:
    return prettify_handle(first_email(value).split("@", 1)[0])


def looks_like_person(name: str) -> bool:
    key = normalize_key(name)
    tokens = key.split()
    if not tokens:
        return False
    if any(token in PERSONAL_NAME_HINTS for token in tokens[:2]):
        return True
    lowered = key.lower()
    return not any(token in lowered for token in ["studio", "team", "fit", "gym", "move", "club", "ems", "life", "body"])


def resolve_slug_source(title: str, website: str, email: str) -> str:
    clean_title = normalize(title)
    title_key = normalize_key(clean_title)
    if title_key and title_key not in GENERIC_TITLE_KEYS:
        return clean_title

    social_candidate = social_handle_from_url(website)
    domain_candidate = domain_stem_name(website)
    email_candidate = EMAIL_NAME_OVERRIDES.get(first_email(email), "") or email_local_name(email)

    if title_key == "instagram":
        return social_candidate or email_candidate or clean_title or "Profil Instagram"
    if title_key in {"facebook", "sites google", "aleo"}:
        return email_candidate or social_candidate or domain_candidate or clean_title or "Profil trenera"
    return social_candidate or domain_candidate or email_candidate or clean_title or "Profil trenera"


def prettify_display_name(raw_name: str, email: str) -> str:
    raw_name = normalize(raw_name)
    if not raw_name:
        return ""
    override = DISPLAY_NAME_OVERRIDES.get(normalize_key(raw_name))
    if override:
        return override
    email_override = EMAIL_NAME_OVERRIDES.get(first_email(email))
    if email_override:
        return email_override
    return raw_name


def nav_name(value: str) -> str:
    short = re.split(r"\s+\|\s+|\s+-\s+", value)[0].strip()
    return short if len(short) >= 4 else value


def pick_palette(slug: str) -> dict:
    idx = int(hashlib.md5(slug.encode("utf-8")).hexdigest(), 16) % len(PALETTES)
    return PALETTES[idx]


def seeded_pick(slug: str, key: str, options: list[str]) -> str:
    idx = int(hashlib.md5(f"{slug}:{key}".encode("utf-8")).hexdigest(), 16) % len(options)
    return options[idx]


def seeded_number(slug: str, key: str, start: int, step: int, count: int) -> int:
    idx = int(hashlib.md5(f"{slug}:{key}".encode("utf-8")).hexdigest(), 16) % count
    return start + idx * step


def is_feminine_person(display_name: str) -> bool:
    tokens = normalize_key(display_name).split()
    if not tokens:
        return False
    if tokens[0] in FEMALE_NAME_HINTS:
        return True
    return any(token in {"trenerka", "kobiet"} for token in tokens)


def should_use_women_positioning(display_name: str, haystack: str) -> bool:
    return any(token in haystack for token in ["kobiet", "kobieta", "women", "girl", "trenerka", "balans"]) or is_feminine_person(display_name)


def derive_signals(display_name: str, website: str, instagram: str, facebook: str, niche: str, category: str) -> dict[str, object]:
    haystack = " ".join(
        filter(
            None,
            [
                normalize_key(display_name),
                normalize_key(website),
                normalize_key(instagram),
                normalize_key(facebook),
                normalize_key(category),
                normalize_key(niche),
            ],
        )
    )
    feminine_person = is_feminine_person(display_name)
    return {
        "is_person": looks_like_person(display_name),
        "is_feminine_person": feminine_person,
        "is_women": should_use_women_positioning(display_name, haystack),
        "is_ems": any(token in haystack for token in ["ems"]),
        "is_medical": niche == "trening medyczny / fizjo",
        "is_nutrition": niche == "trening + odzywianie",
        "is_metamorphosis": niche == "metamorfoza sylwetki",
        "is_studio": any(token in haystack for token in ["studio", "club", "team"]),
        "is_sport": any(token in haystack for token in ["motorycz", "olimp", "sport", "athlet", "kickboxing"]),
        "is_premium": any(token in haystack for token in ["premium", "elite", "vip"]),
        "is_online": any(token in haystack for token in ["online"]),
        "is_social_only": not website and bool(instagram or facebook),
        "is_booksy": "booksy.com" in website,
        "has_website": bool(website),
        "has_instagram": bool(instagram),
        "has_facebook": bool(facebook),
    }


def person_modal(display_name: str, signals: dict[str, object]) -> str:
    if not signals["is_person"]:
        return "powinno"
    return "powinna" if signals["is_feminine_person"] else "powinien"


def build_brand_tagline(display_name: str, niche: str, signals: dict[str, object]) -> str:
    if signals["is_medical"]:
        return "Trening medyczny i powrót do sprawności"
    if signals["is_ems"]:
        return "EMS i trening personalny 1:1"
    if signals["is_nutrition"]:
        return "Trening personalny i wsparcie żywieniowe"
    if signals["is_women"]:
        return "Trening personalny dla kobiet"
    if signals["is_sport"]:
        return "Przygotowanie motoryczne i trening 1:1"
    if signals["is_studio"] and not signals["is_person"]:
        return "Kameralne studio treningu personalnego"
    if signals["is_premium"]:
        return "Prowadzenie premium 1:1"
    return "Trening personalny 1:1 w Gdańsku"


def build_hero(display_name: str, slug: str, niche: str, signals: dict[str, object]) -> tuple[str, str, str]:
    modal = person_modal(display_name, signals)
    if signals["is_medical"]:
        top = seeded_pick(slug, "hero-top", ["TRENING MEDYCZNY", "RUCH BEZ BÓLU", "POWRÓT DO SPRAWNOŚCI"])
        accent = seeded_pick(slug, "hero-accent", ["Z PLANEM I SPOKOJEM.", "BEZ CHAOSU W CIELE.", "OD ANALIZY DO PROGRESU."])
        text = seeded_pick(
            slug,
            "hero-text",
            [
                f"{display_name} prowadzi współpracę dla osób, które chcą wrócić do regularnego ruchu bez zgadywania i bez dokładania sobie przeciążeń.",
                f"To model pracy dla osób po przerwie, przeciążeniu albo z celem odzyskania sprawności krok po kroku, a nie na siłę.",
                f"Proces startuje od konsultacji i bezpiecznej progresji, żeby ruch znowu dawał kontrolę zamiast napięcia.",
            ],
        )
        return top, accent, text

    if signals["is_ems"]:
        top = seeded_pick(slug, "hero-top", ["EMS + TRENING", "KRÓTKI TRENING", "FORMA PRZY MAŁEJ ILOŚCI CZASU"])
        accent = seeded_pick(slug, "hero-accent", ["POD KONKRETNY EFEKT.", "BEZ PRZEGADANIA.", "W MODELU, KTÓRY DA SIĘ UTRZYMAĆ."])
        text = seeded_pick(
            slug,
            "hero-text",
            [
                f"{display_name} łączy krótszy model pracy z jasnym prowadzeniem, żeby trening mieścił się w tygodniu i nadal dawał realny progres.",
                f"To propozycja dla osób, które chcą wejść w regularność mimo napiętego grafiku i potrzebują prostego procesu startu.",
                f"Na stronie ma być od razu jasne, kiedy wybrać EMS, a kiedy lepiej wejść w klasyczne prowadzenie 1:1.",
            ],
        )
        return top, accent, text

    if signals["is_women"]:
        top = seeded_pick(slug, "hero-top", ["TRENING DLA KOBIET", "FORMA I PEWNOŚĆ", "KOBIECE 1:1"])
        accent = seeded_pick(slug, "hero-accent", ["BEZ SPINY I PRESJI.", "Z MOCĄ I SPOKOJEM.", "W RYTMIE TWOJEGO TYGODNIA."])
        text = seeded_pick(
            slug,
            "hero-text",
            [
                f"{display_name} {modal} komunikować współpracę dla kobiet, które chcą lepiej czuć się w ciele, wrócić do regularności i trenować bez presji.",
                "To landing dla kobiet, które chcą konkretu, dobrego prowadzenia i planu, który nie rozsypuje się po pierwszym trudniejszym tygodniu.",
                "Priorytetem jest tutaj poczucie bezpieczeństwa, prosty start i wyraźny kierunek: forma, siła i regularność.",
            ],
        )
        return top, accent, text

    if signals["is_sport"]:
        top = seeded_pick(slug, "hero-top", ["PRZYGOTOWANIE MOTORYCZNE", "SPORT + SIŁA", "TRENING POD WYNIK"])
        accent = seeded_pick(slug, "hero-accent", ["Z PLANEM, NIE Z PRZYPADKIEM.", "POD RUCH I PERFORMANCE.", "Z KONTROLĄ OBCIĄŻENIA."])
        text = seeded_pick(
            slug,
            "hero-text",
            [
                f"{display_name} {modal} komunikować współpracę dla osób, które chcą połączyć lepszy ruch, siłę i przygotowanie pod konkretny wysiłek.",
                "To model dla klientów, którzy chcą trenować bardziej sportowo, ale nadal w uporządkowanym i bezpiecznym procesie.",
                "Na stronie ma być jasne, że to nie jest przypadkowy plan z internetu, tylko praca pod wynik, sprawność i regularny progres.",
            ],
        )
        return top, accent, text

    if signals["is_nutrition"]:
        top = seeded_pick(slug, "hero-top", ["TRENING + ODŻYWIANIE", "PLAN NA FORMĘ", "FORMA Z DWÓCH STRON"])
        accent = seeded_pick(slug, "hero-accent", ["BEZ LOSOWYCH METOD.", "W JEDNYM SPÓJNYM PROCESIE.", "Z KONTROLĄ POSTĘPU."])
        text = seeded_pick(
            slug,
            "hero-text",
            [
                f"{display_name} {modal} brzmieć jak osoba lub marka, która porządkuje trening i jedzenie pod jeden cel, zamiast wrzucać klienta w dwa oddzielne światy.",
                "Tu wygrywa jasny system: ruch, żywienie, monitoring i korekty pod realny tydzień klienta.",
                "To propozycja dla osób, które chcą ogarnąć formę całościowo, ale bez skrajnej diety i bez skakania między metodami.",
            ],
        )
        return top, accent, text

    if signals["is_metamorphosis"]:
        top = seeded_pick(slug, "hero-top", ["METAMORFOZA", "FORMA KROK PO KROKU", "SYLWETKA Z PLANEM"])
        accent = seeded_pick(slug, "hero-accent", ["Z REGULARNOŚCIĄ, NIE ZRYWEM.", "BEZ CHAOSU I ZGADYWANIA.", "POD REALNY EFEKT."])
        text = seeded_pick(
            slug,
            "hero-text",
            [
                f"{display_name} ma komunikować konkretną drogę do poprawy sylwetki: jasny plan, monitoring i proces, który da się utrzymać dłużej niż dwa tygodnie.",
                "To landing pod osoby, które chcą schudnąć, poprawić wygląd sylwetki albo wrócić do formy bez odpalania kolejnej przypadkowej diety.",
                "Moc strony ma siedzieć w prostym starcie, mierzalnym progresie i normalnym języku zamiast wielkich obietnic.",
            ],
        )
        return top, accent, text

    top = seeded_pick(slug, "hero-top", ["TRENING 1:1", "TRENING PERSONALNY", "PROCES POD TWÓJ CEL"])
    accent = seeded_pick(slug, "hero-accent", ["BEZ ZBĘDNEGO SZUMU.", "Z PROGRESEM TYDZIEŃ PO TYGODNIU.", "W MODELU, KTÓRY DA SIĘ UTRZYMAĆ."])
    text = seeded_pick(
        slug,
        "hero-text",
        [
                f"{display_name} {modal} komunikować prosty, konkretny model współpracy: konsultacja, plan, wdrożenie i regularne korekty bez przeciągania decyzji.",
                "To oferta dla osób, które chcą trenować regularnie, mieć jasny kierunek i wiedzieć, co robić dalej zamiast improwizować.",
                "Najmocniejszy kierunek tej strony to skrócić drogę od wejścia do kontaktu i pokazać, że współpraca ma prostą, logiczną strukturę.",
            ],
    )
    return top, accent, text


def build_about_heading(display_name: str, signals: dict[str, object]) -> str:
    if signals["is_studio"] and not signals["is_person"]:
        return f"{display_name} - kameralna przestrzeń treningu personalnego w Gdańsku."
    if signals["is_medical"]:
        return f"{display_name} - trening medyczny i spokojny powrót do formy w Gdańsku."
    if signals["is_women"]:
        return f"{display_name} - trening personalny dla kobiet w Gdańsku."
    if signals["is_ems"]:
        return f"{display_name} - EMS i trening personalny w Gdańsku."
    return f"{display_name} - trening personalny w Gdańsku z jasnym planem startu."


def build_about_text(display_name: str, slug: str, niche: str, signals: dict[str, object]) -> str:
    openers = {
        "trening medyczny / fizjo": [
            "Tutaj kluczowe jest zaufanie do procesu: najpierw analiza, potem spokojne wdrożenie i dopiero dalej większa intensywność.",
            "Ta strona powinna od początku tłumaczyć, że celem nie jest przypadkowe trenowanie mimo bólu, tylko mądre odzyskanie sprawności.",
            "Największą wartością tej komunikacji jest spokój, konkret i pokazanie, że progres można budować bez przeciążania organizmu.",
        ],
        "metamorfoza sylwetki": [
            "Tu najmocniej działa prosty język efektu: mniej chaosu, więcej regularności i jasny plan pod poprawę sylwetki.",
            "Komunikacja powinna przekonać, że współpraca nie opiera się na motywacyjnych hasłach, tylko na procesie, który da się dowieźć.",
            "Priorytet tej strony to pokazać klientowi, że metamorfoza może być uporządkowana, spokojna i realna do utrzymania.",
        ],
        "trening + odzywianie": [
            "Największa przewaga tej strony to spięcie ruchu i odżywiania w jedną ścieżkę zamiast dwóch osobnych tematów.",
            "Komunikacja ma brzmieć jak dobrze poukładany system, nie jak kolejna dieta z doklejonym planem treningowym.",
            "Landing powinien pokazać, że efekt bierze się z prostego procesu i regularnych korekt, a nie z restrykcji i skrajności.",
        ],
        "trening personalny 1:1": [
            "Tu wygrywa prostota: klient ma szybko zrozumieć, jak wygląda start, co dostaje i po czym pozna, że idzie do przodu.",
            "Najmocniejszy kierunek tej strony to jasna struktura współpracy i wrażenie, że ktoś realnie prowadzi cały proces, a nie tylko sprzedaje trening.",
            "Komunikacja ma być konkretna, lokalna i bez przeintelektualizowania, bo największą przewagą jest klarowny model pracy 1:1.",
        ],
    }
    closers = [
        seeded_pick(slug, "about-close", [
            "Priorytet na stronie: skrócić drogę do kontaktu i lepiej nazwać pierwszy krok współpracy.",
            "Priorytet na stronie: pokazać, dla kogo ten model działa najlepiej i co dzieje się w pierwszych tygodniach.",
            "Priorytet na stronie: dać klientowi poczucie, że od pierwszego kliknięcia trafia w dobrze poukładany proces.",
        ]),
        seeded_pick(slug, "about-close-2", [
            "Priorytet na stronie: mocniej podbić korzyść z regularnego prowadzenia zamiast opisywać sam trening w oderwaniu od efektu.",
            "Priorytet na stronie: czytelnie odróżnić szybki start od pełnego prowadzenia i domknąć to jednym mocnym CTA.",
            "Priorytet na stronie: zbudować większe zaufanie do procesu i usunąć generyczny ton komunikacji.",
        ]),
    ]
    opener = seeded_pick(slug, "about-open", openers[niche])
    closer = seeded_pick(slug, "about-closer", closers)
    person_line = (
        f"{display_name} ma brzmiec jak trener lub marka, ktora wie, jak przeprowadzic klienta od startu do regularnego dzialania."
        if signals["is_person"]
        else f"{display_name} powinno być komunikowane jak miejsce lub marka, która porządkuje współpracę i daje klientowi jasny pierwszy krok."
    )
    return f"{opener} {person_line} {closer}"


def build_quick_win(slug: str, niche: str, signals: dict[str, object]) -> str:
    options = {
        "trening medyczny / fizjo": [
            "Rozdzielić komunikację na ból, przeciążenie i powrót do formy z prostym CTA do konsultacji.",
            "Mocniej sprzedać pierwszy etap współpracy: analizę ruchu, spokojny start i tygodniowe korekty.",
            "Podkreślić bezpieczeństwo procesu zamiast ogólnego hasła o treningu personalnym.",
        ],
        "metamorfoza sylwetki": [
            "Pokazać prostą drogę od celu sylwetkowego do pierwszej konsultacji bez przeładowania treści.",
            "Mocniej wyeksponować regularność, monitoring i pierwszy miesiąc współpracy.",
            "Skrócić drogę do kontaktu i lepiej opisać, co realnie dostaje klient w pierwszych tygodniach.",
        ],
        "trening + odzywianie": [
            "Wyraźnie spiąć trening i jedzenie w jeden proces, zamiast komunikować je jako dwa oddzielne tematy.",
            "Mocniej opisać pierwszy miesiąc współpracy i sposób monitorowania efektów.",
            "Zamienić ogólną obietnicę na konkretny system: plan, check-in, korekta, efekt.",
        ],
        "trening personalny 1:1": [
            "Uprościć ścieżkę kontaktu i wyraźniej nazwać, jak wygląda pierwszy krok współpracy.",
            "Mocniej pokazać różnicę między szybkim startem a pełnym prowadzeniem 1:1.",
            "Dodać więcej konkretu o procesie zamiast zostawiać komunikację na poziomie ogólnych obietnic.",
        ],
    }
    base = seeded_pick(slug, "quickwin", options[niche])
    if signals["is_booksy"]:
        return f"{base} Domknąć to konsultacją z szybką rezerwacją przez Booksy."
    if signals["is_social_only"]:
        return f"{base} Oprzeć wiarygodność na prostym flow kontaktu i konkretnej obietnicy startu."
    return base


def build_value_props(slug: str, niche: str, signals: dict[str, object]) -> list[dict[str, str]]:
    banks = {
        "trening medyczny / fizjo": [
            ("Start od diagnozy", "Najpierw sprawdzamy ograniczenia i dopiero potem ustawiamy progresję."),
            ("Plan pod codzienne życie", "Proces uwzględnia pracę, regenerację i realny poziom obciążenia."),
            ("Spokojny powrót do ruchu", "Najpierw bezpieczeństwo i kontrola, potem większa dynamika pracy."),
            ("Stałe korekty", "Reagujemy na to, jak ciało odpowiada między sesjami, a nie tylko na papierze."),
            ("Progres bez szarpania", "Cel to odzyskać sprawność i zbudować stabilność, nie gonić wynik za wszelką cenę."),
        ],
        "metamorfoza sylwetki": [
            ("Pierwsze 30 dni z planem", "Klient od początku wie, jak wygląda start i czego oczekiwać tydzień po tygodniu."),
            ("Monitoring bez chaosu", "Postęp jest regularnie sprawdzany i tłumaczony prostym językiem."),
            ("Efekt do utrzymania", "Cały proces jest ustawiony pod regularność, nie pod krótkie zrywy."),
            ("Jedno mocne CTA", "Strona prowadzi klienta do konsultacji bez nadmiaru alternatyw i rozpraszaczy."),
            ("Forma i nawyki", "Poprawa sylwetki jest spięta z codziennym rytmem, a nie z idealnym planem na papierze."),
        ],
        "trening + odzywianie": [
            ("Jedna ścieżka działania", "Trening i odżywianie pracują na ten sam cel, w tym samym rytmie kontroli."),
            ("Prosty monitoring", "Regularne check-iny i korekty pomagają utrzymać wynik bez skrajnych metod."),
            ("Nawyki zamiast restrykcji", "Plan da się wdrożyć w normalnym tygodniu, a nie tylko w idealnych warunkach."),
            ("Współpraca 2w1", "Klient nie musi składać planu z kilku źródeł, bo wszystko jest ustawione w jednym procesie."),
            ("Czytelny start", "Na wejściu wiadomo, jak wygląda konsultacja, plan i pierwsze korekty."),
        ],
        "trening personalny 1:1": [
            ("Jasny pierwszy krok", "Od razu wiadomo, co dzieje się po kontakcie i jak rusza współpraca."),
            ("Prowadzenie zamiast improwizacji", "Plan, korekty i kontakt są częścią jednego procesu, nie dodatkiem."),
            ("Model pod realny tydzień", "Współpraca jest dopasowana do życia klienta, a nie do idealnego kalendarza."),
            ("Regularny feedback", "Klient wie, co poprawić, co utrzymać i jak mierzyć progres."),
            ("Oferta bez chaosu", "Pakiety są opisane prosto i prowadzą do jednej sensownej decyzji."),
        ],
    }
    chosen = []
    pool = banks[niche]
    start = int(hashlib.md5(f"{slug}:value-props".encode("utf-8")).hexdigest(), 16) % len(pool)
    for idx in range(4):
        title, desc = pool[(start + idx) % len(pool)]
        if signals["is_booksy"] and idx == 3:
            title, desc = ("Szybka rezerwacja", "Booksy lub prosty formularz domykają kontakt bez dodatkowego tarcia.")
        elif signals["is_social_only"] and idx == 3:
            title, desc = ("Prosty kontakt", "Strona ma szybko wyjaśnić proces i skierować do jednego, konkretnego działania.")
        chosen.append({"title": title, "desc": desc})
    return chosen


def build_pricing_plans(slug: str, niche: str, signals: dict[str, object]) -> list[dict[str, object]]:
    if niche == "trening medyczny / fizjo":
        names = ["Start Bez Bólu", "Powrót do Sprawności", "Opieka Premium"]
        subtitles = [
            "Konsultacja, plan i spokojne wejście w ruch.",
            "Najczęściej wybierany model pracy 1:1.",
            "Więcej kontaktu i szybsze korekty dla wymagających przypadków.",
        ]
    elif niche == "metamorfoza sylwetki":
        names = ["Start Sylwetka", "Transformacja 1:1", "Plan Premium"]
        subtitles = [
            "Pierwszy miesiąc pod regularność i prosty efekt.",
            "Najczęściej wybierany pakiet pod zmianę sylwetki.",
            "Większa dynamika pracy i strategia na 90 dni.",
        ]
    elif niche == "trening + odzywianie":
        names = ["Start Forma", "Prowadzenie Kompleksowe", "VIP 2w1"]
        subtitles = [
            "Trening i żywienie ustawione na pierwsze 4 tygodnie.",
            "Najpełniejszy model regularnego prowadzenia.",
            "Dla osób, które chcą więcej kontaktu i szerszego monitoringu.",
        ]
    else:
        names = ["Start 1:1", "Prowadzenie 1:1", "Premium 1:1"]
        subtitles = [
            "Wejście w proces i ustawienie pierwszych kroków.",
            "Najmocniejszy wariant regularnej współpracy.",
            "Więcej opieki, szybszy kontakt i plan na dłuższy horyzont.",
        ]

    start_price = seeded_number(slug, "price-start", 279, 20, 4)
    mid_price = start_price + seeded_number(slug, "price-mid", 260, 20, 4)
    premium_price = mid_price + seeded_number(slug, "price-premium", 260, 50, 4)

    if signals["is_premium"] or signals["is_booksy"]:
        mid_price += 40
        premium_price += 80
    if signals["is_ems"]:
        start_price += 20
        mid_price += 40
        premium_price += 60

    feature_bank = {
        "trening medyczny / fizjo": [
            ["Konsultacja i analiza ruchu", "Plan pierwszych tygodni", "Jedna korekta tygodniowo"],
            ["Wszystko z pakietu Start", "Regularne korekty obciążenia", "Wsparcie między sesjami", "Monitoring postępu"],
            ["Priorytetowy kontakt", "Plan 90 dni", "Szybsze korekty i większa responsywność"],
        ],
        "metamorfoza sylwetki": [
            ["Plan treningowy pod cel", "Wdrożenie nawyków", "Kontrola postępu raz w tygodniu"],
            ["Wszystko z pakietu Start", "Cotygodniowy check-in", "Korekta planu i tempa", "Stały kontakt"],
            ["Priorytetowy kontakt", "Strategia 90 dni", "Pełna personalizacja procesu"],
        ],
        "trening + odzywianie": [
            ["Plan treningowy", "Zalecenia żywieniowe", "Jedna korekta tygodniowo"],
            ["Wszystko z pakietu Start", "Monitoring żywienia i treningu", "Cotygodniowy raport", "Stały kontakt"],
            ["Priorytetowy kontakt", "Strategia 90 dni", "Plan utrzymania efektu"],
        ],
        "trening personalny 1:1": [
            ["Plan dopasowany do celu", "Ustawienie techniki", "Jedna korekta tygodniowo"],
            ["Wszystko z pakietu Start", "Cotygodniowy monitoring", "Bieżące korekty", "Stały kontakt"],
            ["Priorytetowy kontakt", "Strategia 90 dni", "Pełne prowadzenie premium"],
        ],
    }
    ctas = {
        0: seeded_pick(slug, "cta-0", [f"Wybieram {names[0]}", "Chcę zacząć od tego pakietu", "To dobry start dla mnie"]),
        1: seeded_pick(slug, "cta-1", [f"Wybieram {names[1]}", "Chcę pełnego prowadzenia", "To mój docelowy wariant"]),
        2: seeded_pick(slug, "cta-2", [f"Wybieram {names[2]}", "Chcę opieki premium", "Interesuje mnie wariant premium"]),
    }
    prices = [start_price, mid_price, premium_price]
    plans = []
    for idx in range(3):
        plans.append(
            {
                "name": names[idx],
                "subtitle": subtitles[idx],
                "price": f"{prices[idx]} zł",
                "period": "/ mies.",
                "features": feature_bank[niche][idx],
                "ctaLabel": ctas[idx],
                "featured": idx == 1,
            }
        )
    return plans


def build_faq_items(slug: str, niche: str, signals: dict[str, object]) -> list[dict[str, str]]:
    banks = {
        "trening medyczny / fizjo": [
            ("Czy mogę zacząć, jeśli coś mnie boli?", "Tak, współpraca startuje od bezpiecznego zakresu i spokojnej progresji."),
            ("Jak wygląda pierwszy etap?", "Najpierw konsultacja, potem plan pierwszych tygodni i regularne korekty."),
            ("Czy to tylko dla osób po kontuzji?", "Nie. To także model dla osób po przerwie, przeciążeniu albo z celem odzyskania sprawności."),
            ("Czy potrzebuję dużej sprawności na start?", "Nie. Plan jest dopasowany do aktualnego poziomu, nie do oczekiwań z idealnego scenariusza."),
            ("Jak szybko widać zmianę?", "Pierwsze różnice zwykle widać po kilku tygodniach regularnej pracy i mniejszym chaosie w codziennym ruchu."),
        ],
        "metamorfoza sylwetki": [
            ("Czy to działa, jeśli zaczynam od zera?", "Tak. Plan jest ustawiany pod poziom startowy i realne możliwości tygodnia."),
            ("Kiedy widać pierwsze efekty?", "Najczęściej po kilku tygodniach widać zmianę w regularności, samopoczuciu i pierwszych pomiarach."),
            ("Czy trzeba trzymać ostrą dietę?", "Nie. Celem jest proces, który da się utrzymać, a nie chwilowy zryw."),
            ("Jak wygląda kontakt między treningami?", "Współpraca zakłada regularne check-iny i korekty, żeby klient nie zostawał sam z planem."),
            ("Czy to tylko redukcja?", "Nie. Strona jest ustawiona pod poprawę sylwetki szerzej: redukcję, formę i wejście w regularność."),
        ],
        "trening + odzywianie": [
            ("Czy muszę liczyć wszystko co jem?", "Nie. Start opiera się na prostych zasadach i stopniowym porządkowaniu nawyków."),
            ("Jak łączycie trening i jedzenie?", "Obie części pracują na jeden cel i są monitorowane w tym samym procesie."),
            ("Czy dam radę przy nieregularnej pracy?", "Tak. Plan jest dopasowany do realnego tygodnia, a nie do idealnych warunków."),
            ("Jak mierzymy efekt?", "Przez regularne check-iny, korekty planu i obserwację zmian w samopoczuciu oraz sylwetce."),
            ("Czy to model tylko online?", "Nie zawsze. Zależy od marki, ale komunikacja strony ma jasno tłumaczyć możliwe warianty współpracy."),
        ],
        "trening personalny 1:1": [
            ("Czy mogę zacząć od zera?", "Tak. Pierwsze tygodnie są ustawione pod poziom startowy i bezpieczne wejście w proces."),
            ("Jak wygląda pierwszy kontakt?", "Najpierw krótka konsultacja, potem rekomendacja najlepszego wariantu startu."),
            ("Czy współpraca jest tylko stacjonarna?", "To zależy od profilu trenera, ale strona ma jasno prowadzić do najlepszego wariantu kontaktu."),
            ("Co dostaję w pierwszym miesiącu?", "Plan, korekty i jasne ramy współpracy, żeby od początku wiedzieć, co robić dalej."),
            ("Czy trzeba mieć już doświadczenie?", "Nie. Oferta jest ustawiona tak, żeby wejść w nią zarówno z zerowego poziomu, jak i po przerwie."),
        ],
    }
    pool = banks[niche]
    start = int(hashlib.md5(f"{slug}:faq".encode("utf-8")).hexdigest(), 16) % len(pool)
    items = []
    for idx in range(4):
        q, a = pool[(start + idx) % len(pool)]
        if signals["is_booksy"] and idx == 1:
            q, a = ("Czy mogę umówić się od razu?", "Tak. Jeśli marka działa przez Booksy, strona powinna skracać drogę do szybkiej rezerwacji.")
        items.append({"q": q, "a": a})
    return items


def build_lead_magnet(slug: str, niche: str, display_name: str, signals: dict[str, object]) -> tuple[str, str]:
    if niche == "trening medyczny / fizjo":
        title = seeded_pick(slug, "lead-title", [
            "Pobierz checklistę: spokojny powrót do ruchu w 7 krokach.",
            "Pobierz mini-plan: jak wrócić do formy bez przeciążenia.",
            "Pobierz przewodnik: pierwszy miesiąc treningu bez bólu.",
        ])
        text = "Krótki materiał, który porządkuje start i pomaga wejść w ruch bez chaosu i bez przypadkowych decyzji."
    elif niche == "metamorfoza sylwetki":
        title = seeded_pick(slug, "lead-title", [
            "Pobierz plan: pierwsze 30 dni pracy nad sylwetką.",
            "Pobierz checklistę: jak wrócić do formy bez zrywu.",
            "Pobierz mini-przewodnik: start metamorfozy krok po kroku.",
        ])
        text = "Materiał ma pomóc klientowi zrobić pierwszy sensowny krok, zanim jeszcze wejdzie w pełne prowadzenie."
    elif niche == "trening + odzywianie":
        title = seeded_pick(slug, "lead-title", [
            "Pobierz plan startowy: trening i odżywianie na pierwszy tydzień.",
            "Pobierz checklistę: jak połączyć formę i jedzenie bez chaosu.",
            "Pobierz mini-plan: prosty start z treningiem i nawykami.",
        ])
        text = "Krótki materiał dla osób, które chcą uporządkować dwa tematy naraz, ale bez skrajnych zaleceń."
    else:
        title = seeded_pick(slug, "lead-title", [
            "Pobierz plan startowy: pierwsze 7 dni współpracy.",
            "Pobierz checklistę: jak wejść w regularny trening bez chaosu.",
            "Pobierz mini-przewodnik: pierwszy krok do współpracy 1:1.",
        ])
        text = "Lead magnet ma skracać dystans i pokazywać, że pierwszy etap współpracy jest prosty oraz dobrze poukładany."
    if signals["is_social_only"]:
        text = f"{text} Szczególnie ważne przy profilach social-only, gdzie landing musi szybko zbudować zaufanie."
    return title, text


def generate_profile_override(
    slug: str,
    display_name: str,
    niche: str,
    category: str,
    website: str,
    instagram: str,
    facebook: str,
) -> dict[str, object]:
    signals = derive_signals(display_name, website, instagram, facebook, niche, category)
    hero_top, hero_accent, hero_text = build_hero(display_name, slug, niche, signals)
    lead_title, lead_text = build_lead_magnet(slug, niche, display_name, signals)
    return {
        "brandTagline": build_brand_tagline(display_name, niche, signals),
        "heroTitleTop": hero_top,
        "heroTitleAccent": hero_accent,
        "heroText": hero_text,
        "aboutHeading": build_about_heading(display_name, signals),
        "aboutText": build_about_text(display_name, slug, niche, signals),
        "nicheLabel": niche,
        "quickWin": build_quick_win(slug, niche, signals),
        "valueProps": build_value_props(slug, niche, signals),
        "pricingPlans": build_pricing_plans(slug, niche, signals),
        "faqItems": build_faq_items(slug, niche, signals),
        "leadMagnetTitle": lead_title,
        "leadMagnetText": lead_text,
    }


def guess_niche(*values: str) -> str:
    haystack = " ".join(filter(None, [normalize_key(value) for value in values]))
    if any(token in haystack for token in ["fizjo", "medycz", "rehab", "kontuz", "bol", "mobiln"]):
        return "trening medyczny / fizjo"
    if any(token in haystack for token in ["diet", "odzyw", "nutrition"]):
        return "trening + odzywianie"
    if any(token in haystack for token in ["metamorfoz", "redukc", "sylwet", "body", "shape"]):
        return "metamorfoza sylwetki"
    return "trening personalny 1:1"


def quickwin_override(website: str, niche: str) -> dict:
    out: dict[str, object] = {}
    if not website or any(host in website for host in ["booksy.com", "facebook.com", "instagram.com"]):
        out.update({"heroMode": "single-cta", "contactMode": "qualification-3q", "singleContactCta": True, "showFirst30Days": True})
    if "booksy.com" in website:
        out.update({"showConsultationCalendar": True, "stickyMode": "consult-15"})
    if niche == "trening medyczny / fizjo":
        out.update({"showProgramFit": True})
    if niche == "trening + odzywianie":
        out.update({"leadMagnetFollowup": True})
    if niche == "metamorfoza sylwetki":
        out.setdefault("heroMode", "promise-packages")
        out.setdefault("singleContactCta", True)
    return out


def read_rows() -> list[dict]:
    with SOURCE_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    return [row for row in rows if first_email(row.get("email", ""))]


def build_about_text_legacy(preset_text: str, quickwin: str, display_name: str) -> str:
    if looks_like_person(display_name):
        return f"{preset_text} Priorytet na stronie: {quickwin}"
    return f"Komunikacja marki jest ustawiona pod jasny start, wyjaśnienie procesu współpracy i szybki kontakt. Priorytet na stronie: {quickwin}"


def build_profiles(rows: list[dict]) -> tuple[dict, dict, list[tuple[str, str]], list[dict[str, str]]]:
    profiles: dict[str, dict] = {}
    quickwins: dict[str, dict] = {}
    link_rows: list[tuple[str, str]] = []
    audit_rows: list[dict[str, str]] = []
    used_slugs: set[str] = set()
    seen_identity_keys: set[tuple[str, str]] = set()

    for row in rows:
        website, facebook, instagram = extract_links(row)
        email = first_email(row.get("email", ""))
        source_link = website or instagram or facebook

        slug_source_name = resolve_slug_source(row.get("title", ""), source_link, email)
        display_name = prettify_display_name(slug_source_name, email)
        if not slug_source_name or not display_name:
            continue

        identity_key = (normalize_key(display_name), email.lower())
        if identity_key in seen_identity_keys:
            continue
        seen_identity_keys.add(identity_key)

        base_slug = f"gdansk-{slugify(display_name)}"
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

        category = normalize(row.get("category", "")) or "Trener osobisty"
        niche = guess_niche(display_name, row.get("title", ""), source_link, website, instagram, facebook, category)
        preset = NICHE_PRESETS[niche]
        confidence = "high" if website and not any(host in website for host in ["instagram.com", "facebook.com", "booksy.com"]) else "medium"

        profile = {
            "slug": slug,
            "fullName": display_name,
            "brandName": display_name,
            "navName": nav_name(display_name),
            "brandTagline": category,
            "city": "Gdańsk",
            "address": normalize(row.get("address", "")) or "Gdańsk",
            "category": category,
            "phone": normalize(row.get("phone", "")),
            "email": email,
            "website": website,
            "instagram": instagram,
            "facebook": facebook,
            "rating": 4.9,
            "heroTitleTop": preset["hero_top"],
            "heroTitleAccent": preset["hero_accent"],
            "heroText": preset["hero_text"],
            "aboutHeading": f"{nav_name(display_name)} - trening personalny w Gdańsku.",
            "aboutText": f"{preset['about_text']} Priorytet na stronie: {preset['quickwin']}",
            "nicheLabel": niche,
            "quickWin": preset["quickwin"],
            "researchCue": f"Profil lokalny: {display_name}",
            "researchSource": source_link,
            "researchConfidence": confidence,
            "valueProps": preset["value_props"],
            "pricingPlans": preset["plans"],
            "faqItems": preset["faq"],
            "leadMagnetTitle": preset["lead_magnet_title"],
            "leadMagnetText": preset["lead_magnet_text"],
            "theme": pick_palette(slug),
        }

        profile.update(
            generate_profile_override(
                slug=slug,
                display_name=display_name,
                niche=niche,
                category=category,
                website=website,
                instagram=instagram,
                facebook=facebook,
            )
        )

        profile_override = PROFILE_OVERRIDES.get(slug)
        if profile_override:
            profile.update(profile_override)

        profiles[slug] = profile
        quickwins[slug] = quickwin_override(source_link, niche)
        link_rows.append((display_name, slug))
        audit_rows.append(
            {
                "slug": slug,
                "name": display_name,
                "niche": niche,
                "manual_override": "yes" if profile_override else "no",
                "website_kind": "social-only" if not website and (instagram or facebook) else "booksy" if "booksy.com" in website else "website",
                "hero": str(profile["heroTitleTop"]),
                "tagline": str(profile["brandTagline"]),
            }
        )

    return profiles, quickwins, link_rows, audit_rows


def write_profiles_ts(profiles: dict) -> None:
    payload = json.dumps(profiles, ensure_ascii=False, indent=2)
    content = (
        "import type { TrainerProfile } from './trainerProfile';\n\n"
        "export const gdanskTrainerProfiles: Record<string, TrainerProfile> = "
        f"{payload};\n\n"
        "export const gdanskTrainerSlugs = Object.keys(gdanskTrainerProfiles);\n"
    )
    OUT_PROFILES_TS.write_text(content, encoding="utf-8")


def write_quickwins_ts(quickwins: dict) -> None:
    payload = json.dumps({slug: value for slug, value in quickwins.items() if value}, ensure_ascii=False, indent=2)
    OUT_QW_TS.write_text(f"export const gdanskTrainerQuickWinOverrides = {payload} as const;\n", encoding="utf-8")


def write_links_md(link_rows: list[tuple[str, str]]) -> None:
    lines = [
        "# Linki localhost - trenerzy Gdańsk (single deploy)",
        "",
        "- http://localhost:5173",
        "- http://127.0.0.1:4173",
        "",
        "## Strony trenerów",
        "",
    ]
    for index, (name, slug) in enumerate(link_rows, start=1):
        lines.append(f"{index}. {name}")
        lines.append(f"   - http://localhost:5173/t/{slug}")
        lines.append(f"   - http://127.0.0.1:4173/t/{slug}")
        lines.append("")
    OUT_LINKS_MD.write_text("\n".join(lines), encoding="utf-8")


def write_audit_md(audit_rows: list[dict[str, str]]) -> None:
    lines = [
        "# Gdansk personalization audit",
        "",
        f"- profiles: {len(audit_rows)}",
        f"- manual overrides: {sum(1 for row in audit_rows if row['manual_override'] == 'yes')}",
        f"- generated full overrides: {sum(1 for row in audit_rows if row['manual_override'] == 'no')}",
        "",
        "| Slug | Name | Niche | Manual override | Website kind | Hero | Tagline |",
        "| --- | --- | --- | --- | --- | --- | --- |",
    ]
    for row in audit_rows:
        lines.append(
            f"| {row['slug']} | {row['name']} | {row['niche']} | {row['manual_override']} | {row['website_kind']} | {row['hero']} | {row['tagline']} |"
        )
    OUT_AUDIT_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    rows = read_rows()
    profiles, quickwins, links, audit_rows = build_profiles(rows)
    write_profiles_ts(profiles)
    write_quickwins_ts(quickwins)
    write_links_md(links)
    write_audit_md(audit_rows)
    print(f"profiles={len(profiles)}")
    print(f"quickwin_overrides={sum(1 for value in quickwins.values() if value)}")
    print(f"manual_overrides={sum(1 for row in audit_rows if row['manual_override'] == 'yes')}")


if __name__ == "__main__":
    main()
