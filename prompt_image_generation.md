# Промпт для Claude Code: аудит изображений и генерация промптов для AI-модели

---

## Задача

Изучи все страницы и файлы проекта. Составь полный список всех мест где нужны изображения. Затем создай файл `image-prompts.md` с промптами для генерации каждого изображения через AI image generation model (Midjourney / DALL-E / Stable Diffusion).

---

## Шаг 1 — Аудит проекта

Пройди по всем HTML-файлам проекта и найди:
- Все теги `<img>` — зафиксируй `src`, `alt`, контекст где стоит картинка
- Все CSS-свойства `background-image` — зафиксируй файл, селектор, контекст
- Все места где есть placeholder-текст типа `[ФОТО]`, `[IMAGE]`, `TODO: image`, комментарии `<!-- hero image -->` и т.д.
- Все секции которые визуально требуют изображение но его ещё нет

Составь таблицу:

| # | Файл | Место на странице | Текущий src / placeholder | Нужный размер | Описание что должно быть |
|---|------|-------------------|--------------------------|---------------|--------------------------|
| 1 | kuntsevo/index.html | Hero-блок, фон | hero-bg.jpg (отсутствует) | 1920×1080 | Праздничная атмосфера детского клуба |
| … | … | … | … | … | … |

---

## Шаг 2 — Группировка и оптимизация

После аудита сгруппируй изображения по типам и реши что можно переиспользовать:

**Правила переиспользования:**
- Изображения в блоках «Место проведения», «Галерея работ», «Афиша» — **одинаковые** для всех трёх ТЦ (дети, занятия, поделки — универсальный контент)
- **Hero-изображение (шапка)** — **уникальное** для каждого ТЦ. Должно отличаться настроением, цветовым акцентом и композицией, чтобы при переключении между ТЦ была визуальная смена
- Карточки мероприятий на сайте афиши — можно переиспользовать 3–4 базовых изображения
- Аватары отзывов — нейтральные, переиспользуются

---

## Шаг 3 — Создай файл `image-prompts.md`

Структура файла:

```
# Image Generation Prompts — Kids Club Landings

## Технические требования ко всем изображениям
- Стиль: фотореалистичный, тёплый, семейный
- Без текста и надписей на изображениях
- Без логотипов и брендинга
- Формат: JPG
- Дети всегда с родителями или в группе, никогда одни
- Этническое разнообразие: смешанная аудитория (европейская внешность преобладает, Москва)
- Освещение: яркое, радостное, не студийное — живая атмосфера

---

## ГРУППА A — Hero-изображения (уникальные для каждого ТЦ)

### A1 — Hero: Кунцево Плаза
Файл: images/kuntsevo/hero-bg.jpg
Размер: 1920×1080px
Использование: фоновое изображение главного экрана лендинга Кунцево Плаза

**Промпт:**
A vibrant, joyful children's event space inside a modern Russian shopping mall. Wide angle shot. 
Children aged 4-10 with parents, colorful decorations, balloons in warm golden and orange tones. 
Spacious hall with high ceilings, soft natural light from large windows. 
Several children doing a craft activity together at round tables. 
Warm, inviting, festive atmosphere. Moscow family lifestyle. 
Photorealistic, sharp focus, editorial quality. 
No text, no logos, no watermarks.

**Цветовой акцент:** золотисто-оранжевый (тёплый)
**Настроение:** энергичное, праздничное

---

### A2 — Hero: Каширская Плаза
Файл: images/kashirskaya/hero-bg.jpg
Размер: 1920×1080px
Использование: фоновое изображение главного экрана лендинга Каширская Плаза

**Промпт:**
A cheerful children's creative workshop inside a modern shopping center. 
Children aged 5-11 painting and creating art projects, wide smiles. 
Bright teal and blue color accents in the decor. Airy, spacious room. 
Parents watching in the background, relaxed atmosphere. 
Tables covered with colorful art supplies, finished children's artworks displayed on walls. 
Soft, cool-toned natural lighting. Contemporary Moscow family setting. 
Photorealistic, high-resolution editorial photo. 
No text, no logos, no branding.

**Цветовой акцент:** бирюзово-синий (прохладный)
**Настроение:** творческое, спокойное

---

### A3 — Hero: Капитолий
Файл: images/kapitoliy/hero-bg.jpg
Размер: 1920×1080px
Использование: фоновое изображение главного экрана лендинга Капитолий

**Промпт:**
A lively children's performance and event hall inside a shopping mall. 
Children aged 4-10 dressed up for a small show or theatrical activity, colorful costumes. 
Warm purple and magenta stage lighting accents, fairy-lights decoration. 
Excited kids and smiling parents. Festive, theatrical mood. 
Large hall with a small stage area. 
Rich, saturated colors. Dynamic composition with motion blur on children. 
Photorealistic lifestyle photography. Moscow family event. 
No text, no logos.

**Цветовой акцент:** фиолетово-малиновый (театральный)
**Настроение:** театральное, торжественное

---

## ГРУППА B — Место проведения (переиспользуются на всех трёх ТЦ)

### B1 — Интерьер зала: общий вид
Файл: images/shared/venue-hall-wide.jpg
Размер: 1200×800px
Использование: блок «Место проведения», основное фото

**Промпт:**
Interior of a clean, modern children's event hall inside a shopping mall. 
Empty room ready for an event — round tables with colorful chairs, festive decorations, 
balloons, a small stage or performance area in the background. 
Bright, well-lit space. Wooden floor, white walls with colorful accents. 
Wide angle architectural shot. No people. 
Photorealistic, interior design photography style.
No text, no logos.

---

### B2 — Интерьер зала: детали декора
Файл: images/shared/venue-hall-detail.jpg
Размер: 800×800px
Использование: блок «Место проведения», второе фото

**Промпт:**
Close-up detail shot of a beautifully decorated children's party table. 
Colorful tablecloth, small cupcakes, craft supplies, flower decorations. 
Shallow depth of field, warm bokeh background showing a bright event space. 
Joyful, festive still life. No people.
Photorealistic food and decor photography.
No text, no logos.

---

### B3 — Вид на зал во время мероприятия
Файл: images/shared/venue-event-active.jpg
Размер: 1200×800px
Использование: блок «Место проведения», третье фото (если нужно 3 фото)

**Промпт:**
Children's birthday party or workshop in progress inside a modern mall event hall. 
Overhead wide shot. 8-12 children seated at round tables doing activities. 
Colorful supplies everywhere. Adults facilitating. Cheerful, busy, organized chaos. 
Warm overhead lighting. 
Photorealistic lifestyle photography, shot from above at 45 degree angle.
No text, no logos.

---

## ГРУППА C — Галерея работ детей (переиспользуется на всех трёх ТЦ, нужно 8–12 фото)

### C1–C4 — Поделки и рисунки крупным планом

**C1 — Рисунок**
Файл: images/shared/gallery-drawing.jpg | Размер: 600×600px

**Промпт:**
A bright, expressive children's drawing on white paper, made with colorful markers and watercolors. 
Child's artwork showing a family, a house, or an animal. Joyful colors — reds, yellows, blues. 
Flat lay on a wooden table, natural light. 
No people in frame. Close-up product shot style.
No text visible on the drawing. No logos.

---

**C2 — Поделка из бумаги**
Файл: images/shared/gallery-papercraft.jpg | Размер: 600×600px

**Промпт:**
Colorful paper craft made by a child — origami animal or paper flower arrangement. 
Displayed on a white table with art supplies scattered around. 
Soft natural light, shallow depth of field. Cheerful colors. 
No people. Clean minimal composition.
No text, no logos.

---

**C3 — Лепка / глина**
Файл: images/shared/gallery-clay.jpg | Размер: 600×600px

**Промпт:**
A small colorful clay sculpture made by a child — an animal, a character, or abstract shape. 
Placed on a wooden craft table with scattered clay tools. 
Warm natural light. Playful, imperfect, charming handmade quality. 
No people. Close-up shot.
No text, no logos.

---

**C4 — Коллаж / аппликация**
Файл: images/shared/gallery-collage.jpg | Размер: 600×600px

**Промпт:**
A colorful children's collage made from cut paper, glitter, and stickers on cardboard. 
Flat lay on craft table. Vibrant mixed colors. 
Slightly messy, creative, handmade feel. 
No people. Overhead shot.
No text, no logos.

---

### C5–C8 — Дети за творчеством (в процессе)

**C5 — Ребёнок рисует**
Файл: images/shared/gallery-kid-drawing.jpg | Размер: 600×600px

**Промпт:**
A child aged 6-8 focused on drawing with colorful markers at a craft table. 
Shot from above and slightly to the side. Hands and artwork visible. 
Warm, natural indoor light. Creative workshop setting. 
Child is concentrated, tongue slightly out, enjoying the activity. 
Photorealistic lifestyle photo.
No logos, no text visible.

---

**C6 — Группа детей за столом**
Файл: images/shared/gallery-kids-group.jpg | Размер: 900×600px

**Промпт:**
A small group of 3-4 children aged 5-9 sitting together at a craft table, 
laughing and working on an art project. Mixed ethnicities, casual clothes. 
Colorful supplies all around. Bright indoor light. 
Genuine, candid moment — not posed. 
Photorealistic editorial style.
No logos, no text.

---

**C7 — Мастер-класс с взрослым**
Файл: images/shared/gallery-masterclass.jpg | Размер: 900×600px

**Промпт:**
A friendly adult workshop facilitator (woman, 28-35) showing a child how to make a craft. 
They are both smiling and engaged. Workshop table with colorful materials. 
Warm indoor light, shallow background focus. 
Natural, genuine moment. Photorealistic.
No logos, no text.

---

**C8 — Готовые работы на выставке**
Файл: images/shared/gallery-exhibition.jpg | Размер: 1200×600px

**Промпт:**
A wall display of children's artworks in a bright event hall — 
colorful drawings, crafts, and paintings pinned or taped to a white wall. 
Wide shot, no people. Joyful, varied artwork. 
Looks like an informal children's art exhibition. Natural light.
No logos, no text on the wall.

---

## ГРУППА D — Карточки мероприятий на сайте афиши (переиспользуются)

### D1 — Мастер-класс
Файл: images/shared/event-masterclass.jpg | Размер: 800×500px

**Промпт:**
Children's art masterclass event poster style photo. 
Group of kids painting at easels in a colorful studio. 
Energetic, bright, joyful. Dynamic composition.
No text, no logos. Photorealistic.

---

### D2 — Праздник / День рождения
Файл: images/shared/event-birthday.jpg | Размер: 800×500px

**Промпт:**
A children's birthday party in a modern event hall. 
Balloons, cake with candles, 6-8 children wearing party hats, laughing. 
Warm golden light, confetti in the air. 
Photorealistic, lifestyle photography. No text, no logos.

---

### D3 — Театральное мероприятие
Файл: images/shared/event-theatre.jpg | Размер: 800×500px

**Промпт:**
Children performing a short theatrical show on a small stage. 
Colorful costumes, excited audience of parents in the background. 
Warm stage lighting, dynamic moment. 
Photorealistic performance photography. No text, no logos.

---

### D4 — Научный мастер-класс / квест
Файл: images/shared/event-science.jpg | Размер: 800×500px

**Промпт:**
Children doing a fun science experiment at a workshop — 
mixing colorful liquids, making a volcano, or building something. 
Amazed expressions, goggles, lab coats sized for kids. Bright, clean setting.
Photorealistic lifestyle photo. No text, no logos.

---

## ГРУППА E — Аватары для отзывов (нейтральные, переиспользуются)

Нужно 4–6 аватаров. Все квадратные 200×200px. Все — портреты родителей 28–40 лет.

**E1 — Мама, светлые волосы**
Файл: images/shared/avatar-mom-1.jpg

**Промпт:**
Portrait photo of a smiling Russian woman, 30-35 years old, light brown hair. 
Neutral background, soft natural light. Warm, trustworthy expression. 
Square crop, face centered. Photorealistic. No text, no logos.

---

**E2 — Мама, тёмные волосы**
Файл: images/shared/avatar-mom-2.jpg

**Промпт:**
Portrait photo of a smiling woman, 32-38 years old, dark hair, friendly expression. 
Neutral or blurred indoor background. Natural light. 
Square crop, face centered. Photorealistic. No text, no logos.

---

**E3 — Папа**
Файл: images/shared/avatar-dad-1.jpg

**Промпт:**
Portrait photo of a friendly smiling man, 33-40 years old. 
Short hair, casual shirt. Neutral background, natural light. 
Warm, approachable expression. Square crop. Photorealistic. No text, no logos.

---

**E4 — Мама с ребёнком**
Файл: images/shared/avatar-mom-kid.jpg

**Промпт:**
Portrait of a happy woman 30-36 with a child aged 5-7 next to her. 
Both smiling at camera. Bright indoor background. 
Square crop, waist up. Photorealistic lifestyle. No text, no logos.

---

## Итоговый список файлов

### Уникальные (по одному на ТЦ):
- images/kuntsevo/hero-bg.jpg — A1
- images/kashirskaya/hero-bg.jpg — A2
- images/kapitoliy/hero-bg.jpg — A3

### Общие (shared, используются на всех страницах):
- images/shared/venue-hall-wide.jpg — B1
- images/shared/venue-hall-detail.jpg — B2
- images/shared/venue-event-active.jpg — B3
- images/shared/gallery-drawing.jpg — C1
- images/shared/gallery-papercraft.jpg — C2
- images/shared/gallery-clay.jpg — C3
- images/shared/gallery-collage.jpg — C4
- images/shared/gallery-kid-drawing.jpg — C5
- images/shared/gallery-kids-group.jpg — C6
- images/shared/gallery-masterclass.jpg — C7
- images/shared/gallery-exhibition.jpg — C8
- images/shared/event-masterclass.jpg — D1
- images/shared/event-birthday.jpg — D2
- images/shared/event-theatre.jpg — D3
- images/shared/event-science.jpg — D4
- images/shared/avatar-mom-1.jpg — E1
- images/shared/avatar-mom-2.jpg — E2
- images/shared/avatar-dad-1.jpg — E3
- images/shared/avatar-mom-kid.jpg — E4

**Итого: 3 уникальных + 19 общих = 22 изображения**

---

## После аудита

Если при аудите проекта ты обнаружишь дополнительные места где нужны изображения (которые не перечислены выше) — добавь их в файл `image-prompts.md` по той же структуре:
- Файл и путь
- Размер
- Где используется
- Промпт на английском
- Цветовой акцент (если Hero)
- Настроение

Затем обнови файловую структуру проекта чтобы папки `images/kuntsevo/`, `images/kashirskaya/`, `images/kapitoliy/`, `images/shared/` существовали и были правильно подключены во всех HTML-файлах.
```
